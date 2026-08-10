export const APP_NAME = "Joy Rental Express";
export const APP_DESCRIPTION =
  "Find and rent the perfect car from trusted hosts or our own fleet.";
export const CURRENCY = "USD";
export const COUNTRY = "US";

export const PLATFORM_FEE_OPTIONS = [8, 10, 12, 15] as const;
export const DEFAULT_HOST_FEE_RATE = 12;
export const DEFAULT_RENTER_FEE_RATE = 10;

export const VEHICLE_CATEGORIES = [
  { value: "economy", label: "Economy", icon: "🚗" },
  { value: "suv", label: "SUV", icon: "🚙" },
  { value: "luxury", label: "Luxury", icon: "✨" },
  { value: "electric", label: "Electric", icon: "⚡" },
  { value: "sports", label: "Sports", icon: "🏎️" },
  { value: "van", label: "Van", icon: "🚐" },
  { value: "truck", label: "Truck", icon: "🛻" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
] as const;

export const FUEL_TYPES = [
  { value: "GASOLINE", label: "Gasoline" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "PLUG_IN_HYBRID", label: "Plug-in Hybrid" },
] as const;

export const TRANSMISSION_TYPES = [
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "MANUAL", label: "Manual" },
] as const;

export const VEHICLE_FEATURES = [
  "GPS",
  "Apple CarPlay",
  "Android Auto",
  "Bluetooth",
  "Backup Camera",
  "Heated Seats",
  "Sunroof",
  "Child Seat",
  "Pet Friendly",
  "Bike Rack",
  "Snow Tires",
  "Unlimited Mileage",
  "Wheelchair Accessible",
  "Keyless Entry",
  "Cruise Control",
  "USB Charger",
  "Aux Input",
  "Toll Pass",
  "Ski Rack",
  "Roof Rack",
] as const;

export const BOOKING_STATUSES = {
  DRAFT: { label: "Draft", color: "gray" },
  PENDING_PAYMENT: { label: "Pending Payment", color: "yellow" },
  PENDING_APPROVAL: { label: "Pending Approval", color: "yellow" },
  CONFIRMED: { label: "Confirmed", color: "green" },
  DECLINED: { label: "Declined", color: "red" },
  CANCELLED_BY_RENTER: { label: "Cancelled", color: "red" },
  CANCELLED_BY_HOST: { label: "Cancelled by Host", color: "red" },
  PAYMENT_FAILED: { label: "Payment Failed", color: "red" },
  PICKUP_READY: { label: "Ready for Pickup", color: "blue" },
  IN_PROGRESS: { label: "In Progress", color: "blue" },
  RETURN_PENDING: { label: "Return Pending", color: "orange" },
  COMPLETED: { label: "Completed", color: "green" },
  DISPUTED: { label: "Disputed", color: "red" },
  CLOSED: { label: "Closed", color: "gray" },
} as const;

export const INSURANCE_TIERS = [
  {
    id: "basic",
    name: "Basic Protection",
    description: "Minimum liability coverage required by state law",
    deductible: 2500,
  },
  {
    id: "standard",
    name: "Standard Protection",
    description: "Comprehensive coverage with moderate deductible",
    deductible: 1000,
  },
  {
    id: "premium",
    name: "Premium Protection",
    description: "Full coverage with low deductible and roadside assistance",
    deductible: 250,
  },
  {
    id: "premium_plus",
    name: "Premium Plus",
    description: "Zero deductible with maximum protection",
    deductible: 0,
  },
] as const;

export const COLORS = {
  primary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  secondary: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
} as const;
