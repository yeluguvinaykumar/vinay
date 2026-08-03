"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, BedDouble, Building2, CalendarDays, FolderKanban, Inbox, Mail, Newspaper, Star, UserPlus, Users } from "lucide-react";

import { AdminPageHeader, StatCard } from "@/components/admin/page-header";
import { LeadsAreaChart, TypesBarChart } from "@/components/admin/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Stats {
  counts: {
    properties: number;
    agents: number;
    categories: number;
    leads: number;
    newLeads: number;
    appointments: number;
    appointmentsPending: number;
    messages: number;
    unreadMessages: number;
    blogs: number;
    testimonials: number;
    subscribers: number;
    reviews: number;
    users: number;
    views: number;
  };
  propertyTypes: { name: string; count: number }[];
  leadSeries: { date: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<Stats | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((json) => (json.success ? setData(json.data) : setError(true)))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="text-destructive">Could not load statistics.</p>;
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const c = data.counts;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening across VINAY today."
        action="Add Property"
        href="/admin/properties/new"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Properties" value={c.properties} icon={BedDouble} hint={`${c.views.toLocaleString()} total views`} to="/admin/properties" />
        <StatCard label="New Leads" value={c.newLeads} icon={Inbox} hint={`${c.leads} total leads`} to="/admin/leads" accent />
        <StatCard label="Appointments" value={c.appointments} icon={CalendarDays} hint={`${c.appointmentsPending} pending`} to="/admin/appointments" />
        <StatCard label="Unread Messages" value={c.unreadMessages} icon={Mail} hint={`${c.messages} total`} to="/admin/messages" />
        <StatCard label="Agents" value={c.agents} icon={Users} hint={`${c.users} accounts`} to="/admin/agents" />
        <StatCard label="Categories" value={c.categories} icon={FolderKanban} to="/admin/categories" />
        <StatCard label="Blog Posts" value={c.blogs} icon={Newspaper} to="/admin/blogs" />
        <StatCard label="Reviews" value={c.reviews} icon={Star} hint={`${c.subscribers} subscribers`} to="/admin/reviews" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Leads — last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsAreaChart data={data.leadSeries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Properties by type</CardTitle>
          </CardHeader>
          <CardContent>
            <TypesBarChart data={data.propertyTypes} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-display text-lg font-bold">Quick actions</h3>
              <p className="mt-1 text-sm text-muted-foreground">Common tasks, one click away.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline"><Link href="/admin/properties/new"><BedDouble className="h-4 w-4" /> Property</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/admin/agents/new"><UserPlus className="h-4 w-4" /> Agent</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/admin/blogs/new"><Newspaper className="h-4 w-4" /> Blog</Link></Button>
              <Button asChild size="sm" variant="outline"><Link href="/admin/media"><Building2 className="h-4 w-4" /> Media</Link></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-display text-lg font-bold">View public site</h3>
              <p className="mt-1 text-sm text-muted-foreground">See everything as visitors do.</p>
            </div>
            <Button asChild variant="gold">
              <Link href="/">Open Site <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}