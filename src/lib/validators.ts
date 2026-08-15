import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.enum(["RENTER", "HOST"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const vehicleCreateSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  trim: z.string().optional(),
  vin: z.string().optional(),
  color: z.string().optional(),
  category: z.enum([
    "economy",
    "suv",
    "luxury",
    "electric",
    "sports",
    "van",
    "truck",
    "family",
  ]),
  description: z.string().optional(),
  seats: z.number().int().min(1).max(15).default(5),
  doors: z.number().int().min(2).max(6).default(4),
  fuelType: z
    .enum(["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID", "PLUG_IN_HYBRID"])
    .default("GASOLINE"),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]).default("AUTOMATIC"),
  drivetrain: z.enum(["FWD", "RWD", "AWD", "FOUR_WD"]).optional(),
  mileage: z.number().int().optional(),
  electricRange: z.number().int().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  dailyPrice: z.number().positive("Daily price must be positive"),
  weeklyDiscount: z.number().min(0).max(100).optional(),
  monthlyDiscount: z.number().min(0).max(100).optional(),
  cleaningFee: z.number().min(0).optional(),
  deliveryFee: z.number().min(0).optional(),
  dailyMileageLimit: z.number().int().positive().optional(),
  extraMileCharge: z.number().min(0).optional(),
  fuelPolicy: z.string().optional(),
  bookingMode: z.enum(["INSTANT", "REQUEST"]).default("REQUEST"),
  minTripDays: z.number().int().min(1).default(1),
  maxTripDays: z.number().int().min(1).default(30),
  deliveryEnabled: z.boolean().default(false),
  deliveryRadius: z.number().int().optional(),
  features: z.array(z.string()).optional(),
  longTermAvailable: z.boolean().default(false),
  rentToOwnAvailable: z.boolean().default(false),
  weeklyPrice: z.number().min(0).optional(),
  monthlyPrice: z.number().min(0).optional(),
  purchasePrice: z.number().min(0).optional(),
  rtoDownPayment: z.number().min(0).optional(),
  rtoMonthlyPayment: z.number().min(0).optional(),
  rtoTermMonths: z.number().int().min(1).optional(),
});

export const vehicleAvailabilitySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  isBlocked: z.boolean().default(true),
  reason: z.string().max(500).optional(),
});

export const vehiclePricingRuleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["percentage_discount", "percentage_increase", "fixed_amount"]),
  value: z.number().positive("Value must be positive"),
  startDate: z.string(),
  endDate: z.string(),
});

export const bookingCreateSchema = z.object({
  vehicleId: z.string().min(1),
  pickupDate: z.string().datetime(),
  returnDate: z.string().datetime(),
  pickupType: z.enum(["pickup", "delivery"]).default("pickup"),
  pickupAddress: z.string().optional(),
  addOns: z.array(z.string()).optional(),
  insuranceTier: z.string().optional(),
  promoCode: z.string().optional(),
});

export const reviewSchema = z.object({
  bookingId: z.string().min(1),
  overallRating: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5).optional(),
  communication: z.number().int().min(1).max(5).optional(),
  accuracy: z.number().int().min(1).max(5).optional(),
  pickupExperience: z.number().int().min(1).max(5).optional(),
  vehicleCondition: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional(),
});

export const searchParamsSchema = z.object({
  location: z.string().optional(),
  pickupDate: z.string().optional(),
  returnDate: z.string().optional(),
  category: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  seats: z.coerce.number().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  features: z.string().optional(),
  instantBook: z.coerce.boolean().optional(),
  delivery: z.coerce.boolean().optional(),
  minRating: z.coerce.number().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const messageSchema = z.object({
  threadId: z.string().optional(),
  bookingId: z.string().optional(),
  receiverId: z.string().min(1),
  content: z.string().min(1).max(5000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
