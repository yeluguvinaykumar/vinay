import Link from "next/link";
import { Award, Mail, MessageCircle, Phone } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/shared/rating";
import type { Agent } from "@prisma/client";

interface AgentWithCount extends Agent {
  _count?: { properties: number };
}

export function AgentCard({ agent, detail = false }: { agent: AgentWithCount; detail?: boolean }) {
  const initials = agent.name
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("");

  return (
    <Card className="card-lift group overflow-hidden text-center">
      <div className="relative bg-gradient-to-br from-primary/10 to-accent/15 pb-6 pt-10">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg transition-transform duration-500 group-hover:scale-105">
          <Avatar className="h-full w-full">
            <AvatarImage src={agent.photo ?? undefined} alt={agent.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
        {agent.experience > 0 && (
          <Badge className="absolute right-4 top-4 gap-1 bg-slate-900/70 text-white backdrop-blur-sm">
            <Award className="h-3 w-3 text-amber-400" />
            {agent.experience} yrs
          </Badge>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-bold transition-colors group-hover:text-primary">
          {agent.name}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{agent.title}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Rating value={agent.rating} size={14} />
          <span className="text-xs font-semibold">{agent.rating.toFixed(1)}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {agent._count?.properties ?? 0} properties listed
        </p>

        <div className="mt-5 flex justify-center gap-2">
          <a href={`tel:${agent.phone ?? ""}`} aria-label={`Call ${agent.name}`}>
            <Button variant="outline" size="icon" className="rounded-full hover:text-primary">
              <Phone className="h-4 w-4" />
            </Button>
          </a>
          <a href={`mailto:${agent.email}`} aria-label={`Email ${agent.name}`}>
            <Button variant="outline" size="icon" className="rounded-full hover:text-primary">
              <Mail className="h-4 w-4" />
            </Button>
          </a>
          {agent.whatsapp && (
            <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${agent.name}`}>
              <Button variant="outline" size="icon" className="rounded-full text-emerald-600 hover:bg-emerald-500 hover:text-white">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>

        <Link href={`/agents/${agent.slug}`} className="mt-5 block">
          <Button variant="gold" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}