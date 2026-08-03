"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { timeAgo } from "@/utils/format";

const commentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  comment: z.string().trim().min(5, "Comment must be at least 5 characters").max(1500),
});

interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
}

type CommentValues = z.infer<typeof commentSchema>;

export function BlogComments({ postId, postSlug }: { postId: string; postSlug: string }) {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/blogs/${postSlug}/comments`)
      .then((r) => r.json())
      .then((json) => setComments(json.success ? json.data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [postSlug]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentValues>({ resolver: zodResolver(commentSchema) });

  const onSubmit = async (values: CommentValues) => {
    const res = await fetch(`/api/blogs/${postSlug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, postId }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not post comment.");
      return;
    }
    setComments((prev) => [...prev, json.data]);
    toast.success("Comment posted!");
    reset();
  };

  return (
    <Card id="comments">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <MessageSquare className="h-5 w-5 text-accent" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {loading && <p className="text-sm text-muted-foreground">Loading comments…</p>}
          {!loading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground">Be the first to comment on this article.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-bold">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{timeAgo(c.createdAt)}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl bg-muted/50 p-5" noValidate>
          <h3 className="font-display text-base font-bold">Leave a Comment</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cm-name">Name</Label>
              <Input id="cm-name" placeholder="Your name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cm-email">Email</Label>
              <Input id="cm-email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cm-comment">Comment</Label>
            <Textarea id="cm-comment" rows={3} placeholder="Share your thoughts…" {...register("comment")} />
            {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting}>
            {!isSubmitting && <MessageSquare className="h-4 w-4" />}
            Post Comment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}