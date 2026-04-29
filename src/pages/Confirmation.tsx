import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatNPR } from "@/lib/format";

const Confirmation = () => {
  const [params] = useSearchParams();
  const ref = params.get("ref");
  const sessionId = params.get("session_id");
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const fetchByRef = async () => {
      if (ref) {
        const { data } = await supabase.from("bookings").select("*, properties(name)").eq("booking_ref", ref).maybeSingle();
        setBooking(data);
      } else if (sessionId) {
        // Stripe redirect flow — confirm payment via edge function
        const { data: verified } = await supabase.functions.invoke("verify-checkout", { body: { session_id: sessionId } });
        if (verified?.booking_ref) {
          const { data } = await supabase.from("bookings").select("*, properties(name)").eq("booking_ref", verified.booking_ref).maybeSingle();
          setBooking(data);
        }
      }
    };
    fetchByRef();
  }, [ref, sessionId]);

  return (
    <PageLayout>
      <Helmet><title>Booking confirmed · TourBook Nepal</title></Helmet>
      <section className="container mx-auto px-4 py-20 max-w-xl text-center animate-scale-in">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-6">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Booking confirmed!</h1>
        {booking ? (
          <>
            <p className="text-muted-foreground mb-6">Your reservation reference</p>
            <p className="font-mono text-lg bg-secondary inline-block px-4 py-2 rounded-lg mb-6">{booking.booking_ref}</p>
            <div className="bg-card rounded-2xl shadow-card p-6 text-left mb-6">
              <p className="font-semibold mb-2">{booking.properties?.name}</p>
              <p className="text-sm text-muted-foreground mb-1">{booking.check_in} → {booking.check_out} · {booking.nights} nights</p>
              <p className="text-sm">Total paid: <strong>{formatNPR(Number(booking.total_price))}</strong></p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground mb-6">Loading your booking…</p>
        )}
        <p className="text-sm text-muted-foreground mb-8">A confirmation email is on its way.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline"><Link to="/dashboard/tourist">View my bookings</Link></Button>
          <Button asChild className="gradient-primary"><Link to="/">Back to home</Link></Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Confirmation;
