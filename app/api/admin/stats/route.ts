import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();

    const [
      properties,
      agents,
      categories,
      leads,
      appointments,
      messages,
      blogs,
      testimonials,
      subscribers,
      reviews,
      users,
      viewsAgg,
      propertyTypes,
      leadsByDay,
      appointmentsPending,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.agent.count(),
      prisma.category.count(),
      prisma.lead.count(),
      prisma.appointment.count(),
      prisma.message.count(),
      prisma.blog.count(),
      prisma.testimonial.count(),
      prisma.newsletter.count(),
      prisma.review.count(),
      prisma.user.count(),
      prisma.property.aggregate({ _sum: { views: true } }),
      prisma.property.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ["createdAt"], _count: { _all: true } }),
      prisma.appointment.count({ where: { status: "PENDING" } }),
    ]);

    const start = new Date();
    start.setDate(start.getDate() - 13);
    start.setHours(0, 0, 0, 0);

    const leadsSince = await prisma.lead.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true } });
    const leadSeries: { date: string; count: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const label = day.toISOString().slice(5, 10);
      leadSeries.push({
        date: label,
        count: leadsSince.filter((l) => l.createdAt.toISOString().slice(0, 10) === day.toISOString().slice(0, 10)).length,
      });
    }

    const unreadMessages = await prisma.message.count({ where: { read: false } });
    const newLeads = await prisma.lead.count({ where: { status: "NEW" } });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          properties,
          agents,
          categories,
          leads,
          newLeads,
          appointments,
          appointmentsPending,
          messages,
          unreadMessages,
          blogs,
          testimonials,
          subscribers,
          reviews,
          users,
          views: viewsAgg._sum.views ?? 0,
        },
        propertyTypes: propertyTypes.map((t) => ({ name: t.type, count: t._count._all })),
        leadSeries,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}