import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { formatNPR, nightsBetween, computePricing } from "@/lib/format";
import { Loader2, CreditCard, Wallet, Smartphone, Building2 } from "lucide-react";
import { toast } from "sonner";

const CheckoutInner = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const propertyId = params.get("property")!;
  const roomId = params.get("room")!;
  const checkIn = params.get("checkin")!;
  const checkOut = params.get("checkout")!;
  const guests = parseInt(params.get("guests") ?? "2", 10);

  const [property, setProperty] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");
  const [method, setMethod] = useState<"card" | "esewa" | "khalti" | "pay_at_property">("card");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("properties").select("name,hero_image,host_id").eq("id", propertyId).maybeSingle().then(({ data }) => setProperty(data));
    supabase.from("room_types").select("*").eq("id", roomId).maybeSingle().then(({ data }) => setRoom(data));
  }, [propertyId, roomId]);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const pricing = room ? computePricing(Number(room.price_per_night), nights) : null;

  const onConfirm = async () => {
    if (!user || !pricing || !room) return;
    if (!name.trim() || !phone.trim()) { toast.error("Please fill in your name and phone"); return; }
    setSubmitting(true);

    // Create the booking record
    const { data: booking, error } = await supabase.from("bookings").insert({
      tourist_id: user.id, property_id: propertyId, room_type_id: roomId,
      check_in: checkIn, check_out: checkOut, guests, nights,
      room_rate: Number(room.price_per_night), taxes: pricing.taxes,
      platform_fee: pricing.platformFee, total_price: pricing.total,
      payment_method: method, special_requests: requests || null,
      payment_status: method === "pay_at_property" ? "pending" : "pending",
      status: method === "pay_at_property" ? "confirmed" : "pending",
      booking_ref: "",
    }).select().single();

    if (error || !booking) {
      setSubmitting(false);
      toast.error(error?.message ?? "Could not create booking");
      return;
    }

    if (method === "card") {
      // Card → Stripe checkout
      const { data, error: fnErr } = await supabase.functions.invoke("create-checkout", {
        body: { booking_id: booking.id },
      });
      setSubmitting(false);
      if (fnErr || !data?.url) { toast.error("Payment service unavailable. Try Pay at Property."); return; }
      window.location.href = data.url;
      return;
    }

    setSubmitting(false);
    navigate(`/booking/confirmation?ref=${booking.booking_ref}`);
  };

  if (!property || !room || !pricing) {
    return <PageLayout><div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div></PageLayout>;
  }

  return (
    <PageLayout>
      <Helmet><title>Checkout · TourBook Nepal</title></Helmet>
      <section className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Confirm and pay</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h2 className="font-semibold text-lg mb-4">Guest details</h2>
              <div className="grid gap-4">
                <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" /></div>
                <div><Label>Email</Label><Input value={user?.email ?? ""} disabled className="mt-1 bg-muted" /></div>
                <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977…" className="mt-1" /></div>
                <div><Label>Special requests (optional)</Label><Textarea value={requests} onChange={(e) => setRequests(e.target.value)} rows={3} className="mt-1" /></div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h2 className="font-semibold text-lg mb-4">Payment method</h2>
              <Tabs value={method} onValueChange={(v) => setMethod(v as any)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="card"><CreditCard className="h-4 w-4 mr-1" /> Card</TabsTrigger>
                  <TabsTrigger value="esewa"><Wallet className="h-4 w-4 mr-1" /> eSewa</TabsTrigger>
                  <TabsTrigger value="khalti"><Smartphone className="h-4 w-4 mr-1" /> Khalti</TabsTrigger>
                  <TabsTrigger value="pay_at_property"><Building2 className="h-4 w-4 mr-1" /> At Property</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="pt-4 text-sm text-muted-foreground">
                  You'll be redirected to a secure Stripe checkout to enter card details.
                </TabsContent>
                <TabsContent value="esewa" className="pt-4 text-sm text-muted-foreground">
                  eSewa integration coming soon — please choose Card or Pay at Property for now.
                </TabsContent>
                <TabsContent value="khalti" className="pt-4 text-sm text-muted-foreground">
                  Khalti integration coming soon — please choose Card or Pay at Property for now.
                </TabsContent>
                <TabsContent value="pay_at_property" className="pt-4 text-sm text-muted-foreground">
                  No payment now. Settle in cash or card on arrival. Booking confirmed instantly.
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-2xl shadow-elegant overflow-hidden border border-border">
              <img src={property.hero_image ?? "/placeholder.svg"} alt={property.name} className="w-full h-40 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold mb-1">{property.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{room.name} · {guests} guests</p>
                <p className="text-sm mb-4"><strong>{checkIn}</strong> → <strong>{checkOut}</strong> ({nights} nights)</p>
                <div className="space-y-2 text-sm py-3 border-t border-b border-border mb-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Room ({nights} nights)</span><span>{formatNPR(pricing.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VAT 13%</span><span>{formatNPR(pricing.taxes)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Platform fee</span><span>{formatNPR(pricing.platformFee)}</span></div>
                  <div className="flex justify-between font-semibold pt-2 text-base"><span>Total</span><span>{formatNPR(pricing.total)}</span></div>
                </div>
                <Button onClick={onConfirm} disabled={submitting || (method !== "card" && method !== "pay_at_property")} className="w-full gradient-primary h-11">
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {method === "card" ? "Confirm & pay" : method === "pay_at_property" ? "Confirm booking" : "Select Card or At Property"}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

const Checkout = () => <ProtectedRoute><CheckoutInner /></ProtectedRoute>;
export default Checkout;
