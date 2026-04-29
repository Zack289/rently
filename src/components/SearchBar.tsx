import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar as CalIcon, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export const SearchBar = ({ compact, destinationId }: { compact?: boolean; destinationId?: string }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("q", destination);
    if (destinationId) params.set("destination", destinationId);
    if (checkIn) params.set("checkin", checkIn.toISOString().slice(0, 10));
    if (checkOut) params.set("checkout", checkOut.toISOString().slice(0, 10));
    params.set("guests", String(guests));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`bg-card rounded-2xl shadow-elegant p-2 grid gap-2 ${compact ? "md:grid-cols-[1fr_auto_auto_auto_auto]" : "md:grid-cols-[1.5fr_1fr_1fr_auto_auto]"} grid-cols-1`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Where to? Pokhara, Kathmandu…"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-3 h-12 rounded-lg hover:bg-secondary transition-smooth text-sm">
            <CalIcon className="h-4 w-4 text-muted-foreground" />
            <span className={checkIn ? "" : "text-muted-foreground"}>
              {checkIn ? format(checkIn, "MMM d") : "Check-in"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} initialFocus className="pointer-events-auto" />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-3 h-12 rounded-lg hover:bg-secondary transition-smooth text-sm">
            <CalIcon className="h-4 w-4 text-muted-foreground" />
            <span className={checkOut ? "" : "text-muted-foreground"}>
              {checkOut ? format(checkOut, "MMM d") : "Check-out"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d <= (checkIn ?? new Date())} initialFocus className="pointer-events-auto" />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2 px-3 h-12 rounded-lg hover:bg-secondary transition-smooth">
        <Users className="h-4 w-4 text-muted-foreground" />
        <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-sm w-6 h-6 rounded-full hover:bg-background">−</button>
        <span className="text-sm font-medium w-6 text-center">{guests}</span>
        <button onClick={() => setGuests(guests + 1)} className="text-sm w-6 h-6 rounded-full hover:bg-background">+</button>
      </div>

      <Button onClick={handleSearch} size="lg" className="h-12 gradient-primary shadow-elegant gap-2 px-6">
        <Search className="h-4 w-4" /> Search
      </Button>
    </div>
  );
};
