export interface InsuranceQuoteRequest {
  bookingId?: string;
  vehicleCategory: string;
  vehicleValue?: number;
  tripStartDate: Date;
  tripEndDate: Date;
  driverAge?: number;
  driverLicenseYears?: number;
  state: string;
  coverageTier: string;
}

export interface InsuranceQuoteResponse {
  quoteId: string;
  coverageTier: string;
  premiumPerDay: number;
  totalPremium: number;
  deductible: number;
  coverageDetails: {
    liabilityCoverage: string;
    collisionCoverage: string;
    comprehensiveCoverage: string;
    personalInjury: string;
    roadsideAssistance: boolean;
  };
  expiresAt: Date;
  isEligible: boolean;
  ineligibilityReason?: string;
}

export interface InsuranceBindRequest {
  quoteId: string;
  bookingId: string;
  paymentConfirmed: boolean;
}

export interface InsuranceBindResponse {
  policyId: string;
  status: "active" | "failed";
  policyDocUrl?: string;
  certificateUrl?: string;
  error?: string;
}

export interface InsuranceClaimRequest {
  policyId: string;
  bookingId: string;
  incidentDate: Date;
  incidentLocation?: string;
  description: string;
  estimatedAmount?: number;
  documents?: string[];
}

interface InsuranceProviderService {
  getQuote(request: InsuranceQuoteRequest): Promise<InsuranceQuoteResponse>;
  validateEligibility(
    driverData: Record<string, unknown>,
    vehicleData: Record<string, unknown>,
    tripData: Record<string, unknown>
  ): Promise<{ eligible: boolean; reason?: string }>;
  bindPolicy(request: InsuranceBindRequest): Promise<InsuranceBindResponse>;
  getPolicy(policyId: string): Promise<Record<string, unknown> | null>;
  cancelPolicy(
    policyId: string,
    reason: string
  ): Promise<{ success: boolean; refundAmount?: number }>;
  createClaim(
    request: InsuranceClaimRequest
  ): Promise<{ claimId: string; status: string }>;
  getClaimStatus(
    claimId: string
  ): Promise<{ claimId: string; status: string; details?: Record<string, unknown> }>;
  handleWebhook(
    payload: unknown,
    signature: string
  ): Promise<{ processed: boolean }>;
}

const SANDBOX_MODE = process.env.INSURANCE_SANDBOX_MODE === "true";
const API_URL = process.env.INSURANCE_PROVIDER_API_URL;
const API_KEY = process.env.INSURANCE_PROVIDER_API_KEY;

function isConfigured(): boolean {
  return !!(API_URL && API_KEY);
}

const DEMO_PREMIUMS: Record<string, number> = {
  basic: 12,
  standard: 22,
  premium: 35,
  premium_plus: 49,
};

const DEMO_DEDUCTIBLES: Record<string, number> = {
  basic: 2500,
  standard: 1000,
  premium: 250,
  premium_plus: 0,
};

class SandboxInsuranceProvider implements InsuranceProviderService {
  async getQuote(
    request: InsuranceQuoteRequest
  ): Promise<InsuranceQuoteResponse> {
    const days = Math.ceil(
      (request.tripEndDate.getTime() - request.tripStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const premiumPerDay = DEMO_PREMIUMS[request.coverageTier] ?? 22;

    return {
      quoteId: `demo_quote_${Date.now()}`,
      coverageTier: request.coverageTier,
      premiumPerDay,
      totalPremium: premiumPerDay * days,
      deductible: DEMO_DEDUCTIBLES[request.coverageTier] ?? 1000,
      coverageDetails: {
        liabilityCoverage: "$100,000/$300,000",
        collisionCoverage: "Vehicle value",
        comprehensiveCoverage:
          request.coverageTier === "basic" ? "Not included" : "Vehicle value",
        personalInjury: "$50,000",
        roadsideAssistance: ["premium", "premium_plus"].includes(
          request.coverageTier
        ),
      },
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      isEligible: true,
    };
  }

  async validateEligibility() {
    return { eligible: true };
  }

  async bindPolicy(
    request: InsuranceBindRequest
  ): Promise<InsuranceBindResponse> {
    if (!request.paymentConfirmed) {
      return {
        policyId: "",
        status: "failed",
        error: "Payment not confirmed",
      };
    }

    return {
      policyId: `demo_policy_${Date.now()}`,
      status: "active",
      policyDocUrl: undefined,
      certificateUrl: undefined,
    };
  }

  async getPolicy(policyId: string) {
    return {
      policyId,
      status: "active",
      note: "Demo / Not active insurance",
    };
  }

  async cancelPolicy() {
    return { success: true, refundAmount: 0 };
  }

  async createClaim(request: InsuranceClaimRequest) {
    return {
      claimId: `demo_claim_${Date.now()}`,
      status: "submitted",
    };
  }

  async getClaimStatus(claimId: string) {
    return { claimId, status: "submitted" };
  }

  async handleWebhook() {
    return { processed: true };
  }
}

class NoopInsuranceProvider implements InsuranceProviderService {
  private fail(method: string): never {
    throw new Error(
      `Insurance provider not configured. Cannot call ${method}. ` +
        "Contact support for protection details."
    );
  }

  async getQuote(): Promise<InsuranceQuoteResponse> {
    return this.fail("getQuote");
  }
  async validateEligibility(): Promise<{ eligible: boolean; reason?: string }> {
    return this.fail("validateEligibility");
  }
  async bindPolicy(): Promise<InsuranceBindResponse> {
    return this.fail("bindPolicy");
  }
  async getPolicy(): Promise<Record<string, unknown> | null> {
    return this.fail("getPolicy");
  }
  async cancelPolicy(): Promise<{ success: boolean; refundAmount?: number }> {
    return this.fail("cancelPolicy");
  }
  async createClaim(): Promise<{ claimId: string; status: string }> {
    return this.fail("createClaim");
  }
  async getClaimStatus(): Promise<{ claimId: string; status: string; details?: Record<string, unknown> }> {
    return this.fail("getClaimStatus");
  }
  async handleWebhook(): Promise<{ processed: boolean }> {
    return this.fail("handleWebhook");
  }
}

export function getInsuranceProvider(): InsuranceProviderService {
  if (SANDBOX_MODE) {
    return new SandboxInsuranceProvider();
  }
  if (!isConfigured()) {
    return new NoopInsuranceProvider();
  }
  // Future: return new RealInsuranceProvider(API_URL, API_KEY);
  return new NoopInsuranceProvider();
}

export function isInsuranceAvailable(): boolean {
  return SANDBOX_MODE || isConfigured();
}
