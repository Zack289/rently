import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNPR } from "@/lib/format";
import { Building, Calendar, DollarSign, Plus, BadgeCheck } from "lucide-react";
import { format } from "date-fns";

export default function HostDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: props } = await supabase.from("properties").select("*").eq("host_id", user.id);
      setProperties(props ?? []);
      const propIds = (props ?? []).map((p) => p.id);
      if (propIds.length) {
        const { data: bks } = await supabase
          .from("bookings")
          .select("*, properties(name)")
          .in("property_id", propIds)
          .order("created_at", { ascending: false });
        setBookings(bks ?? []);
      }
      const { data: pos } = await supabase.from("payouts").select("*").eq("host_id", user.id).order("created_at", { ascending: false });
      setPayouts(pos ?? []);
    })();
  }, [user]);

  const totalRevenue = bookings.filter((b) => b.payment_status === "paid").reduce((s, b) => s + Number(b.total_price), 0);
  const upcomingCount = bookings.filter((b) => b.status === "confirmed" && new Date(b.check_in) >= new Date()).length;

  return (
    <ProtectedRoute role="host">
      <PageLayout>
        <div className="container py-10">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold">Host Dashboard</h1>
              <p className="text-muted-foreground">Manage your properties and bookings</p>
            </div>
            <Button asChild><Link to="/host/properties/new"><Plus className="h-4 w-4 mr-2" />Add property</Link></Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Building} label="Properties" value={properties.length.toString()} />
            <StatCard icon={Calendar} label="Upcoming bookings" value={upcomingCount.toString()} />
            <StatCard icon={DollarSign} label="Total revenue" value={formatNPR(totalRevenue)} />
          </div>

          <Tabs defaultValue="properties">
            <TabsList>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((p) => (
                  <Link to={`/host/properties/${p.id}`} key={p.id} className="border rounded-xl overflow-hidden hover:shadow-elegant transition">
                    <div className="aspect-video bg-muted">
                      {p.hero_image && <img src={p.hero_image} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                        {p.is_verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{p.type} · {p.status}</p>
                    </div>
                  </Link>
                ))}
                {properties.length === 0 && <p className="text-muted-foreground col-span-full">No properties yet. Click "Add property" to list your first stay.</p>}
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="mt-6">
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr className="text-left">
                      <th className="p-3">Ref</th><th className="p-3">Property</th><th className="p-3">Dates</th><th className="p-3">Guests</th><th className="p-3">Total</th><th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t">
                        <td className="p-3 font-mono text-xs">{b.booking_ref}</td>
                        <td className="p-3">{b.properties?.name}</td>
                        <td className="p-3">{format(new Date(b.check_in), "MMM d")} – {format(new Date(b.check_out), "MMM d")}</td>
                        <td className="p-3">{b.guests}</td>
                        <td className="p-3">{formatNPR(Number(b.total_price))}</td>
                        <td className="p-3"><span className="capitalize px-2 py-0.5 rounded-full bg-muted text-xs">{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && <p className="p-6 text-muted-foreground text-center">No bookings yet.</p>}
              </div>
            </TabsContent>

            <TabsContent value="payouts" className="mt-6">
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr className="text-left"><th className="p-3">Date</th><th className="p-3">Gross</th><th className="p-3">Commission</th><th className="p-3">Net</th><th className="p-3">Status</th></tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-3">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                        <td className="p-3">{formatNPR(Number(p.gross_amount))}</td>
                        <td className="p-3">{formatNPR(Number(p.commission_amount))}</td>
                        <td className="p-3 font-semibold">{formatNPR(Number(p.net_amount))}</td>
                        <td className="p-3"><span className="capitalize px-2 py-0.5 rounded-full bg-muted text-xs">{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payouts.length === 0 && <p className="p-6 text-muted-foreground text-center">No payouts yet.</p>}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}

const StatCard = ({ icon: Icon, label, value }: any) => (
  <div className="bg-card border rounded-xl p-5 shadow-card">
    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><Icon className="h-4 w-4" />{label}</div>
    <p className="text-2xl font-bold font-display">{value}</p>
  </div>
);
