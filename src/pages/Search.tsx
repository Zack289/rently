import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard, PropertyCardData } from "@/components/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TYPES = ["hotel", "guesthouse", "homestay", "resort", "hostel"] as const;

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const destination = params.get("destination") ?? "";
  const [all, setAll] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<[number, number]>([500, 20000]);
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState("recommended");
  const [destinations, setDestinations] = useState<Array<{id: string; name: string}>>([]);

  useEffect(() => {
    supabase.from("destinations").select("id,name").order("name").then(({ data }) => {
      setDestinations((data as any[]) ?? []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let qb = supabase.from("properties")
      .select("id,name,hero_image,region,type,is_verified,destination_id, room_types(price_per_night)")
      .eq("status", "active");
    if (destination) qb = qb.eq("destination_id", destination);
    if (q) qb = qb.or(`region.ilike.%${q}%,name.ilike.%${q}%`);
    qb.then(({ data, error }) => {
      if (error) {
        console.error("Search error:", error);
      }
      console.log("Search results:", data, "Destination filter:", destination, "Query:", q);
      const items: PropertyCardData[] = ((data ?? []) as any[]).map((p) => ({
        id: p.id, name: p.name, hero_image: p.hero_image, region: p.region,
        type: p.type, is_verified: p.is_verified,
        min_price: p.room_types?.length ? Math.min(...p.room_types.map((r: any) => Number(r.price_per_night))) : undefined,
        rating: 4.4 + Math.random() * 0.6,
      }));
      setAll(items);
      setLoading(false);
    });
  }, [q, destination]);

  const filtered = all.filter((p) => {
    if (types.length && !types.includes(p.type)) return false;
    if (p.min_price != null && (p.min_price < price[0] || p.min_price > price[1])) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "price-asc") return (a.min_price ?? 0) - (b.min_price ?? 0);
    if (sort === "price-desc") return (b.min_price ?? 0) - (a.min_price ?? 0);
    if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  const toggleType = (t: string) =>
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <PageLayout>
      <Helmet><title>Search stays · TourBook Nepal</title></Helmet>
      <section className="bg-secondary/40 py-6">
        <div className="container mx-auto px-4"><SearchBar compact /></div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside className="bg-card rounded-2xl shadow-card p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-semibold mb-4">Filters</h3>

            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Price per night (NPR)</p>
              <Slider min={500} max={20000} step={500} value={price} onValueChange={(v) => setPrice(v as [number, number])} />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>NPR {price[0].toLocaleString()}</span>
                <span>NPR {price[1].toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Destination</p>
              <div className="space-y-2">
                {destinations.map((d) => (
                  <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={destination === d.id} disabled onCheckedChange={() => {}} />
                    {d.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Property type</p>
              <div className="space-y-2">
                {TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                    <Checkbox checked={types.includes(t)} onCheckedChange={() => toggleType(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full" onClick={() => { setTypes([]); setPrice([500, 20000]); }}>
              Clear filters
            </Button>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{loading ? "Loading…" : `${filtered.length} stays found`}</p>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-asc">Price: Low to high</SelectItem>
                  <SelectItem value="price-desc">Price: High to low</SelectItem>
                  <SelectItem value="rating">Top rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((p) => <PropertyCard key={p.id} p={p} />)}
              </div>
            ) : !loading && (
              <div className="text-center py-20 bg-secondary/40 rounded-2xl">
                <p className="text-muted-foreground">No matching stays. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Search;
