import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNPR } from "@/lib/format";
import { Users, Building, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, properties: 0, bookings: 0, revenue: 0 });
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const refresh = async () => {
    const [{ count: uc }, { count: pc }, { count: bc }, { data: paid }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("total_price").eq("payment_status", "paid"),
    ]);
    setStats({
      users: uc ?? 0, properties: pc ?? 0, bookings: bc ?? 0,
      revenue: (paid ?? []).reduce((s: number, b: any) => s + Number(b.total_price), 0),
    });
    const [{ data: props }, { data: bks }, { data: us }, { data: rv }] = await Promise.all([
      supabase.from("properties").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*, properties(name)").order("created_at", { ascending: false }).limit(50),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("reviews").select("*, properties(name)").order("created_at", { ascending: false }).limit(50),
    ]);
    setProperties(props ?? []); setBookings(bks ?? []); setUsers(us ?? []); setReviews(rv ?? []);
  };

  useEffect(() => { refresh(); }, []);

  const approve = async (pid: string) => {
    await supabase.from("properties").update({ status: "active", is_verified: true }).eq("id", pid);
    toast.success("Property approved"); refresh();
  };
  const reject = async (pid: string) => {
    await supabase.from("properties").update({ status: "rejected" }).eq("id", pid);
    toast.success("Rejected"); refresh();
  };
  const suspendUser = async (uid: string, suspend: boolean) => {
    await supabase.from("profiles").update({ is_suspended: suspend }).eq("id", uid);
    refresh();
  };
  const flagReview = async (rid: string, flag: boolean) => {
    await supabase.from("reviews").update({ is_flagged: flag, is_approved: !flag }).eq("id", rid);
    refresh();
  };

  return (
    <ProtectedRoute role="admin">
      <PageLayout>
        <div className="container py-10">
          <h1 className="font-display text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">Platform-wide management</p>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Users" value={stats.users.toString()} />
            <StatCard icon={Building} label="Properties" value={stats.properties.toString()} />
            <StatCard icon={Calendar} label="Bookings" value={stats.bookings.toString()} />
            <StatCard icon={DollarSign} label="Revenue" value={formatNPR(stats.revenue)} />
          </div>

          <Tabs defaultValue="properties">
            <TabsList>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-6">
              <div className="border rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted"><tr className="text-left"><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-3">{p.name}</td>
                        <td className="p-3 capitalize">{p.type}</td>
                        <td className="p-3"><span className="capitalize px-2 py-0.5 rounded-full bg-muted text-xs">{p.status}</span></td>
                        <td className="p-3 flex gap-2">
                          {p.status !== "active" && <Button size="sm" onClick={() => approve(p.id)}>Approve</Button>}
                          {p.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => reject(p.id)}>Reject</Button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="mt-6">
              <div className="border rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted"><tr className="text-left"><th className="p-3">Ref</th><th className="p-3">Property</th><th className="p-3">Dates</th><th className="p-3">Total</th><th className="p-3">Status</th></tr></thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t">
                        <td className="p-3 font-mono text-xs">{b.booking_ref}</td>
                        <td className="p-3">{b.properties?.name}</td>
                        <td className="p-3">{format(new Date(b.check_in), "MMM d")} – {format(new Date(b.check_out), "MMM d")}</td>
                        <td className="p-3">{formatNPR(Number(b.total_price))}</td>
                        <td className="p-3 capitalize">{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <div className="border rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted"><tr className="text-left"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{format(new Date(u.created_at), "MMM d, yyyy")}</td>
                        <td className="p-3">{u.is_suspended ? "Suspended" : "Active"}</td>
                        <td className="p-3">
                          <Button size="sm" variant="outline" onClick={() => suspendUser(u.id, !u.is_suspended)}>
                            {u.is_suspended ? "Unsuspend" : "Suspend"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{r.properties?.name} · ★ {Number(r.rating_overall).toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                      </div>
                      <Button size="sm" variant={r.is_flagged ? "default" : "outline"} onClick={() => flagReview(r.id, !r.is_flagged)}>
                        {r.is_flagged ? "Unflag" : "Flag"}
                      </Button>
                    </div>
                  </div>
                ))}
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
