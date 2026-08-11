import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireRole,
} from "@/lib/api-utils";

interface NHTSAResult {
  Variable: string;
  Value: string | null;
}

const FUEL_TYPE_MAP: Record<string, string> = {
  gasoline: "GASOLINE",
  diesel: "DIESEL",
  electric: "ELECTRIC",
  "compressed natural gas (cng)": "GASOLINE",
  "liquefied petroleum gas (propane or lpg)": "GASOLINE",
};

const DRIVETRAIN_MAP: Record<string, string> = {
  fwd: "FWD",
  "front-wheel drive": "FWD",
  rwd: "RWD",
  "rear-wheel drive": "RWD",
  awd: "AWD",
  "all-wheel drive": "AWD",
  "4wd": "FOUR_WD",
  "4x4": "FOUR_WD",
  "four-wheel drive": "FOUR_WD",
};

function mapCategory(bodyClass: string): string {
  const lower = bodyClass.toLowerCase();
  if (lower.includes("truck") || lower.includes("pickup")) return "truck";
  if (lower.includes("van") || lower.includes("minivan")) return "van";
  if (lower.includes("suv") || lower.includes("sport utility")) return "suv";
  if (lower.includes("convertible") || lower.includes("coupe")) return "sports";
  if (lower.includes("wagon")) return "family";
  return "economy";
}

export async function GET(request: NextRequest) {
  try {
    await requireRole("ADMIN");
    const vin = request.nextUrl.searchParams.get("vin");

    if (!vin || vin.length !== 17) {
      return errorResponse("A valid 17-character VIN is required", 400);
    }

    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return errorResponse("Failed to decode VIN from NHTSA", 502);
    }

    const data = await res.json();
    const results: NHTSAResult[] = data.Results?.[0]
      ? Object.entries(data.Results[0]).map(([Variable, Value]) => ({
          Variable,
          Value: Value as string | null,
        }))
      : [];

    const get = (key: string) => {
      const entry = results.find((r) => r.Variable === key);
      return entry?.Value && entry.Value.trim() !== "" ? entry.Value.trim() : null;
    };

    const errorCode = get("ErrorCode");
    if (errorCode && !errorCode.startsWith("0")) {
      return errorResponse(
        get("ErrorText") || "VIN could not be decoded",
        422
      );
    }

    const fuelRaw = (get("FuelTypePrimary") || "").toLowerCase();
    const electrificationRaw = (get("ElectrificationLevel") || "").toLowerCase();
    let fuelType = FUEL_TYPE_MAP[fuelRaw] || "GASOLINE";
    if (electrificationRaw.includes("bev") || electrificationRaw.includes("battery")) {
      fuelType = "ELECTRIC";
    } else if (electrificationRaw.includes("phev") || electrificationRaw.includes("plug-in")) {
      fuelType = "PLUG_IN_HYBRID";
    } else if (electrificationRaw.includes("hybrid")) {
      fuelType = "HYBRID";
    }

    const driveRaw = (get("DriveType") || "").toLowerCase();
    let drivetrain: string | null = null;
    for (const [pattern, value] of Object.entries(DRIVETRAIN_MAP)) {
      if (driveRaw.includes(pattern)) {
        drivetrain = value;
        break;
      }
    }

    const bodyClass = get("BodyClass") || "";
    const seatsRaw = get("Seats");

    const decoded = {
      vin,
      make: get("Make"),
      model: get("Model"),
      year: get("ModelYear") ? parseInt(get("ModelYear")!) : null,
      trim: get("Trim"),
      fuelType,
      drivetrain,
      transmission: (get("TransmissionStyle") || "").toLowerCase().includes("manual")
        ? "MANUAL"
        : "AUTOMATIC",
      doors: get("Doors") ? parseInt(get("Doors")!) : null,
      seats: seatsRaw ? parseInt(seatsRaw) : null,
      category: mapCategory(bodyClass),
      bodyClass,
      engineSize: get("DisplacementL") ? `${get("DisplacementL")}L` : null,
      engineCylinders: get("EngineCylinders"),
      horsepower: get("EngineHP"),
      manufacturer: get("Manufacturer"),
    };

    return successResponse(decoded);
  } catch (error) {
    return handleApiError(error);
  }
}
