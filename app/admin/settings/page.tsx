"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const FIELDS: { key: string; label: string; type: "text" | "textarea"; hint?: string }[] = [
  { key: "site_name", label: "Site Name", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "address", label: "Address", type: "text" },
  { key: "whatsapp", label: "WhatsApp number", type: "text", hint: "Country code + number, digits only" },
  { key: "mapLink", label: "Map link (embed URL)", type: "text" },
  { key: "business_hours", label: "Business hours", type: "text" },
  { key: "hero_headline", label: "Hero headline", type: "text" },
  { key: "hero_subheading", label: "Hero subheading", type: "text" },
  { key: "stats_years", label: "Stats — Years of experience", type: "text" },
  { key: "stats_sold", label: "Stats — Properties sold", type: "text" },
  { key: "stats_clients", label: "Stats — Happy clients", type: "text" },
  { key: "stats_cities", label: "Stats — Cities covered", type: "text" },
  { key: "social_facebook", label: "Facebook URL", type: "text" },
  { key: "social_instagram", label: "Instagram URL", type: "text" },
  { key: "social_twitter", label: "X / Twitter URL", type: "text" },
  { key: "social_linkedin", label: "LinkedIn URL", type: "text" },
  { key: "seo_title", label: "SEO — Default title", type: "text" },
  { key: "seo_description", label: "SEO — Default description", type: "textarea" },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, string> | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success) setValues(json.data);
    })();
  }, []);

  const save = async () => {
    if (!values) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      toast.success("Settings saved");
      router.refresh();
    } else {
      toast.error(json.error || "Save failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Site Settings" description="Global site configuration, contact details and SEO defaults." />

      {!values ? (
        <Card className="p-4"><div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div></Card>
      ) : (
        <Card className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={`s-${f.key}`}>
                  {f.label}
                  {f.hint && <span className="block text-xs font-normal text-muted-foreground">{f.hint}</span>}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea id={`s-${f.key}`} rows={3} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v!, [f.key]: e.target.value }))} />
                ) : (
                  <Input id={`s-${f.key}`} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v!, [f.key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => void save()} loading={saving}>Save All Settings</Button>
          </div>
        </Card>
      )}
    </div>
  );
}