import { Mountain, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-foreground text-background mt-20">
    <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Mountain className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold">TourBook Nepal</span>
        </div>
        <p className="text-sm text-background/70 leading-relaxed">
          Discover Nepal — verified stays from the Himalayas to the heritage cities.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-background/60">Explore</h4>
        <ul className="space-y-2 text-sm text-background/80">
          <li><Link to="/destinations" className="hover:text-primary-glow transition-smooth">Destinations</Link></li>
          <li><Link to="/search" className="hover:text-primary-glow transition-smooth">Search Stays</Link></li>
          <li><Link to="/auth/register" className="hover:text-primary-glow transition-smooth">List your property</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-background/60">Support</h4>
        <ul className="space-y-2 text-sm text-background/80">
          <li><a className="hover:text-primary-glow transition-smooth" href="#">Help Center</a></li>
          <li><a className="hover:text-primary-glow transition-smooth" href="#">Cancellation</a></li>
          <li><a className="hover:text-primary-glow transition-smooth" href="#">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-background/60">Follow</h4>
        <div className="flex gap-3">
          <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-smooth"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-smooth"><Facebook className="h-4 w-4" /></a>
          <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-smooth"><Twitter className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-background/10 py-5 text-center text-xs text-background/60">
      © {new Date().getFullYear()} TourBook Nepal · Made with care for travelers
    </div>
  </footer>
);
