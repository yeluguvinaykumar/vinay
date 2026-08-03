"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { agentSchema, type AgentInput } from "@/lib/validations";
import { ImageUploader } from "@/components/admin/image-uploader";

export function AgentForm({ initial }: { initial?: AgentInput & { id: string } }) {
  const router = useRouter();
  const isEdit = !!initial;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AgentInput>({
    resolver: zodResolver(agentSchema),
    defaultValues: initial ?? { rating: 5, experience: 0, active: true, languages: [] },
  });

  const languages = watch("languages") ?? [];

  const addLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter") {
      e.preventDefault();
      const v = target.value.trim();
      if (v && !languages.includes(v)) setValue("languages", [...languages, v], { shouldDirty: true });
      target.value = "";
    }
  };

  const onSubmit = async (values: AgentInput) => {
    const res = await fetch(isEdit ? `/api/agents/${initial.id}` : "/api/agents", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not save agent");
      return;
    }
    toast.success(isEdit ? "Agent updated" : "Agent created");
    router.push("/admin/agents");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border bg-card p-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="a-name">Full name *</Label>
          <Input id="a-name" placeholder="Aarav Sharma" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-title">Title</Label>
          <Input id="a-title" placeholder="Senior Luxury Agent" {...register("title")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-email">Email *</Label>
          <Input id="a-email" type="email" placeholder="agent@vinay.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-phone">Phone</Label>
          <Input id="a-phone" placeholder="+1 555 0100" {...register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-whatsapp">WhatsApp</Label>
          <Input id="a-whatsapp" placeholder="14155550101" {...register("whatsapp")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-slug">Slug (optional)</Label>
          <Input id="a-slug" placeholder="aarav-sharma" {...register("slug")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="a-exp">Experience (years)</Label>
            <Input id="a-exp" type="number" {...register("experience")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="a-rating">Rating</Label>
            <Input id="a-rating" type="number" step="0.1" min={0} max={5} {...register("rating")} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Photo</Label>
          <Controller control={control} name="photo" render={({ field }) => <ImageUploader value={field.value ?? ""} onChange={field.onChange} folder="agents" />} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="a-lang">Languages (press Enter to add)</Label>
          <Input id="a-lang" placeholder="English" onKeyDown={addLanguage} />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {languages.map((l) => (
              <span key={l} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                {l}
                <button type="button" onClick={() => setValue("languages", languages.filter((x) => x !== l), { shouldDirty: true })} aria-label={`Remove ${l}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="a-bio">Bio</Label>
          <Textarea id="a-bio" rows={4} placeholder="Short professional biography…" {...register("bio")} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="a-active" checked={watch("active")} onCheckedChange={(v) => setValue("active", v, { shouldDirty: true })} />
          <Label htmlFor="a-active" className="cursor-pointer">Active (visible on website)</Label>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/agents")}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>{isEdit ? "Save Changes" : "Create Agent"}</Button>
      </div>
    </form>
  );
}