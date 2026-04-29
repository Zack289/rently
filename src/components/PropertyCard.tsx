import { Link } from "react-router-dom";
import { MapPin, Star, BadgeCheck } from "lucide-react";
import { formatNPR } from "@/lib/format";

export interface PropertyCardData {
  id: string;
  name: string;
  hero_image: string | null;
  region: string | null;
  type: string;
  is_verified: boolean;
  min_price?: number;
  rating?: number;
}

export const PropertyCard = ({ p }: { p: PropertyCardData }) => (
  <Link
    to={`/property/${p.id}`}
    className="group block rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elegant transition-spring hover:-translate-y-1"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={p.hero_image ?? "/placeholder.svg"}
        alt={p.name}
        loading="lazy"
        className="w-full h-full object-cover transition-spring group-hover:scale-105"
      />
      {p.is_verified && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-background/95 backdrop-blur px-2 py-1 rounded-full text-xs font-medium shadow-sm">
          <BadgeCheck className="h-3 w-3 text-primary" /> Verified
        </span>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold leading-tight line-clamp-1">{p.name}</h3>
        {p.rating != null && (
          <span className="inline-flex items-center gap-1 text-sm font-medium shrink-0">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {p.rating.toFixed(1)}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
        <MapPin className="h-3 w-3" /> {p.region ?? "Nepal"} · <span className="capitalize">{p.type}</span>
      </p>
      {p.min_price != null && (
        <p className="text-sm">
          <span className="font-semibold text-foreground">{formatNPR(p.min_price)}</span>
          <span className="text-muted-foreground"> / night</span>
        </p>
      )}
    </div>
  </Link>
);
