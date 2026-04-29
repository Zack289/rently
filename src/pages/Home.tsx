import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageLayout } from "@/components/PageLayout";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard, PropertyCardData } from "@/components/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck,
  CreditCard,
  Headphones,
  Mountain as MtnIcon,
  Landmark,
  Compass,
  Flame,
  ArrowRight,
} from "lucide-react";
import heroImg from "@/assets/hero-nepal.jpg";

interface Destination {
  id: string;
  name: string;
  slug: string;
  hero_image: string | null;
  region: string;
  description: string;
  tags: string[];
}

const Home = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [featured, setFeatured] = useState<PropertyCardData[]>([]);

  useEffect(() => {
    supabase
      .from("destinations")
      .select("*")
      .eq("is_featured", true)
      .then(({ data }) => {
        setDestinations((data as Destination[]) ?? []);
      });
    supabase
      .from("properties")
      .select(
        "id,name,hero_image,region,type,is_verified, room_types(price_per_night)",
      )
      .eq("status", "active")
      .limit(6)
      .then(({ data }) => {
        setFeatured(
          ((data ?? []) as any[]).map((p) => ({
            id: p.id,
            name: p.name,
            hero_image: p.hero_image,
            region: p.region,
            type: p.type,
            is_verified: p.is_verified,
            min_price: p.room_types?.length
              ? Math.min(
                  ...p.room_types.map((r: any) => Number(r.price_per_night)),
                )
              : undefined,
            rating: 4.5 + Math.random() * 0.5,
          })),
        );
      });
  }, []);

  const categories = [
    { icon: MtnIcon, label: "Nature", tag: "Nature" },
    { icon: Landmark, label: "Heritage", tag: "Heritage" },
    { icon: Compass, label: "Adventure", tag: "Adventure" },
    { icon: Flame, label: "Religious", tag: "Religious" },
  ];

  return (
    <PageLayout>
      <Helmet>
        <title>TourBook Nepal — Discover & Book Stays Across Nepal</title>
        <meta
          name="description"
          content="Verified hotels, guesthouses, and homestays from Pokhara to Kathmandu. Book secure stays across Nepal with TourBook Nepal."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-16 h-[88vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Himalayas at sunrise over a Nepali village"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 container mx-auto px-4 text-center text-background animate-fade-in-up">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-background/80 mb-4">
            Welcome to Nepal
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6 max-w-4xl mx-auto">
            Discover Nepal,
            <br />
            <span className="text-primary-glow">book your stay.</span>
          </h1>
          <p className="text-lg md:text-xl text-background/90 max-w-2xl mx-auto mb-10">
            From Himalayan lodges to riverside homestays — verified rooms across
            the country.
          </p>
          <div className="max-w-5xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Popular destinations
            </h2>
            <p className="text-muted-foreground">
              Explore Nepal's most-loved corners
            </p>
          </div>
          <Link
            to="/destinations"
            className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-smooth"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x">
          {destinations.map((d) => (
            <Link
              key={d.id}
              to={`/destinations/${d.slug}`}
              className="snap-start group shrink-0 w-72 rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-spring hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={d.hero_image ?? "/placeholder.svg"}
                  alt={d.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-spring group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-background">
                  <p className="text-xs uppercase tracking-widest text-background/80 mb-1">
                    {d.region}
                  </p>
                  <h3 className="font-display text-2xl font-bold">{d.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Featured stays
          </h2>
          <p className="text-muted-foreground mb-8">
            Hand-picked, verified properties
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* Why TourBook */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Why TourBook Nepal?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified properties",
                desc: "Every listing personally reviewed before going live.",
              },
              {
                icon: CreditCard,
                title: "Secure payments",
                desc: "International cards, eSewa, Khalti — your choice, fully secured.",
              },
              {
                icon: Headphones,
                title: "24/7 support",
                desc: "Real humans in Kathmandu, ready to help any hour.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-card rounded-2xl p-7 shadow-card text-center"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-4 shadow-elegant">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Browse by category
        </h2>
        <p className="text-muted-foreground mb-8">Find your kind of escape</p>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.label}
              to={`/destinations?tag=${c.tag}`}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-card shadow-card hover:shadow-elegant hover:-translate-y-1 transition-spring"
            >
              <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center mb-3 group-hover:gradient-primary transition-spring">
                <c.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-smooth" />
              </div>
              <span className="font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;
