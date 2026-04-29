import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatNPR } from "@/lib/format";
import { Calendar } from "lucide-react";

const Inner = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("bookings").select("*, properties(name, hero_image)").eq("tourist_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setBookings(data ?? []));
  }, [user]);

  return (
    <PageLayout>
      <Helmet><title>My bookings · TourBook Nepal</title></Helmet>
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">My bookings</h1>
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-secondary/40 rounded-2xl">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No bookings yet — time to start exploring!</p>
            <Button asChild className="gradient-primary"><Link to="/destinations">Browse destinations</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="flex gap-4 bg-card rounded-2xl shadow-card p-4 items-center">
                <img src={b.properties?.hero_image ?? "/placeholder.svg"} alt="" className="h-24 w-32 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{b.booking_ref}</p>
                  <h3 className="font-semibold">{b.properties?.name}</h3>
                  <p className="text-sm text-muted-foreground">{b.check_in} → {b.check_out} · {b.guests} guests</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatNPR(Number(b.total_price))}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    b.status === "confirmed" ? "bg-success/15 text-success" :
                    b.status === "pending" ? "bg-warning/15 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
};

const TouristDashboard = () => <ProtectedRoute><Inner /></ProtectedRoute>;
export default TouristDashboard;
