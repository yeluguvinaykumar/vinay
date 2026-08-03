import type { Property, Agent, Category } from "@prisma/client";

export type PropertyWithRelations = Property & {
  images: { id: string; url: string; alt: string | null; sort: number }[];
  agent: Pick<Agent, "id" | "name" | "slug" | "photo" | "title" | "phone" | "whatsapp" | "email"> | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
  _count?: { reviews: number; wishlist: number };
};

export type PropertyListItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  type: string;
  purpose: string | null;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number;
  city: string;
  state: string | null;
  address: string;
  coverImage: string | null;
  featured: boolean;
  furnished: boolean;
  createdAt: Date;
  agent?: { name: string; slug: string; photo: string | null } | null;
  category?: { name: string; slug: string } | null;
};

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  COMMERCIAL: "Commercial",
  PLOT: "Plot",
  HOUSE: "House",
  PENTHOUSE: "Penthouse",
  OFFICE: "Office",
};

export const PURPOSE_LABELS: Record<string, string> = {
  SALE: "For Sale",
  RENT: "For Rent",
};

export const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  PENDING: "Pending",
};

export const STATUS_VARIANTS: Record<string, string> = {
  AVAILABLE: "green",
  SOLD: "red",
  PENDING: "yellow",
} as const;

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow Up",
  CLOSED: "Closed",
  LOST: "Lost",
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled",
};

export const TYPE_ICONS: Record<string, string> = {
  APARTMENT: "Building2",
  VILLA: "Home",
  COMMERCIAL: "Building",
  PLOT: "MapPin",
  HOUSE: "House",
  PENTHOUSE: "Building",
  OFFICE: "Briefcase",
};

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export const NEARBY_TYPES = ["school", "hospital", "restaurant", "mall", "park", "metro"];

export const AMENITY_PRESETS = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Garden",
  "Balcony",
  "Elevator",
  "Air Conditioning",
  "Heating",
  "Furnished",
  "Home Theater",
  "Smart Home",
  "Security",
  "CCTV",
  "EV Charger",
  "Fireplace",
  "Concierge",
  "Laundry",
  "Storage",
];