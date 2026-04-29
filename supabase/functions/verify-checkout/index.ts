// Verifies a Stripe Checkout Session after user returns from payment.
// Marks the booking as paid + confirmed. Safe to call more than once (idempotent).

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const { session_id } = await req.json();
    if (!session_id || typeof session_id !== "string") throw new Error("session_id required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const bookingId = session.metadata?.booking_id;
    const bookingRef = session.metadata?.booking_ref;
    if (!bookingId) throw new Error("Missing booking reference");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (session.payment_status === "paid") {
      await admin.from("bookings").update({
        payment_status: "paid",
        status: "confirmed",
      }).eq("id", bookingId);
    }

    return new Response(JSON.stringify({
      paid: session.payment_status === "paid",
      booking_ref: bookingRef,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("verify-checkout error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
