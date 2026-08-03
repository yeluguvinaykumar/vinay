"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, TrendingUp } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChartComponent, BarChartComponent, PieChartComponent } from "@/components/admin/charts";
import { formatPrice } from "@/utils/format";

interface Stats {
  counts: Record<string, number>;
  propertyTypes: { name: string; count: number }[];
  leadSeries: { date: string; count: number }[];
}

interface TopProperty {
  id: string;
  title: string;
  slug: string;
  views: number;
  coverImage: string | null;
  purpose: string | null;
  price: number;
  discountPrice: number | null;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [top, setTop] = React.useState<TopProperty[] | null>(null);

  React.useEffect(() => {
    void (async () => {
      const [statsRes, topRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/properties?top=true"),
      ]);
      const [statsJson, topJson] = await Promise.all([statsRes.json(), topRes.json()]);
      if (statsJson.success) setStats(statsJson.data);
      if (topJson.success) setTop(topJson.data);
    })();
  }, []);

  return (
    <div>
      <AdminPageHeader title="Analytics" description="Performance of listings, leads and audience activity." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Views", value: stats?.counts.views, icon: <Eye className="h-4 w-4" /> },
          { label: "Total Leads", value: stats?.counts.leads, icon: <TrendingUp className="h-4 w-4" /> },
          { label: "New Leads", value: stats?.counts.newLeads, icon: <TrendingUp className="h-4 w-4" /> },
          { label: "Reviews", value: stats?.counts.reviews, icon: <TrendingUp className="h-4 w-4" /> },
        ].map((s) => (
          <Card key={s.label} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value ?? <Skeleton className="mt-1 h-7 w-14" />}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">{s.icon}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-4 font-semibold">Leads — last 14 days</h2>
          {stats ? (
            <AreaChartComponent data={stats.leadSeries.map((d) => ({ date: d.date, count: d.count }))} />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </Card>
        <Card className="p-4">
          <h2 className="mb-4 font-semibold">Listings by type</h2>
          {stats ? (
            <PieChartComponent data={stats.propertyTypes.map((t) => ({ name: t.name, count: t.count }))} />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </Card>
        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Top viewed properties</h2>
          {!top ? (
            <Skeleton className="h-64 w-full" />
          ) : top.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No property views yet.</p>
          ) : (
            <div className="space-y-3">
              {top.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 1}</span>
                  <div className="h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/properties/${p.slug}`} className="line-clamp-1 font-semibold hover:text-primary hover:underline">
                      {p.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{formatPrice(p.discountPrice ?? p.price, p.purpose)}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold">
                    <Eye className="h-4 w-4 text-primary" /> {p.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}