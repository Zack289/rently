// Creates a Stripe Checkout Session for a pending booking.
// Uses BYOK Stripe (STRIPE_SECRET_KEY). Prices converted from NPR → USD
// for broad card support (Stripe doesn't accept NPR).

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Approx NPR → USD (for demo checkout). In production, use a live FX API.
const NPR_TO_USD = 0.0075;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { booking_id } = await req.json();
    if (!booking_id || typeof booking_id !== "string") throw new Error("booking_id required");

    // Load booking (RLS ensures user only sees their own)
    const { data: booking, error } = await userClient
      .from("bookings")
      .select("*, properties(name, hero_image)")
      .eq("id", booking_id)
      .eq("tourist_id", user.id)
      .single();
    if (error || !booking) throw new Error("Booking not found");

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
    const usdCents = Math.max(50, Math.round(Number(booking.total_price) * NPR_TO_USD * 100));

    const origin = req.headers.get("origin") ?? "https://example.com";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: usdCents,
          product_data: {
            name: `Booking ${booking.booking_ref} — ${booking.properties?.name ?? "Stay"}`,
            description: `${booking.check_in} → ${booking.check_out} · ${booking.nights} nights · approx. NPR ${Math.round(Number(booking.total_price))}`,
            images: booking.properties?.hero_image ? [booking.properties.hero_image] : undefined,
          },
        },
        quantity: 1,
      }],
      customer_email: user.email,
      success_url: `${origin}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/checkout?property=${booking.property_id}&room=${booking.room_type_id}&checkin=${booking.check_in}&checkout=${booking.check_out}&guests=${booking.guests}`,
      metadata: { booking_id: booking.id, booking_ref: booking.booking_ref },
    });

    // Save session id with service role (bypass RLS for internal field)
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);
    await admin.from("bookings").update({ stripe_session_id: session.id }).eq("id", booking.id);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("create-checkout error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
