import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Star, MapPin, BadgeCheck, Calendar as CalIcon, Users, Wifi, Coffee, Car, Wind, Tv, Bath, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { formatNPR, nightsBetween, computePricing } from "@/lib/format";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface RoomType { id: string; name: string; capacity: number; price_per_night: number; description: string | null; }
interface Property {
  id: string; name: string; description: string; type: string; address: string;
  region: string | null; province: string | null; hero_image: string | null;
  gallery: string[]; amenities: string[]; is_verified: boolean;
  cancellation_policy: string; checkin_time: string; checkout_time: string;
  latitude: number | null; longitude: number | null; host_id: string;
}

const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi, breakfast: Coffee, parking: Car, ac: Wind, tv: Tv, bathroom: Bath,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prop, setProp] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    if (!id) return;
    supabase.from("properties").select("*").eq("id", id).maybeSingle().then(({ data }) => setProp(data as Property));
    supabase.from("room_types").select("*").eq("property_id", id).order("price_per_night").then(({ data }) => {
      const r = (data ?? []) as any[];
      setRooms(r.map((x) => ({ ...x, price_per_night: Number(x.price_per_night) })));
      if (r.length) setSelectedRoom(r[0].id);
    });
  }, [id]);

  if (!prop) return <PageLayout><div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div></PageLayout>;

  const room = rooms.find((r) => r.id === selectedRoom);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const pricing = room && nights ? computePricing(room.price_per_night, nights) : null;

  const goCheckout = () => {
    if (!user) { navigate("/auth/login", { state: { from: window.location.pathname } }); return; }
    if (!checkIn || !checkOut || !room) { toast.error("Please pick dates and a room"); return; }
    const params = new URLSearchParams({
      property: prop.id, room: room.id,
      checkin: checkIn.toISOString().slice(0, 10),
      checkout: checkOut.toISOString().slice(0, 10),
      guests: String(guests),
    });
    navigate(`/booking/checkout?${params.toString()}`);
  };

  const gallery = [prop.hero_image, ...(prop.gallery ?? [])].filter(Boolean) as string[];

  return (
    <PageLayout>
      <Helmet>
        <title>{prop.name} · TourBook Nepal</title>
        <meta name="description" content={prop.description.slice(0, 160)} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "LodgingBusiness",
          name: prop.name, description: prop.description, image: prop.hero_image,
          address: { "@type": "PostalAddress", addressLocality: prop.region, addressCountry: "NP" },
        })}</script>
      </Helmet>

      <div className="container mx-auto px-4 pt-6">
        <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to search
        </Link>
      </div>

      {/* Gallery */}
      <section className="container mx-auto px-4">
        <div className="grid gap-2 grid-cols-1 md:grid-cols-4 md:grid-rows-2 rounded-2xl overflow-hidden h-[60vh] min-h-[400px]">
          <div className="md:col-span-2 md:row-span-2 relative">
            <img src={gallery[0] ?? "/placeholder.svg"} alt={prop.name} className="w-full h-full object-cover" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hidden md:block relative bg-muted">
              <img src={gallery[i] ?? gallery[0] ?? "/placeholder.svg"} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium text-primary capitalize">{prop.type}</span>
              {prop.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs text-primary"><BadgeCheck className="h-4 w-4" /> Verified</span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{prop.name}</h1>
            <p className="flex items-center gap-1 text-muted-foreground mb-1"><MapPin className="h-4 w-4" /> {prop.address}, {prop.region}</p>
            <div className="flex items-center gap-2 text-sm mb-6">
              <Star className="h-4 w-4 fill-warning text-warning" /><span className="font-semibold">4.8</span>
              <span className="text-muted-foreground">· 124 reviews</span>
            </div>

            <p className="text-foreground leading-relaxed mb-8">{prop.description}</p>

            <h2 className="font-semibold text-xl mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {prop.amenities.map((a) => {
                const Icon = AMENITY_ICONS[a.toLowerCase()] ?? BadgeCheck;
                return (
                  <div key={a} className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" /> <span className="capitalize">{a}</span>
                  </div>
                );
              })}
            </div>

            <h2 className="font-semibold text-xl mb-4">Choose your room</h2>
            <div className="space-y-3">
              {rooms.map((r) => (
                <button key={r.id} onClick={() => setSelectedRoom(r.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-smooth ${
                    selectedRoom === r.id ? "border-primary bg-secondary/40 shadow-card" : "border-border hover:border-primary/50"
                  }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{r.name}</h3>
                      <p className="text-sm text-muted-foreground">Sleeps {r.capacity}</p>
                      {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{formatNPR(r.price_per_night)}</p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-secondary/40 rounded-xl">
              <p className="text-sm"><span className="font-medium">Check-in</span> from {prop.checkin_time} · <span className="font-medium">Check-out</span> by {prop.checkout_time}</p>
              <p className="text-sm mt-1 capitalize"><span className="font-medium">Cancellation:</span> {prop.cancellation_policy}</p>
            </div>
          </div>

          {/* Booking widget */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card rounded-2xl shadow-elegant p-6 border border-border">
              {room && (
                <p className="mb-4">
                  <span className="text-2xl font-bold">{formatNPR(room.price_per_night)}</span>
                  <span className="text-muted-foreground"> / night</span>
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="border rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary transition-smooth">
                      <p className="text-xs text-muted-foreground">Check-in</p>
                      <p className="font-medium">{checkIn ? format(checkIn, "MMM d") : "Add date"}</p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="border rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary transition-smooth">
                      <p className="text-xs text-muted-foreground">Check-out</p>
                      <p className="font-medium">{checkOut ? format(checkOut, "MMM d") : "Add date"}</p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d <= (checkIn ?? new Date())} className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between border rounded-lg px-3 py-2 mb-4">
                <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-muted-foreground" /> Guests</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border hover:bg-secondary">−</button>
                  <span className="font-medium w-4 text-center">{guests}</span>
                  <button onClick={() => setGuests(guests + 1)} className="w-7 h-7 rounded-full border hover:bg-secondary">+</button>
                </div>
              </div>

              {pricing && (
                <div className="space-y-2 text-sm py-3 border-t border-b border-border mb-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">{formatNPR(room!.price_per_night)} × {nights} nights</span><span>{formatNPR(pricing.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Taxes (13% VAT)</span><span>{formatNPR(pricing.taxes)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Platform fee (2%)</span><span>{formatNPR(pricing.platformFee)}</span></div>
                  <div className="flex justify-between font-semibold pt-2"><span>Total (NPR)</span><span>{formatNPR(pricing.total)}</span></div>
                </div>
              )}

              <Button onClick={goCheckout} className="w-full gradient-primary h-11" size="lg">
                <CalIcon className="h-4 w-4 mr-2" /> Book now
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">You won't be charged yet</p>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

export default PropertyDetail;
