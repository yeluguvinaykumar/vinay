import { prisma } from "@/lib/prisma";
import { safe } from "@/lib/query";
import { SectionHeading } from "@/components/shared/section-heading";
import { Rating } from "@/components/shared/rating";
import { Reveal } from "@/components/shared/reveal";
import { Quote } from "lucide-react";

export async function HomeTestimonials() {
  const testimonials = await safe(
    () => prisma.testimonial.findMany({ where: { active: true }, orderBy: { featured: "desc" }, take: 3 }),
    []
  );

  return (
    <section className="section-pad bg-muted/40">
      <div className="container-site">
        <SectionHeading
          eyebrow="Client stories"
          title="What Our Clients Say"
          description="Thousands of families have found their dream property with VINAY."
        />
        {testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground">Testimonials appear after seeding.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <figure className="relative flex h-full flex-col rounded-2xl border bg-card p-7 shadow-sm">
                  <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
                  <Rating value={t.rating} />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    “{t.content}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {t.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}
                        {t.company ? ` · ${t.company}` : ""}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}