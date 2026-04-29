import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Mountain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "At least 8 characters").max(128),
  role: z.enum(["tourist", "host"]),
});
type FormData = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema), defaultValues: { role: "tourist" },
  });
  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name: data.name, role: data.role },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created — welcome!");
    navigate(data.role === "host" ? "/dashboard/host" : "/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <Helmet><title>Sign up · TourBook Nepal</title></Helmet>
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8 animate-scale-in">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">TourBook <span className="text-primary">Nepal</span></span>
        </Link>
        <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Start exploring Nepal in minutes</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>I am a…</Label>
            <RadioGroup value={role} onValueChange={(v) => setValue("role", v as "tourist" | "host")} className="grid grid-cols-2 gap-2 mt-2">
              <label className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-smooth ${role === "tourist" ? "border-primary bg-secondary" : ""}`}>
                <RadioGroupItem value="tourist" /><span className="text-sm font-medium">Tourist</span>
              </label>
              <label className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-smooth ${role === "host" ? "border-primary bg-secondary" : ""}`}>
                <RadioGroupItem value="host" /><span className="text-sm font-medium">Host</span>
              </label>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} className="mt-1" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className="mt-1" autoComplete="email" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} className="mt-1" autoComplete="new-password" />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account? <Link to="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
