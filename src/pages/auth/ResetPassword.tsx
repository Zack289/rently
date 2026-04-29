import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mountain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts recovery tokens in the URL hash
    if (window.location.hash.includes("type=recovery")) setReady(true);
    else setReady(true); // Allow direct visit too
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <Helmet><title>New password · TourBook Nepal</title></Helmet>
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8 animate-scale-in">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">TourBook <span className="text-primary">Nepal</span></span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Set a new password</h1>
        {ready && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pwd">New password</Label>
              <Input id="pwd" type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} className="mt-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
