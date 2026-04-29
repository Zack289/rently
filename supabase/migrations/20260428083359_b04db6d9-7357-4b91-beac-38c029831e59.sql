-- Create a demo host auth user (once), then properties tied to them.
DO $$
DECLARE
  demo_host UUID;
  d_pokhara UUID;
  d_bandipur UUID;
  d_chitwan UUID;
  p1 UUID; p2 UUID; p3 UUID;
BEGIN
  SELECT id INTO demo_host FROM auth.users WHERE email = 'demo-host@tourbook.np';

  IF demo_host IS NULL THEN
    demo_host := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous
    ) VALUES (
      demo_host, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'demo-host@tourbook.np', crypt('DemoHost@2026', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Demo Host","role":"host"}'::jsonb,
      false, false
    );
    -- Trigger handle_new_user will create profile + tourist role; add host role.
    INSERT INTO public.user_roles (user_id, role) VALUES (demo_host, 'host')
      ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO d_pokhara FROM public.destinations WHERE slug='pokhara';
  SELECT id INTO d_bandipur FROM public.destinations WHERE slug='bandipur';
  SELECT id INTO d_chitwan FROM public.destinations WHERE slug='chitwan';

  -- Skip if already seeded
  IF NOT EXISTS (SELECT 1 FROM public.properties WHERE host_id = demo_host) THEN
    INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
    VALUES
    (demo_host, d_pokhara, 'Himalayan View Boutique', 'hotel',
     'A refined boutique hotel perched above Phewa Lake, with panoramic rooms framing the Annapurna range. Warm Nepali hospitality, rooftop yoga, and a celebrated farm-to-table kitchen.',
     'Lakeside Marg 12', 'Pokhara', 'Gandaki', 28.2096, 83.9856,
     ARRAY['wifi','breakfast','parking','ac','tv'],
     '/src/assets/property-1.jpg',
     ARRAY['/src/assets/property-1.jpg','/src/assets/dest-pokhara.jpg','/src/assets/dest-nagarkot.jpg'],
     'moderate', 'active', true)
    RETURNING id INTO p1;

    INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
    VALUES
    (demo_host, d_bandipur, 'Old Newari Homestay', 'homestay',
     'Stay inside a 200-year-old Newari merchant house on Bandipur''s cobblestone main street. Hand-carved windows, family-cooked dinners, and sweeping views of Manaslu from the terrace.',
     'Bandipur Bazaar', 'Bandipur', 'Gandaki', 27.9395, 84.4140,
     ARRAY['wifi','breakfast','bathroom'],
     '/src/assets/property-2.jpg',
     ARRAY['/src/assets/property-2.jpg','/src/assets/dest-bandipur.jpg','/src/assets/dest-kathmandu.jpg'],
     'flexible', 'active', true)
    RETURNING id INTO p2;

    INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
    VALUES
    (demo_host, d_chitwan, 'Riverside Jungle Lodge', 'resort',
     'Luxury jungle cottages on the banks of the Rapti River. Elephant-back safaris, canoe rides along the riverbank, and lantern-lit dinners around the bonfire.',
     'Sauraha 7', 'Chitwan', 'Bagmati', 27.5790, 84.4957,
     ARRAY['wifi','breakfast','parking','ac','tv','bathroom'],
     '/src/assets/property-3.jpg',
     ARRAY['/src/assets/property-3.jpg','/src/assets/dest-chitwan.jpg','/src/assets/dest-lumbini.jpg'],
     'strict', 'active', true)
    RETURNING id INTO p3;

    INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
    (p1, 'Mountain View Standard', 2, 6500, 6, 'Queen bed, private balcony facing the Annapurna massif.'),
    (p1, 'Annapurna Deluxe Suite', 3, 12800, 3, 'Separate sitting area, king bed, and panoramic glass wall.'),
    (p2, 'Heritage Double', 2, 3200, 4, 'Carved wooden bed, shared courtyard views, traditional breakfast included.'),
    (p2, 'Top Floor Family Room', 4, 5400, 2, 'Four-bed family room with Manaslu views and en-suite bath.'),
    (p3, 'Riverside Cottage', 2, 8900, 8, 'Standalone thatched cottage steps from the Rapti River.'),
    (p3, 'Safari Luxury Tent', 2, 14500, 4, 'Canvas-walled luxury tent with hardwood floors and outdoor shower.');
  END IF;
END $$;