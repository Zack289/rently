-- ============= ENUMS =============
CREATE TYPE public.app_role AS ENUM ('tourist', 'host', 'admin');
CREATE TYPE public.property_type AS ENUM ('hotel', 'guesthouse', 'homestay', 'resort', 'hostel');
CREATE TYPE public.property_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE public.cancellation_policy AS ENUM ('flexible', 'moderate', 'strict');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'disputed');
CREATE TYPE public.payment_method AS ENUM ('esewa', 'khalti', 'card', 'pay_at_property');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processed', 'failed');

-- ============= PROFILES =============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============= USER ROLES =============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============= DESTINATIONS =============
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  province TEXT,
  hero_image TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- ============= PROPERTIES =============
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type property_type NOT NULL DEFAULT 'hotel',
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  region TEXT,
  province TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  hero_image TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  cancellation_policy cancellation_policy NOT NULL DEFAULT 'moderate',
  checkin_time TEXT NOT NULL DEFAULT '14:00',
  checkout_time TEXT NOT NULL DEFAULT '11:00',
  house_rules TEXT,
  status property_status NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_properties_destination ON public.properties(destination_id);
CREATE INDEX idx_properties_host ON public.properties(host_id);
CREATE INDEX idx_properties_status ON public.properties(status);

-- ============= ROOM TYPES =============
CREATE TABLE public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 2,
  price_per_night NUMERIC(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  description TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

-- ============= BOOKINGS =============
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT NOT NULL UNIQUE,
  tourist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  nights INT NOT NULL,
  room_rate NUMERIC(12,2) NOT NULL,
  taxes NUMERIC(12,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(12,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  special_requests TEXT,
  payment_method payment_method NOT NULL DEFAULT 'card',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Booking ref generator: TB-YYYYMMDD-XXXX
CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.booking_ref IS NULL OR NEW.booking_ref = '' THEN
    NEW.booking_ref := 'TB-' || to_char(now(), 'YYYYMMDD') || '-' ||
      lpad(floor(random() * 10000)::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER bookings_set_ref BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_ref();

-- ============= REVIEWS =============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  tourist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  rating_cleanliness INT NOT NULL CHECK (rating_cleanliness BETWEEN 1 AND 5),
  rating_accuracy INT NOT NULL CHECK (rating_accuracy BETWEEN 1 AND 5),
  rating_value INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
  rating_location INT NOT NULL CHECK (rating_location BETWEEN 1 AND 5),
  rating_overall NUMERIC(3,2) NOT NULL,
  comment TEXT,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ============= WISHLISTS =============
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tourist_id, property_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- ============= MESSAGES =============
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============= SUPPORT TICKETS =============
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- ============= PAYOUTS =============
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  gross_amount NUMERIC(12,2) NOT NULL,
  commission_amount NUMERIC(12,2) NOT NULL,
  net_amount NUMERIC(12,2) NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- ============= PLATFORM SETTINGS =============
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- ============= BANNERS =============
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- ============= updated_at trigger =============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_destinations_updated BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_properties_updated BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============= AUTO PROFILE + ROLE ON SIGNUP =============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'tourist'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============= RLS POLICIES =============

-- profiles
CREATE POLICY "Anyone view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins update profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- destinations
CREATE POLICY "Anyone view destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Admins manage destinations" ON public.destinations FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- properties
CREATE POLICY "Anyone view active properties" ON public.properties FOR SELECT USING (status = 'active' OR host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Hosts insert own properties" ON public.properties FOR INSERT WITH CHECK (host_id = auth.uid() AND (public.has_role(auth.uid(), 'host') OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Hosts update own properties" ON public.properties FOR UPDATE USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Hosts delete own properties" ON public.properties FOR DELETE USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- room_types
CREATE POLICY "Anyone view room types" ON public.room_types FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.status = 'active' OR p.host_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Hosts manage own room types" ON public.room_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.host_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.host_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

-- bookings
CREATE POLICY "Tourists view own bookings" ON public.bookings FOR SELECT USING (
  tourist_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.host_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Tourists create bookings" ON public.bookings FOR INSERT WITH CHECK (tourist_id = auth.uid());
CREATE POLICY "Tourists update own bookings" ON public.bookings FOR UPDATE USING (
  tourist_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.host_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- reviews
CREATE POLICY "Anyone view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true OR tourist_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Tourists create reviews" ON public.reviews FOR INSERT WITH CHECK (tourist_id = auth.uid());
CREATE POLICY "Tourists update own reviews" ON public.reviews FOR UPDATE USING (tourist_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete reviews" ON public.reviews FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- wishlists
CREATE POLICY "Tourists manage own wishlist" ON public.wishlists FOR ALL USING (tourist_id = auth.uid()) WITH CHECK (tourist_id = auth.uid());

-- messages
CREATE POLICY "Users view own messages" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users update own messages" ON public.messages FOR UPDATE USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- support_tickets
CREATE POLICY "Users view own tickets" ON public.support_tickets FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create tickets" ON public.support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins update tickets" ON public.support_tickets FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- payouts
CREATE POLICY "Hosts view own payouts" ON public.payouts FOR SELECT USING (host_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage payouts" ON public.payouts FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- platform_settings
CREATE POLICY "Anyone read settings" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- banners
CREATE POLICY "Anyone view active banners" ON public.banners FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============= SEED =============
INSERT INTO public.destinations (name, slug, description, region, province, hero_image, tags, is_featured) VALUES
('Pokhara', 'pokhara', 'A serene lakeside city beneath the Annapurna massif. The gateway to trekking, paragliding, and tranquil sunrises over Phewa Lake.', 'Western Nepal', 'Gandaki', '/src/assets/dest-pokhara.jpg', ARRAY['Nature','Adventure','Lake'], true),
('Kathmandu', 'kathmandu', 'Nepal''s vibrant capital — a tapestry of ancient temples, bustling bazaars, and centuries of Newari heritage in every stone.', 'Central Nepal', 'Bagmati', '/src/assets/dest-kathmandu.jpg', ARRAY['Heritage','Culture','City'], true),
('Chitwan', 'chitwan', 'Subtropical jungle home to one-horned rhinos, Bengal tigers, and elephant safaris through dense sal forests.', 'Southern Nepal', 'Bagmati', '/src/assets/dest-chitwan.jpg', ARRAY['Nature','Wildlife','Adventure'], true),
('Lumbini', 'lumbini', 'The sacred birthplace of Lord Buddha. A place of pilgrimage, peace gardens, and monasteries from across the Buddhist world.', 'Southern Nepal', 'Lumbini', '/src/assets/dest-lumbini.jpg', ARRAY['Religious','Heritage','Pilgrimage'], true),
('Nagarkot', 'nagarkot', 'Hilltop village known for the most spectacular Himalayan sunrises — on a clear morning, Everest peeks above the horizon.', 'Central Nepal', 'Bagmati', '/src/assets/dest-nagarkot.jpg', ARRAY['Nature','Mountain','Sunrise'], true),
('Bandipur', 'bandipur', 'A perfectly preserved Newari hill town, car-free cobbled streets and panoramic views of the Annapurna and Manaslu ranges.', 'Western Nepal', 'Gandaki', '/src/assets/dest-bandipur.jpg', ARRAY['Heritage','Culture','Mountain'], true);

INSERT INTO public.platform_settings (key, value) VALUES
('commission_rate', '10'),
('platform_fee_pct', '2'),
('vat_pct', '13'),
('currency', 'NPR'),
('site_name', 'TourBook Nepal');

INSERT INTO public.banners (title, subtitle, cta_text, cta_link, display_order) VALUES
('Monsoon Special — 20% off mountain stays', 'Limited time: book any Pokhara or Nagarkot property and save', 'Explore deals', '/destinations', 1);