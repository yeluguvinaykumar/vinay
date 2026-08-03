import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(120, "Email is too long");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name is too long");

export const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .optional()
  .or(z.literal(""));

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/[0-9]/, "Include a number");

// ---------- Auth ----------
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(72),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Invalid token"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---------- Public forms ----------
export const leadSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  propertyId: z.string().optional().nullable(),
  source: z.string().max(30).optional(),
});

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().trim().min(3, "Subject is required").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000),
});

export const appointmentSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  date: z.string().min(1, "Pick a date").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  timeSlot: z.string().min(1, "Pick a time slot"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  propertyId: z.string().optional().nullable(),
});

export const newsletterSchema = z.object({ email: emailSchema });

export const reviewSchema = z.object({
  propertyId: z.string().min(1),
  name: nameSchema,
  email: emailSchema.optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5, "Comment must be at least 5 characters").max(2000),
});

// ---------- Property ----------
const typeEnum = ["APARTMENT", "VILLA", "COMMERCIAL", "PLOT", "HOUSE", "PENTHOUSE", "OFFICE"] as const;
const purposeEnum = ["SALE", "RENT"] as const;
const statusEnum = ["AVAILABLE", "SOLD", "PENDING"] as const;

export const propertySchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().trim().min(2).max(200).optional().or(z.literal("")),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(20000),
  price: z.coerce.number().int().positive("Enter a valid price"),
  discountPrice: z.coerce.number().int().nonnegative().optional().nullable().or(z.literal("")),
  type: z.enum(typeEnum),
  purpose: z.enum(purposeEnum).nullable().optional(),
  bedrooms: z.coerce.number().int().min(0).max(50).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional().nullable(),
  area: z.coerce.number().positive("Area is required"),
  builtUpArea: z.coerce.number().positive().optional().nullable(),
  parking: z.coerce.number().int().min(0).max(100).optional().nullable(),
  furnished: z.coerce.boolean().optional(),
  yearBuilt: z.coerce.number().int().min(1800).max(2100).optional().nullable(),
  address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().max(100).optional().nullable(),
  zipCode: z.string().trim().max(20).optional().nullable(),
  country: z.string().trim().min(2).max(100).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  coverImage: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  amenities: z.array(z.string().max(60)).max(50).optional(),
  nearbyPlaces: z
    .array(z.object({ name: z.string().max(120), type: z.string().max(20), distance: z.string().max(20) }))
    .max(30)
    .optional(),
  floorPlans: z.array(z.string().url()).max(20).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  featured: z.coerce.boolean().optional(),
  status: z.enum(statusEnum).optional(),
  categoryId: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
  gallery: z.array(z.string().url()).max(30).optional(),
});

export const propertyQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  city: z.string().trim().max(80).optional(),
  type: z.enum(typeEnum).optional(),
  purpose: z.enum(purposeEnum).optional(),
  status: z.enum(statusEnum).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  beds: z.coerce.number().int().min(0).optional(),
  baths: z.coerce.number().int().min(0).optional(),
  minArea: z.coerce.number().positive().optional(),
  maxArea: z.coerce.number().positive().optional(),
  furnished: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  category: z.string().trim().max(80).optional(),
  agent: z.string().trim().max(80).optional(),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(48).optional(),
});

export const propertyListFilterSchema = z.object({
  q: z.string().trim().max(120).optional(),
  city: z.string().trim().max(80).optional(),
  type: z.enum(typeEnum).optional(),
  purpose: z.enum(purposeEnum).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  beds: z.coerce.number().int().min(0).optional(),
  baths: z.coerce.number().int().min(0).optional(),
  furnished: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]).optional(),
});

export const agentSchema = z.object({
  name: nameSchema,
  slug: z.string().trim().min(2).max(100).optional(),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  photo: z.string().url().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: emailSchema,
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  experience: z.coerce.number().int().min(0).max(70).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  bio: z.string().trim().max(4000).optional().or(z.literal("")),
  languages: z.array(z.string().max(40)).max(10).optional(),
  social: z.record(z.string(), z.string().url()).optional(),
  active: z.coerce.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().min(2).max(80).optional(),
  icon: z.string().trim().max(40).optional().or(z.literal("")),
  sort: z.coerce.number().int().min(0).optional(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(5).max(200),
  slug: z.string().trim().min(2).max(200).optional().or(z.literal("")),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().trim().min(30, "Content must be at least 30 characters").max(100000),
  coverImage: z.string().url().optional().or(z.literal("")),
  author: z.string().trim().max(80).optional(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string().max(40)).max(10).optional(),
  published: z.coerce.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  metaTitle: z.string().trim().max(80).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(180).optional().or(z.literal("")),
});

export const testimonialSchema = z.object({
  name: nameSchema,
  role: z.string().trim().max(80).optional().or(z.literal("")),
  company: z.string().trim().max(80).optional().or(z.literal("")),
  content: z.string().trim().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  avatar: z.string().url().optional().or(z.literal("")),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
});

export const settingsSchema = z.record(z.string(), z.string().max(5000));
export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  currentPassword: z.string().min(1).max(72),
  newPassword: passwordSchema.optional().or(z.literal("")),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type AgentInput = z.infer<typeof agentSchema>;
export type BlogInput = z.infer<typeof blogSchema>;