import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mountain, Menu, X, User, LogOut, LayoutDashboard, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = roles.includes("admin") ? "/admin"
    : roles.includes("host") ? "/dashboard/host"
    : "/dashboard/tourist";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-smooth ${
        scrolled ? "bg-background/85 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-elegant transition-spring group-hover:scale-110">
            <Mountain className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            TourBook <span className="text-primary">Nepal</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-smooth">Home</Link>
          <Link to="/destinations" className="text-sm font-medium hover:text-primary transition-smooth">Destinations</Link>
          <Link to="/search" className="text-sm font-medium hover:text-primary transition-smooth">Browse Stays</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">EN · NPR</span>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {(user.email?.[0] ?? "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => navigate(dashboardPath)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/tourist")}>
                  <Heart className="mr-2 h-4 w-4" /> My Bookings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth/login")}>Login</Button>
              <Button size="sm" onClick={() => navigate("/auth/register")} className="gradient-primary shadow-elegant">
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg animate-fade-in-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 font-medium">Home</Link>
            <Link to="/destinations" onClick={() => setMobileOpen(false)} className="py-2 font-medium">Destinations</Link>
            <Link to="/search" onClick={() => setMobileOpen(false)} className="py-2 font-medium">Browse Stays</Link>
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="py-2 font-medium">Dashboard</Link>
                <Button variant="outline" onClick={() => { signOut(); setMobileOpen(false); }}>Logout</Button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => { navigate("/auth/login"); setMobileOpen(false); }}>Login</Button>
                <Button className="flex-1 gradient-primary" onClick={() => { navigate("/auth/register"); setMobileOpen(false); }}>Sign up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
