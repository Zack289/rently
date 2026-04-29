import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { PropertyCard } from "@/components/PropertyCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("id, property_id, properties(*)")
        .eq("tourist_id", user.id);
      setItems(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  const remove = async (id: string) => {
    await supabase.from("wishlists").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="container py-10">
          <h1 className="font-display text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground mb-8">Stays you've saved for later.</p>
          {loading ? (
            <p>Loading…</p>
          ) : items.length === 0 ? (
            <div className="text-center py-20 border rounded-xl">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg mb-4">Your wishlist is empty.</p>
              <Button asChild><Link to="/search">Browse stays</Link></Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((i) => (
                <div key={i.id} className="relative group">
                  <PropertyCard p={i.properties} />
                  <button
                    onClick={() => remove(i.id)}
                    className="absolute top-3 right-3 bg-background/90 hover:bg-background p-2 rounded-full shadow"
                    aria-label="Remove"
                  >
                    <Heart className="h-4 w-4 fill-destructive text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
