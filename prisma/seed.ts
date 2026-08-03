import { PrismaClient, PropertyType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  villa1: U("photo-1613490493576-7fde63acd811"),
  villa2: U("photo-1580587771525-78b9dba3b914"),
  villa3: U("photo-1600596542815-ffad4c1539a9"),
  modern1: U("photo-1600585154340-be6161a56a0c"),
  modern2: U("photo-1600607687939-ce8a6c25118c"),
  apt1: U("photo-1502672260266-1c1ef2d93688"),
  apt2: U("photo-1522708323590-d24dbb6b0267"),
  apt3: U("photo-1493809842364-78817add7ffb"),
  office1: U("photo-1497366754035-f200968a6e72"),
  penthouse1: U("photo-1600607687920-4e2a09cf159d"),
  plot1: U("photo-1500382017468-9049fed747ef"),
  house1: U("photo-1564013799919-ab600027ffc6"),
  house2: U("photo-1568605114967-8130f3a36994"),
  commercial1: U("photo-1554469384-e58fac16e23a"),
  pool: U("photo-1600585154526-990dced4db0d"),
  kitchen: U("photo-1556911220-bff31c812dba"),
  living: U("photo-1600210492486-724fe5c67fb0"),
  hero: U("photo-1560518883-ce09059eeffa", 1920),
  blog1: U("photo-1560518883-ce09059eeffa"),
  blog2: U("photo-1460317442991-0ec209397118"),
  blog3: U("photo-1571889562646-4ff9115a31c0"),
  blog4: U("photo-1486406146926-c627a92ad1ab"),
  blog5: U("photo-1512917774080-9991f1c4c750"),
};

const av = {
  a: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  b: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  c: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
  d: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
  e: "https://images.unsplash.com/photo-1479143010022-42a7a8fe5a9e?auto=format&fit=crop&w=240&q=80",
};

const settings: Record<string, string> = {
  site_name: "VINAY",
  tagline: "Find Your Dream Property",
  description:
    "VINAY is a premium real estate platform helping you discover luxury apartments, villas, commercial spaces and plots.",
  phone: "+1 (415) 555-0182",
  email: "hello@vinay.com",
  address: "1280 Mission Street, San Francisco, CA 94103",
  whatsapp: "14155550182",
  mapLink: "https://maps.google.com/?q=San+Francisco",
  business_hours: "Mon – Sat: 9:00 AM – 7:00 PM",
  social_facebook: "https://facebook.com/vinay",
  social_instagram: "https://instagram.com/vinay",
  social_twitter: "https://twitter.com/vinay",
  social_linkedin: "https://linkedin.com/company/vinay",
  hero_headline: "Find Your Dream Home",
  hero_subheading: "Discover premium apartments, villas, and commercial properties.",
  stats_years: "18",
  stats_sold: "3200",
  stats_clients: "4600",
  stats_cities: "25",
  seo_title: "VINAY | Find Your Dream Property",
  seo_description:
    "Browse luxury apartments, villas, houses, plots and commercial real estate. VINAY helps you find your dream property.",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  console.log("🌱 Seeding database…");

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@vinay.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "VINAY Admin",
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN",
      title: "Administrator",
    },
  });
  console.log(`✔ Admin → ${adminEmail} / ${adminPassword}`);

  const cats = ["Apartments", "Villas", "Houses", "Commercial", "Plots"];
  const catId: Record<string, string> = {};
  for (const [i, name] of cats.entries()) {
    const slug = slugify(name);
    const row = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, sort: i + 1 },
    });
    catId[slug] = row.id;
  }

  const blogCatsData = [
    "Market Insights",
    "Buying Guide",
    "Interior & Design",
    "Rental Tips",
    "Investment",
  ];
  const bcatId: Record<string, string> = {};
  for (const name of blogCatsData) {
    const slug = slugify(name);
    const row = await prisma.blogCategory.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    bcatId[slug] = row.id;
  }

  const agentsData = [
    {
      name: "Aarav Sharma",
      slug: "aarav-sharma",
      title: "Senior Luxury Agent",
      photo: av.b,
      phone: "+1 (415) 555-0101",
      email: "aarav@vinay.com",
      whatsapp: "14155550101",
      experience: 12,
      rating: 4.9,
      bio: "Aarav has closed over $120M in luxury real estate. He specialises in premium villas and penthouses.",
      social: { facebook: "#", linkedin: "#", instagram: "#" },
      languages: ["English", "Hindi"],
    },
    {
      name: "Sophia Bennett",
      slug: "sophia-bennett",
      title: "Head of Apartments",
      photo: av.a,
      phone: "+1 (415) 555-0102",
      email: "sophia@vinay.com",
      whatsapp: "14155550102",
      experience: 9,
      rating: 4.8,
      bio: "Sophia leads our residential vertical and has helped 900+ families find their dream apartments.",
      languages: ["English", "French"],
    },
    {
      name: "Daniel Kim",
      slug: "daniel-kim",
      title: "Commercial Director",
      photo: av.c,
      email: "daniel@vinay.com",
      phone: "+1 (415) 555-0103",
      experience: 14,
      rating: 4.9,
      bio: "Daniel specialises in commercial spaces and office leasing for Fortune 500 companies.",
      languages: ["English", "Korean"],
    },
    {
      name: "Emily Carter",
      slug: "emily-carter",
      title: "Plot & Land Specialist",
      photo: av.a,
      email: "emily@vinay.com",
      experience: 7,
      rating: 4.7,
      bio: "Emily guides investors to the best plot opportunities with transparent documentation.",
      languages: ["English", "Spanish"],
    },
    {
      name: "Michael Chen",
      slug: "michael-chen",
      title: "Rental Manager",
      photo: av.b,
      email: "michael@vinay.com",
      experience: 11,
      rating: 4.8,
      bio: "Michael oversees our rental catalogue and welcomes landlord & tenant peace of mind.",
      languages: ["English", "Mandarin"],
    },
    {
      name: "Priya Patel",
      slug: "priya-patel",
      title: "Interior & Staging Expert",
      photo: av.d,
      email: "priya@vinay.com",
      experience: 8,
      rating: 4.9,
      bio: "Priya stages homes that sell faster and for more with beautiful interior styling.",
      languages: ["English", "Hindi"],
    },
  ];
  const agentData = [] as { id: string; name: string }[];
  for (const a of agentsData) {
    const row = await prisma.agent.upsert({ where: { slug: a.slug }, update: {}, create: a });
    agentData.push({ id: row.id, name: row.name });
  }

  const agentBySlug = (slug: string) => agentData.find((a) => a.name === slug)?.id ?? null;

  const props = [
    {
      title: "Sunset Ridge Luxury Villa",
      type: "VILLA",
      purpose: "SALE",
      price: 1850000,
      bedrooms: 5,
      bathrooms: 4,
      area: 620,
      parking: 3,
      furnished: true,
      yearBuilt: 2022,
      city: "San Francisco",
      state: "CA",
      address: "12 Sunset Ridge, Pacific Heights",
      coverImage: IMG.villa1,
      featured: true,
      categoryId: catId["villas"],
      agentName: "Aarav Sharma",
      description: "Perched on the Pacific Heights ridge, this architectural villa offers sweeping Golden Gate views, a resort pool, wine cellar and smart-home automation. Every floor is wrapped in floor-to-ceiling glass flooding the interiors with natural light. The primary suite opens to a private terrace overlooking the garden.",
      amenities: ["Swimming Pool", "Home Theater", "Wine Cellar", "Smart Home", "Garden", "Gym", "EV Charger", "CCTV"],
      nearby: [
        { name: "Presidio Middle School", type: "school", distance: "1.2 mi" },
        { name: "UCSF Medical Center", type: "hospital", distance: "2.1 mi" },
        { name: "Sotto Mare Restaurant", type: "restaurant", distance: "1.4 mi" },
      ],
      gallery: [IMG.villa1, IMG.living, IMG.pool, IMG.kitchen],
    },
    {
      title: "The Meridian Modern Apartment",
      slug: "the-meridian-modern-apartment",
      type: "APARTMENT",
      purpose: "SALE",
      price: 720000,
      discountPrice: 690000,
      bedrooms: 2,
      bathrooms: 2,
      area: 148,
      parking: 1,
      furnished: true,
      yearBuilt: 2021,
      city: "New York",
      state: "NY",
      address: "88 Meridian Ave, Upper West Side",
      coverImage: IMG.apt1,
      featured: true,
      categoryId: catId["apartments"],
      agentName: "Sophia Bennett",
      description: "A refined two-bedroom apartment in the heart of the Upper West Side with a Juliet balcony, chef's kitchen and white-glove doorman building.",
      amenities: ["Concierge", "Elevator", "Balcony", "Central AC", "Laundry", "Fitness Center"],
      nearby: [
        { name: "PS 166", type: "school", distance: "0.4 mi" },
        { name: "Mount Sinai West", type: "hospital", distance: "0.9 mi" },
        { name: "The Milling Room", type: "restaurant", distance: "0.5 mi" },
      ],
      gallery: [IMG.apt1, IMG.apt2, IMG.apt3, IMG.living],
    },
    {
      title: "Golden Gate Plots — 1 Acre",
      slug: "golden-gate-plots-1-acre",
      type: "PLOT",
      purpose: "SALE",
      price: 460000,
      bedrooms: 0,
      bathrooms: 0,
      area: 4047,
      city: "San Jose",
      state: "CA",
      address: "Plot 23, Golden Gate Estate",
      coverImage: IMG.plot1,
      featured: false,
      categoryId: catId["plots"],
      agentName: "Emily Carter",
      description: "Prime 1-acre plot in the fast-growing Golden Gate Estate with electricity, water and road access. Zoned for single-family or duplex dwelling.",
      amenities: ["Boundary Wall", "Road Access", "Water Supply", "Electricity"],
      gallery: [IMG.plot1, IMG.plot1],
    },
    {
      title: "Harbour View Commercial Tower Floor",
      slug: "harbour-view-commercial-tower-floor",
      type: "COMMERCIAL",
      purpose: "RENT",
      price: 18500,
      bedrooms: 0,
      bathrooms: 2,
      area: 850,
      parking: 20,
      furnished: false,
      yearBuilt: 2020,
      city: "San Francisco",
      state: "CA",
      address: "1 Harbour Lane, Financial District",
      coverImage: IMG.commercial1,
      featured: true,
      categoryId: catId["commercial"],
      agentName: "Daniel Kim",
      description: "An entire floor of premium commercial space with harbour views, 24/7 access, high-speed elevators and room for 120+ desks.",
      amenities: ["24/7 Access", "High-Speed Elevators", "Conferencing Rooms", "Parking"],
      gallery: [IMG.commercial1, IMG.office1, IMG.villa2],
    },
    {
      title: "Camden Cottage with Garden",
      slug: "camden-cottage-with-garden",
      type: "HOUSE",
      purpose: "SALE",
      price: 1100000,
      bedrooms: 3,
      bathrooms: 2,
      area: 210,
      parking: 2,
      furnished: false,
      yearBuilt: 2018,
      city: "Seattle",
      state: "WA",
      address: "23 Camden Rd, Queen Anne",
      coverImage: IMG.house1,
      featured: false,
      categoryId: catId["houses"],
      agentName: "Priya Patel",
      description: "Charming cottage with a mature garden, sunroom and beautifully renovated kitchen on a quiet tree-lined street.",
      amenities: ["Garden", "Sunroom", "Fireplace", "Garage"],
      gallery: [IMG.house1, IMG.house2, IMG.kitchen],
    },
    {
      title: "Skyline Penthouse",
      slug: "skyline-penthouse",
      type: "PENTHOUSE",
      purpose: "SALE",
      price: 2400000,
      discountPrice: 2290000,
      bedrooms: 4,
      bathrooms: 3,
      area: 380,
      parking: 2,
      furnished: true,
      yearBuilt: 2023,
      city: "Chicago",
      state: "IL",
      address: "900 Peninsula Blvd",
      coverImage: IMG.penthouse1,
      featured: true,
      agentName: "Aarav Sharma",
      description: "Sky-high penthouse with a wraparound terrace, private elevator and panoramic views of the river and skyline.",
      amenities: ["Private Elevator", "Wraparound Terrace", "Smart Home", "Gym", "Parking"],
      gallery: [IMG.penthouse1, IMG.living, IMG.kitchen, IMG.villa3],
    },
    {
      title: "Lakeshore Executive Apartment",
      slug: "lakeshore-executive-apartment",
      type: "APARTMENT",
      purpose: "RENT",
      price: 3200,
      bedrooms: 1,
      bathrooms: 1,
      area: 76,
      parking: 1,
      furnished: true,
      yearBuilt: 2019,
      city: "Austin",
      state: "TX",
      address: "5800 Lakeshore Dr",
      coverImage: IMG.apt3,
      featured: false,
      categoryId: catId["apartments"],
      agentName: "Michael Chen",
      description: "Furnished executive one-bedroom on the lakeshore with gym, co-working and a panoramic terrace. Ideal for professionals.",
      amenities: ["Gym", "Co-Working", "Roof Terrace", "Central AC"],
      gallery: [IMG.apt3, IMG.living, IMG.pool],
    },
    {
      title: "Virginia Craftsman Family Home",
      slug: "hawthorn-family-home",
      type: "HOUSE",
      purpose: "SALE",
      price: 680000,
      bedrooms: 4,
      bathrooms: 3,
      area: 265,
      parking: 2,
      furnished: false,
      yearBuilt: 2016,
      city: "Austin",
      state: "TX",
      address: "14 Hawthorn Lane",
      coverImage: IMG.villa2,
      featured: true,
      categoryId: catId["houses"],
      agentName: "Priya Patel",
      description: "Bright four-bedroom family home with an open plan living area, home office and a landscaped backyard with sprinkler system.",
      amenities: ["Backyard", "Home Office", "2 Car Garage", "Storage"],
      gallery: [IMG.villa2, IMG.house1, IMG.modern1],
    },
  ];

  for (const p of props) {
    const existing = await prisma.property.findUnique({ where: { slug: p.slug } });
    const data = {
      title: p.title,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      type: p.type as PropertyType,
      purpose: p.purpose as "SALE" | "RENT",
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area,
      parking: p.parking ?? 0,
      furnished: p.furnished,
      yearBuilt: p.yearBuilt,
      city: p.city,
      state: p.state,
      address: p.address,
      coverImage: p.coverImage,
      amenities: p.amenities,
      nearbyPlaces: p.nearby,
      featured: p.featured,
      status: (p.status as 'AVAILABLE' | 'SOLD' | 'PENDING') ?? "AVAILABLE",
      categoryId: p.categoryId,
      agentId: agentBySlug(p.agentName),
    };
    if (existing) {
      await prisma.property.update({ where: { id: existing.id }, data: { ...data, title: p.title } });
    } else {
      await prisma.property.create({ data: { ...data, slug: p.slug, images: { create: p.gallery.map((url, i) => ({ url, alt: p.title, sort: i })) } } });
    }
  }
  console.log(`✔ ${props.length} properties`);

  // ---- Testimonials ----
  const testimonials = [
    { name: "Rahul Verma", role: "Homeowner", company: "Pacific Heights", rating: 5, content: "VINAY made buying our dream villa effortless. The team negotiated a fantastic price and handled every document. Truly five-star service." },
    { name: "Jessica Moore", role: "Investor", company: "NYC Portfolios", rating: 5, content: "I've closed three commercial deals through VINAY. Their market insights and transparent process are unmatched in the industry." },
    { name: "David Osei", role: "First-time buyer", company: "Seattle", rating: 4, content: "As a first-time buyer I was nervous, but Emily guided me through everything — from mortgage to closing. We love our new home!" },
    { name: "Ananya Iyer", role: "Landlord", company: "Austin", rating: 5, content: "VINAY manages our rental portfolio flawlessly. Reliable tenants, on-time rent, and zero headaches. Worth every penny." },
    { name: "Marcus Reid", role: "Developer", company: "SF Developments", rating: 5, content: "Harbour View floor leased in under three weeks. Their commercial team knows exactly how to position premium space." },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: { ...t, featured: true, active: true, avatar: av.c } });
  }

  // ---- Blog posts ----
  const blogs = [
    {
      title: "Top 10 Luxury Real Estate Trends in 2025",
      slug: "top-10-luxury-real-estate-trends-2025",
      excerpt: "From smart homes to sustainable villas — here are the trends shaping the premium property market this year.",
      coverImage: IMG.blog1,
      categorySlug: "market-insights",
      tags: ["Luxury", "Trends"],
      content: "The luxury market is evolving fast. Buyers today expect wellness amenities, smart home integration, and sustainability. In this post we break down the top ten trends driving premium real estate decisions, and what they mean for buyers and sellers alike.\n\n1. Smart homes that learn.\n2. Health-first design.\n3. Sustainable but lavish.\n4. Golf and resort living.\n5. Home office is now a must.\n6. Experiencing before buying.\n\nWhether you are upsizing or investing, VINAY's advisors can help you navigate this exciting market.",
    },
    {
      title: "A First-Time Buyer's Step-by-Step Guide",
      slug: "first-time-buyer-step-by-step-guide",
      excerpt: "Everything you need to know — from budgeting and mortgages to closing day.",
      coverImage: IMG.blog2,
      categorySlug: "buying-guide",
      tags: ["Buying", "Guide"],
      content: "Buying your first home can feel overwhelming. This guide covers budgeting, pre-approval, finding the right neighborhood, making an offer, and what to expect on closing day.\n\nStep 1: Check your finances.\nStep 2: Get pre-approved.\nStep 3: Define must-haves.\nStep 4: Tour and shortlist.\nStep 5: Negotiate and close.\n\nOur agents are here to simplify each step — reach out any time.",
    },
    {
      title: "How Interior Staging Increase Property Value",
      slug: "how-interior-staging-increase-property-value",
      excerpt: "Neutral palettes, furniture flow, and light: how staging helps homes sell faster and at a higher price.",
      coverImage: IMG.blog3,
      categorySlug: "interior-design",
      tags: ["Interior", "Design"],
      content: "Staging is one of the highest-return improvements a seller can make. It highlights the property's best spaces and lets buyers visualize the lifestyle. This post shares practical staging tips, budgets, and the numbers behind faster sales.",
    },
    {
      title: "Rent or Buy? The Complete Cost Comparison",
      slug: "rent-or-buy-complete-cost-comparison",
      excerpt: "Renting offers flexibility; buying builds equity. Here is a data-driven breakdown to help you decide.",
      coverImage: IMG.blog4,
      categorySlug: "rental-tips",
      tags: ["Rent", "Finance"],
      content: "A careful comparison of renting vs owning across ten cities — including down payments, monthly costs, maintenance, and equity growth. Use our mortgage calculator to model your own situation before you decide.",
    },
    {
      title: "Real Estate Investment 101: What to Buy in 2026",
      slug: "real-estate-investment-101-2026",
      excerpt: "Apartments, plots, or commercial? Learn which asset class fits your goals this year.",
      coverImage: IMG.blog5,
      categorySlug: "investment",
      tags: ["Investment"],
      content: "The best investment property depends on your goals. We compare five asset classes — residential income, rental apartments, plots, commercial, and short-term vacation rentals — on yields, liquidity, and risk.",
    },
  ];
  for (const b of blogs) {
    const categoryId = bcatId[b.categorySlug] ?? null;
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        categoryId,
        tags: b.tags,
        author: "VINAY Team",
      },
    });
  }

  // ---- Sample reviews on first villa ----
  const villa = await prisma.property.findUnique({ where: { slug: "sunset-ridge-luxury-villa" } });
  if (villa) {
    await prisma.review.createMany({
      data: [
        { propertyId: villa.id, name: "Michael Torres", rating: 5, comment: "Breathtaking views and flawless finish. Our family is in love.", email: "mike@example.com" },
        { propertyId: villa.id, name: "Lisa Nguyen", rating: 4, comment: "Beautiful home. The only reason for one less star is the HOA complexity.", email: "lisa@example.com" },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ Done. Database is ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });