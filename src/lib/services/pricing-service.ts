import { calculateDaysBetween } from "@/lib/utils";

export interface PriceBreakdown {
  dailyRate: number;
  numDays: number;
  subtotal: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  deliveryFee: number;
  cleaningFee: number;
  airportFee: number;
  youngDriverFee: number;
  additionalDriverFee: number;
  addOnTotal: number;
  insuranceFee: number;
  serviceFee: number;
  taxAmount: number;
  depositAmount: number;
  totalPrice: number;
  hostEarnings: number;
  platformFee: number;
}

export interface PricingInput {
  dailyPrice: number;
  pickupDate: Date;
  returnDate: Date;
  weeklyDiscount?: number | null;
  monthlyDiscount?: number | null;
  cleaningFee?: number | null;
  deliveryFee?: number | null;
  airportFee?: number | null;
  isDelivery?: boolean;
  isAirport?: boolean;
  youngDriverFee?: number;
  additionalDrivers?: number;
  additionalDriverFeePerDay?: number;
  addOns?: { pricePerDay: number; name: string }[];
  insuranceFee?: number;
  hostFeeRate?: number;
  renterFeeRate?: number;
  taxRate?: number;
  depositAmount?: number;
}

export function calculatePricing(input: PricingInput): PriceBreakdown {
  const numDays = calculateDaysBetween(input.pickupDate, input.returnDate);
  const dailyRate = input.dailyPrice;
  let subtotal = dailyRate * numDays;

  let weeklyDiscount = 0;
  if (numDays >= 7 && input.weeklyDiscount) {
    weeklyDiscount = subtotal * (input.weeklyDiscount / 100);
  }

  let monthlyDiscount = 0;
  if (numDays >= 30 && input.monthlyDiscount) {
    monthlyDiscount = subtotal * (input.monthlyDiscount / 100);
    weeklyDiscount = 0;
  }

  subtotal = subtotal - weeklyDiscount - monthlyDiscount;

  const deliveryFee = input.isDelivery ? (input.deliveryFee ?? 0) : 0;
  const cleaningFee = input.cleaningFee ?? 0;
  const airportFee = input.isAirport ? (input.airportFee ?? 0) : 0;
  const youngDriverFee = input.youngDriverFee ?? 0;
  const additionalDriverFee =
    (input.additionalDrivers ?? 0) *
    (input.additionalDriverFeePerDay ?? 0) *
    numDays;

  const addOnTotal =
    input.addOns?.reduce((sum, a) => sum + a.pricePerDay * numDays, 0) ?? 0;

  const insuranceFee = (input.insuranceFee ?? 0) * numDays;

  const preTaxTotal =
    subtotal +
    deliveryFee +
    cleaningFee +
    airportFee +
    youngDriverFee +
    additionalDriverFee +
    addOnTotal +
    insuranceFee;

  const renterFeeRate = input.renterFeeRate ?? 10;
  const serviceFee = Math.round(subtotal * (renterFeeRate / 100) * 100) / 100;

  const taxRate = input.taxRate ?? 0;
  const taxAmount =
    Math.round((preTaxTotal + serviceFee) * (taxRate / 100) * 100) / 100;

  const depositAmount = input.depositAmount ?? 0;

  const totalPrice =
    Math.round((preTaxTotal + serviceFee + taxAmount) * 100) / 100;

  const hostFeeRate = input.hostFeeRate ?? 12;
  const platformFee = Math.round(subtotal * (hostFeeRate / 100) * 100) / 100;
  const hostEarnings =
    Math.round(
      (subtotal +
        deliveryFee +
        cleaningFee +
        airportFee +
        addOnTotal -
        platformFee) *
        100
    ) / 100;

  return {
    dailyRate,
    numDays,
    subtotal: Math.round(subtotal * 100) / 100,
    weeklyDiscount: Math.round(weeklyDiscount * 100) / 100,
    monthlyDiscount: Math.round(monthlyDiscount * 100) / 100,
    deliveryFee,
    cleaningFee,
    airportFee,
    youngDriverFee,
    additionalDriverFee,
    addOnTotal: Math.round(addOnTotal * 100) / 100,
    insuranceFee: Math.round(insuranceFee * 100) / 100,
    serviceFee,
    taxAmount,
    depositAmount,
    totalPrice,
    hostEarnings,
    platformFee,
  };
}
