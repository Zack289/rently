import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { formatNPR } from "@/lib/format";

export default function PropertyEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    name: "", type: "hotel", description: "", address: "", region: "",
    hero_image: "", destination_id: null, amenities: [] as string[],
    cancellation_policy: "moderate", checkin_time: "14:00", checkout_time: "11:00",
    house_rules: "",
  });

  useEffect(() => {
    supabase.from("destinations").select("id, name").then(({ data }) => setDestinations(data ?? []));
    if (!isNew && id) {
      supabase.from("properties").select("*").eq("id", id).maybeSingle().then(({ data }) => { if (data) setForm(data); });
      supabase.from("room_types").select("*").eq("property_id", id).then(({ data }) => setRooms(data ?? []));
    }
  }, [id, isNew]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = { ...form, host_id: user.id, amenities: form.amenities ?? [] };
    if (isNew) {
      const { data, error } = await supabase.from("properties").insert({ ...payload, status: "pending" }).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Property created — pending admin approval");
      navigate(`/host/properties/${data.id}`);
    } else {
      const { error } = await supabase.from("properties").update(payload).eq("id", id!);
      if (error) toast.error(error.message);
      else toast.success("Saved");
    }
    setSaving(false);
  };

  const addRoom = async () => {
    if (isNew) return;
    const { data, error } = await supabase.from("room_types").insert({
      property_id: id!, name: "Standard Room", capacity: 2, price_per_night: 3000, quantity: 1, images: [],
    }).select().single();
    if (error) return toast.error(error.message);
    setRooms([...rooms, data]);
  };

  const updateRoom = async (rid: string, patch: any) => {
    await supabase.from("room_types").update(patch).eq("id", rid);
    setRooms(rooms.map((r) => r.id === rid ? { ...r, ...patch } : r));
  };

  const removeRoom = async (rid: string) => {
    await supabase.from("room_types").delete().eq("id", rid);
    setRooms(rooms.filter((r) => r.id !== rid));
  };

  return (
    <ProtectedRoute role="host">
      <PageLayout>
        <div className="container max-w-3xl py-10">
          <h1 className="font-display text-3xl font-bold mb-6">{isNew ? "New property" : "Edit property"}</h1>

          <div className="space-y-4 bg-card border rounded-xl p-6">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["hotel","resort","homestay","lodge","guesthouse","apartment"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Destination</Label>
                <Select value={form.destination_id ?? ""} onValueChange={(v) => setForm({ ...form, destination_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                  <SelectContent>{destinations.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div><Label>Region</Label><Input value={form.region ?? ""} onChange={(e) => setForm({ ...form, region: e.target.value })} /></div>
            </div>
            <div><Label>Hero image URL</Label><Input value={form.hero_image ?? ""} onChange={(e) => setForm({ ...form, hero_image: e.target.value })} /></div>
            <div><Label>Amenities (comma-separated)</Label>
              <Input value={(form.amenities ?? []).join(", ")} onChange={(e) => setForm({ ...form, amenities: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Cancellation</Label>
                <Select value={form.cancellation_policy} onValueChange={(v) => setForm({ ...form, cancellation_policy: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["flexible","moderate","strict"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Check-in</Label><Input value={form.checkin_time} onChange={(e) => setForm({ ...form, checkin_time: e.target.value })} /></div>
              <div><Label>Check-out</Label><Input value={form.checkout_time} onChange={(e) => setForm({ ...form, checkout_time: e.target.value })} /></div>
            </div>
            <div><Label>House rules</Label><Textarea rows={3} value={form.house_rules ?? ""} onChange={(e) => setForm({ ...form, house_rules: e.target.value })} /></div>

            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save property"}</Button>
          </div>

          {!isNew && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-2xl font-bold">Room types</h2>
                <Button size="sm" onClick={addRoom}><Plus className="h-4 w-4 mr-1" />Add room</Button>
              </div>
              <div className="space-y-3">
                {rooms.map((r) => (
                  <div key={r.id} className="border rounded-lg p-4 grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-end">
                    <div><Label className="text-xs">Name</Label><Input value={r.name} onChange={(e) => updateRoom(r.id, { name: e.target.value })} /></div>
                    <div><Label className="text-xs">Capacity</Label><Input type="number" className="w-20" value={r.capacity} onChange={(e) => updateRoom(r.id, { capacity: +e.target.value })} /></div>
                    <div><Label className="text-xs">Price/night (NPR)</Label><Input type="number" className="w-32" value={r.price_per_night} onChange={(e) => updateRoom(r.id, { price_per_night: +e.target.value })} /></div>
                    <div><Label className="text-xs">Qty</Label><Input type="number" className="w-20" value={r.quantity} onChange={(e) => updateRoom(r.id, { quantity: +e.target.value })} /></div>
                    <Button variant="ghost" size="icon" onClick={() => removeRoom(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                {rooms.length === 0 && <p className="text-muted-foreground text-sm">No room types yet.</p>}
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
