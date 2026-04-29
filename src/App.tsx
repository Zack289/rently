import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import Search from "./pages/Search";
import PropertyDetail from "./pages/PropertyDetail";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import TouristDashboard from "./pages/TouristDashboard";
import Wishlist from "./pages/Wishlist";
import Messages from "./pages/Messages";
import Account from "./pages/Account";
import HostDashboard from "./pages/host/HostDashboard";
import PropertyEditor from "./pages/host/PropertyEditor";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DataSeed from "./pages/admin/DataSeed";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Sonner position="top-center" richColors />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route
                path="/destinations/:slug"
                element={<DestinationDetail />}
              />
              <Route path="/search" element={<Search />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/booking/checkout" element={<Checkout />} />
              <Route path="/booking/confirmation" element={<Confirmation />} />
              <Route path="/dashboard/tourist" element={<TouristDashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard/host" element={<HostDashboard />} />
              <Route path="/host/property/:id" element={<PropertyEditor />} />
              <Route path="/host/property/new" element={<PropertyEditor />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/seed" element={<DataSeed />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route
                path="/auth/forgot-password"
                element={<ForgotPassword />}
              />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
