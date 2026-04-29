import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  slug: string;
  hero_image: string | null;
  region: string;
  description: string;
  tags: string[];
}

const Destinations = () => {
  const [params] = useSearchParams();
  const tagParam = params.get("tag");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("destinations")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setDestinations((data as Destination[]) ?? []);
      });
  }, []);

  const filtered = destinations.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (tagParam && !d.tags.includes(tagParam)) return false;
    return true;
  });

  return (
    <PageLayout>
      <Helmet>
        <title>Destinations · TourBook Nepal</title>
      </Helmet>
      <section className="bg-gradient-to-b from-secondary/40 to-background py-14">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Explore Nepal
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            From Himalayan peaks to subtropical jungles.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Link
              key={d.id}
              to={`/destinations/${d.slug}`}
              className="group block rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elegant hover:-translate-y-1 transition-spring"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.hero_image ?? "/placeholder.svg"}
                  alt={d.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-spring group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-primary mb-1">
                  {d.region}
                </p>
                <h3 className="font-display text-xl font-bold mb-2">
                  {d.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {d.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No destinations found.
          </p>
        )}
      </section>
    </PageLayout>
  );
};

export default Destinations;
