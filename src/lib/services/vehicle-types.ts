export interface VehicleResult {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  category: string;
  dailyPrice: number;
  rating: number;
  reviewCount: number;
  seats: number;
  transmission: "AUTOMATIC" | "MANUAL";
  fuelType: "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID" | "PLUG_IN_HYBRID";
  features: string[];
  city: string;
  state: string;
  instantBook: boolean;
  deliveryAvailable: boolean;
  hostName: string;
  hostAvatar: string | null;
  imageUrl: string | null;
}

export interface SearchFilters {
  location?: string;
  pickupDate?: string;
  returnDate?: string;
  category?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  make?: string | string[];
  transmission?: string | string[];
  fuelType?: string | string[];
  minSeats?: number;
  features?: string | string[];
  instantBook?: boolean;
  deliveryAvailable?: boolean;
  minRating?: number;
  sort?: string;
  page?: number;
  perPage?: number;
}

export interface SearchResult {
  vehicles: VehicleResult[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
