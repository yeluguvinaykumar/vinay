"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { propertySchema, type PropertyInput } from "@/lib/validations";
import { ImageUploader, GalleryUploader } from "@/components/admin/image-uploader";
import { AMENITY_PRESETS, NEARBY_TYPES } from "@/types";

interface PropertyFormProps {
  initial?: PropertyInput & { id: string };
  agents: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export function PropertyForm({ initial, agents, categories }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: initial
      ? { ...initial, amenities: initial.amenities ?? [], nearbyPlaces: initial.nearbyPlaces ?? [], floorPlans: initial.floorPlans ?? [], tags: initial.tags ?? [] }
      : {
          type: "APARTMENT",
          purpose: "SALE",
          status: "AVAILABLE",
          furnished: false,
          featured: false,
          amenities: [],
          nearbyPlaces: [],
          floorPlans: [],
          gallery: [],
          tags: [],
          country: "United States",
        },
  });

  const amenities = watch("amenities") ?? [];
  const nearby = watch("nearbyPlaces") ?? [];

  const toggleAmenity = (name: string) => {
    setValue(
      "amenities",
      amenities.includes(name) ? amenities.filter((a) => a !== name) : [...amenities, name],
      { shouldDirty: true }
    );
  };

  const onSubmit = async (values: PropertyInput) => {
    const url = isEdit ? `/api/admin/properties/${initial.id}` : "/api/admin/properties";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not save property");
      return;
    }
    toast.success(isEdit ? "Property updated" : "Property created");
    router.push("/admin/properties");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Basics */}
      <section className="space-y-5 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Basics</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="p-title">Title *</Label>
            <Input id="p-title" placeholder="e.g. Sunset Ridge Luxury Villa" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-slug">Slug (optional — auto-generated from title)</Label>
            <Input id="p-slug" placeholder="sunset-ridge-luxury-villa" {...register("slug")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-price">Price (USD) *</Label>
            <Input id="p-price" type="number" placeholder="1850000" {...register("price")} />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-discount">Discount price (optional)</Label>
            <Input id="p-discount" type="number" placeholder="1690000" {...register("discountPrice")} />
          </div>
          <div className="space-y-1.5">
            <Label>Property type *</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["APARTMENT", "VILLA", "COMMERCIAL", "PLOT", "HOUSE", "PENTHOUSE", "OFFICE"].map((t) => (
                      <SelectItem key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Purpose</Label>
            <Controller
              control={control}
              name="purpose"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={(v) => field.onChange(v)}>
                  <SelectTrigger><SelectValue placeholder="Buy or rent" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALE">For Sale</SelectItem>
                    <SelectItem value="RENT">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value ?? "AVAILABLE"} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="p-desc">Description *</Label>
            <Textarea id="p-desc" rows={6} placeholder="Describe the property in detail…" {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="space-y-5 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Details & Specs</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-beds">Bedrooms</Label>
            <Input id="p-beds" type="number" placeholder="3" {...register("bedrooms")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-baths">Bathrooms</Label>
            <Input id="p-baths" type="number" placeholder="2" {...register("bathrooms")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-area">Area (sqft) *</Label>
            <Input id="p-area" type="number" placeholder="2100" {...register("area")} />
            {errors.area && <p className="text-xs text-destructive">{errors.area.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-built">Built-up area</Label>
            <Input id="p-built" type="number" placeholder="2300" {...register("builtUpArea")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-parking">Parking spots</Label>
            <Input id="p-parking" type="number" placeholder="2" {...register("parking")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-year">Year built</Label>
            <Input id="p-year" type="number" placeholder="2022" {...register("yearBuilt")} />
          </div>
          <div className="flex items-end gap-4 pb-2">
            <div className="flex items-center gap-2">
              <Switch id="p-furnished" checked={watch("furnished")} onCheckedChange={(v) => setValue("furnished", v, { shouldDirty: true })} />
              <Label htmlFor="p-furnished" className="cursor-pointer">Furnished</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="p-featured" checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v, { shouldDirty: true })} />
              <Label htmlFor="p-featured" className="cursor-pointer">Featured</Label>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-5 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Location</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5 md:col-span-3">
            <Label htmlFor="p-address">Address *</Label>
            <Input id="p-address" placeholder="12 Sunset Ridge, Pacific Heights" {...register("address")} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-city">City *</Label>
            <Input id="p-city" placeholder="San Francisco" {...register("city")} />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-state">State</Label>
            <Input id="p-state" placeholder="CA" {...register("state")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-zip">ZIP code</Label>
            <Input id="p-zip" placeholder="94103" {...register("zipCode")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-country">Country</Label>
            <Input id="p-country" {...register("country")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-lat">Latitude</Label>
            <Input id="p-lat" type="number" step="any" placeholder="37.7749" {...register("latitude")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-lng">Longitude</Label>
            <Input id="p-lng" type="number" step="any" placeholder="-122.4194" {...register("longitude")} />
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="space-y-5 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Media</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Cover image</Label>
            <Controller control={control} name="coverImage" render={({ field }) => <ImageUploader value={field.value ?? ""} onChange={field.onChange} />} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-video">Video URL (YouTube / Vimeo)</Label>
            <Input id="p-video" placeholder="https://youtube.com/watch?v=…" {...register("videoUrl")} />
            <p className="text-xs text-muted-foreground">Optional walkthrough video.</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Gallery</Label>
          <Controller control={control} name="gallery" render={({ field }) => <GalleryUploader value={field.value ?? []} onChange={field.onChange} />} />
        </div>
      </section>

      {/* Amenities */}
      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITY_PRESETS.map((a) => {
            const on = amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  on ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Custom amenity…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const v = (e.target as HTMLInputElement).value.trim();
                if (v && !amenities.includes(v)) {
                  setValue("amenities", [...amenities, v], { shouldDirty: true });
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              const input = document.getElementById("p-custom-amenity") as HTMLInputElement | null;
              if (input?.value.trim()) {
                setValue("amenities", [...amenities, input.value.trim()], { shouldDirty: true });
                input.value = "";
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Input id="p-custom-amenity" placeholder="Or type here and click +" className="max-w-xs" />
        </div>
      </section>

      {/* Nearby places */}
      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Nearby Places</h2>
        {nearby.map((n, i) => (
          <div key={i} className="grid grid-cols-[1fr_120px_100px_auto] items-center gap-2">
            <Input
              placeholder="Place name"
              value={n.name}
              onChange={(e) => setValue("nearbyPlaces", nearby.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)), { shouldDirty: true })}
            />
            <Select
              value={n.type}
              onValueChange={(v) => setValue("nearbyPlaces", nearby.map((x, j) => (j === i ? { ...x, type: v } : x)), { shouldDirty: true })}
            >
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {NEARBY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="0.5 mi"
              value={n.distance}
              onChange={(e) => setValue("nearbyPlaces", nearby.map((x, j) => (j === i ? { ...x, distance: e.target.value } : x)), { shouldDirty: true })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setValue("nearbyPlaces", nearby.filter((_, j) => j !== i), { shouldDirty: true })}
              aria-label="Remove place"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setValue("nearbyPlaces", [...nearby, { name: "", type: "school", distance: "" }], { shouldDirty: true })}
        >
          <Plus className="h-4 w-4" /> Add nearby place
        </Button>
      </section>

      {/* Assignment */}
      <section className="grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value ?? undefined} onValueChange={(v) => field.onChange(v === "none" ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Agent</Label>
          <Controller
            control={control}
            name="agentId"
            render={({ field }) => (
              <Select value={field.value ?? undefined} onValueChange={(v) => field.onChange(v === "none" ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end gap-3 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/properties")}>
          Cancel
        </Button>
        <Button type="submit" size="lg" loading={isSubmitting}>
          {isEdit ? "Save Changes" : "Create Property"}
        </Button>
      </div>
    </form>
  );
}