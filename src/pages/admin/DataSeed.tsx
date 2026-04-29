import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { seedProperties } from "@/lib/seedPropertiesFixed";

export default function DataSeed() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedProperties();
      toast.success("Properties seeded successfully!");
    } catch (error) {
      console.error("Seeding error:", error);
      toast.error("Error seeding properties");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto bg-card rounded-lg p-6 shadow-card">
        <h1 className="font-display text-2xl font-bold mb-4">Database Seed</h1>
        <p className="text-muted-foreground mb-6">
          Click the button below to add 5-6 properties per destination with room types.
        </p>
        <Button onClick={handleSeed} disabled={loading} size="lg" className="w-full">
          {loading ? "Seeding..." : "Seed Properties"}
        </Button>
      </div>
    </div>
  );
}
