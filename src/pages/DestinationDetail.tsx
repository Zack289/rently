import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard, PropertyCardData } from "@/components/PropertyCard";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  hero_image: string | null;
  tags: string[];
}

const DestinationDetail = () => {
  const { slug } = useParams();
  const [dest, setDest] = useState<Destination | null>(null);
  const [props, setProps] = useState<PropertyCardData[]>([]);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data, error: destError }) => {
        const d = data as Destination | null;
        if (destError) console.error("Destination error:", destError);
        setDest(d);
        if (d) {
          const { data: p, error: propsError } = await supabase
            .from("properties")
            .select(
              "id,name,hero_image,region,type,is_verified, room_types(price_per_night)",
            )
            .eq("destination_id", d.id)
            .eq("status", "active");

          if (propsError) console.error("Properties error:", propsError);
          console.log("Fetched properties:", p);

          setProps(
            ((p ?? []) as any[]).map((x) => ({
              id: x.id,
              name: x.name,
              hero_image: x.hero_image,
              region: x.region,
              type: x.type,
              is_verified: x.is_verified,
              min_price: x.room_types?.length
                ? Math.min(
                    ...x.room_types.map((r: any) => Number(r.price_per_night)),
                  )
                : undefined,
            })),
          );
        }
      });
  }, [slug]);

  if (!dest)
    return (
      <PageLayout>
        <div className="container mx-auto py-20 text-center text-muted-foreground">
          Loading…
        </div>
      </PageLayout>
    );

  return (
    <PageLayout>
      <Helmet>
        <title>{dest.name} · TourBook Nepal</title>
        <meta name="description" content={dest.description.slice(0, 160)} />
      </Helmet>
      <section className="relative -mt-16 h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <img
          src={dest.hero_image ?? "/placeholder.svg"}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 container mx-auto px-4 pb-10 text-background">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-sm text-background/80 hover:text-background mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> All destinations
          </Link>
          <p className="text-sm uppercase tracking-[0.3em] text-background/80 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {dest.region}
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold">
            {dest.name}
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            {dest.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {dest.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-secondary text-sm font-medium text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-bold">
            Stays in {dest.name}
          </h2>
          <Button asChild>
            <Link to={`/search?destination=${dest.id}`} className="gap-2">
              See all stays
            </Link>
          </Button>
        </div>
        {props.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary/40 rounded-2xl">
            <p className="text-muted-foreground mb-4">
              No active properties in {dest.name} yet.
            </p>
            <Button asChild>
              <Link to="/search">Browse all stays</Link>
            </Button>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default DestinationDetail;
