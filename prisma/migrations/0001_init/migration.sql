-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF', 'USER');

CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'COMMERCIAL', 'PLOT', 'HOUSE', 'PENTHOUSE', 'OFFICE');

CREATE TYPE "PropertyPurpose" AS ENUM ('SALE', 'RENT');

CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING');

CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'FOLLOW_UP', 'CLOSED', 'LOST');

CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- =================================
-- users
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "image" TEXT,
  "phone" TEXT,
  "title" TEXT,
  "email_verified" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- =================================
-- agents
CREATE TABLE "agents" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "photo" TEXT,
  "title" TEXT,
  "phone" TEXT,
  "email" TEXT NOT NULL,
  "whatsapp" TEXT,
  "experience" INTEGER NOT NULL DEFAULT 0,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "bio" TEXT,
  "social" JSONB,
  "languages" TEXT[],
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- =================================
-- categories
CREATE TABLE "categories" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "icon" TEXT,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- =================================
-- properties
CREATE TABLE "properties" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "discountPrice" INTEGER,
  "type" "PropertyType" NOT NULL,
  "purpose" "PropertyPurpose",
  "bedrooms" INTEGER,
  "bathrooms" INTEGER,
  "area" DOUBLE PRECISION NOT NULL,
  "builtUpArea" DOUBLE PRECISION,
  "parking" INTEGER DEFAULT 0,
  "furnished" BOOLEAN NOT NULL DEFAULT false,
  "yearBuilt" INTEGER,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT,
  "zipCode" TEXT,
  "country" TEXT NOT NULL DEFAULT 'United States',
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "coverImage" TEXT,
  "videoUrl" TEXT,
  "amenities" TEXT[],
  "nearbyPlaces" JSONB,
  "floorPlans" JSONB,
  "tags" TEXT[],
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "views" INTEGER NOT NULL DEFAULT 0,
  "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "categoryId" TEXT,
  "agentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- =================================
-- property_images
CREATE TABLE "property_images" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "alt" TEXT,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "propertyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- =================================
-- leads
CREATE TABLE "leads" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "message" TEXT,
  "source" TEXT NOT NULL DEFAULT 'property',
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "propertyId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- =================================
-- appointments
CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "timeSlot" TEXT NOT NULL,
  "message" TEXT,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
  "propertyId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- =================================
-- messages
CREATE TABLE "messages" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- =================================
-- blog_categories
CREATE TABLE "blog_categories" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- =================================
-- blogs
CREATE TABLE "blogs" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "coverImage" TEXT,
  "author" TEXT NOT NULL DEFAULT 'VINAY Team',
  "authorImage" TEXT,
  "categoryId" TEXT,
  "tags" TEXT[],
  "views" INTEGER NOT NULL DEFAULT 0,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- =================================
-- testimonials
CREATE TABLE "testimonials" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT,
  "content" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "avatar" TEXT,
  "company" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- =================================
-- newsletter
CREATE TABLE "newsletter" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- =================================
-- reviews
CREATE TABLE "reviews" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "userId" TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "rating" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "approved" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- =================================
-- wishlist
CREATE TABLE "wishlist" (
  "id" TEXT NOT NULL,
  "guestId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- =================================
-- settings
CREATE TABLE "settings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- =================================
-- unique constraints
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "agents_slug_key" ON "agents"("slug");
CREATE UNIQUE INDEX "agents_email_key" ON "agents"("email");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");
CREATE UNIQUE INDEX "wishlist_guestId_propertyId_key" ON "wishlist"("guestId", "propertyId");
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- =================================
-- Property indexes
CREATE INDEX "properties_type_status_idx" ON "properties"("type", "status");
CREATE INDEX "properties_city_idx" ON "properties"("city");
CREATE INDEX "properties_featured_idx" ON "properties"("featured");
CREATE INDEX "leads_status_idx" ON "leads"("status");
CREATE INDEX "appointments_date_idx" ON "appointments"("date");
CREATE INDEX "blogs_published_idx" ON "blogs"("published");

-- =================================
-- Foreign keys
ALTER TABLE "properties" ADD CONSTRAINT "properties_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "properties" ADD CONSTRAINT "properties_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "leads" ADD CONSTRAINT "leads_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;