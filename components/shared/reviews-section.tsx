"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rating, RatingInput } from "@/components/shared/rating";
import { reviewSchema } from "@/lib/validations";
import { timeAgo } from "@/utils/format";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

type ReviewValues = z.infer<typeof reviewSchema>;

export function ReviewsSection({ propertyId, initial }: { propertyId: string; initial: Review[] }) {
  const [reviews, setReviews] = React.useState<Review[]>(initial);
  const [rating, setRating] = React.useState(5);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewValues>({ resolver: zodResolver(reviewSchema), defaultValues: { propertyId, rating: 5 } });

  const onSubmit = async (values: ReviewValues) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, rating }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not submit review.");
      return;
    }
    setReviews((prev) => [json.data, ...prev]);
    toast.success("Review submitted!", { description: "Thank you for your feedback." });
    reset({ propertyId, rating: 5 });
    setRating(5);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">
          Reviews <span className="text-sm font-normal text-muted-foreground">({reviews.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this property.</p>
        )}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{timeAgo(r.createdAt)}</p>
                  </div>
                </div>
                <Rating value={r.rating} size={14} />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl bg-muted/50 p-5" noValidate>
          <h3 className="font-display text-base font-bold">Leave a Review</h3>
          <div className="flex items-center gap-3">
            <Label>Your rating</Label>
            <RatingInput value={rating} onChange={setRating} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="rv-name">Name</Label>
              <Input id="rv-name" placeholder="Your name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rv-email">Email (optional)</Label>
              <Input id="rv-email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rv-comment">Comment</Label>
            <Textarea id="rv-comment" rows={3} placeholder="What did you like about this property?" {...register("comment")} />
            {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting}>
            {!isSubmitting && <Star className="h-4 w-4" />}
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}