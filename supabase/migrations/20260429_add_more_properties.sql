-- Add more properties for each destination (5-6 per destination)
DO $$
DECLARE
  demo_host UUID;
  d_pokhara UUID;
  d_bandipur UUID;
  d_chitwan UUID;
  p_id UUID;
BEGIN
  SELECT id INTO demo_host FROM auth.users WHERE email = 'demo-host@tourbook.np';
  SELECT id INTO d_pokhara FROM public.destinations WHERE slug = 'pokhara';
  SELECT id INTO d_bandipur FROM public.destinations WHERE slug = 'bandipur';
  SELECT id INTO d_chitwan FROM public.destinations WHERE slug = 'chitwan';

  -- POKHARA PROPERTIES (6 total)
  -- Property 2: Lakeside Dreams Resort
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_pokhara, 'Lakeside Dreams Resort', 'resort',
   'Modern resort with stunning lake views, infinity pool, and Himalayan backdrop. Perfect for couples and families seeking luxury by the water.',
   'Lakeside Promenade 45', 'Pokhara', 'Gandaki', 28.2089, 83.9870,
   ARRAY['wifi','breakfast','parking','ac','tv','pool'],
     '/property-1.jpg',
     ARRAY['/property-1.jpg','/property-1.jpg'],
   'moderate', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Deluxe Room', 2, 5500, 8, 'King bed, balcony with lake view, spa bathroom'),
  (p_id, 'Family Suite', 4, 9800, 4, 'Two bedrooms, living area, private terrace');

  -- Property 3: Mountain Gate Guesthouse
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_pokhara, 'Mountain Gate Guesthouse', 'guesthouse',
   'Budget-friendly guesthouse with cozy rooms and rooftop restaurant serving Nepali cuisine. Great location for hiking adventures.',
   'Bindabasini Road 12', 'Pokhara', 'Gandaki', 28.2120, 83.9790,
   ARRAY['wifi','breakfast','parking'],
   '/src/assets/guesthouse-1.jpg',
   ARRAY['/src/assets/guesthouse-1.jpg'],
   'flexible', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Basic Room', 2, 2200, 10, 'Simple, clean room with shared bathroom'),
  (p_id, 'Private Ensuite', 2, 3500, 6, 'Private room with attached bathroom, valley view');

  -- Property 4: Sarangkot View Hotel
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_pokhara, 'Sarangkot View Hotel', 'hotel',
   'Located on Sarangkot hill with 360-degree views of Annapurna range. Famous viewpoint for sunrise experiences.',
   'Sarangkot 1', 'Pokhara', 'Gandaki', 28.2300, 83.9650,
   ARRAY['wifi','breakfast','parking','ac','tv'],
   '/src/assets/hotel-sarangkot.jpg',
   ARRAY['/src/assets/hotel-sarangkot.jpg'],
   'moderate', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Standard Room', 2, 4200, 12, 'Comfortable room with valley view'),
  (p_id, 'Premium Suite', 3, 7900, 5, 'Spacious suite with panoramic windows, sitting area');

  -- Property 5: Peace Retreat Homestay
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_pokhara, 'Peace Retreat Homestay', 'homestay',
   'Authentic Nepali homestay with warm family hospitality. Homemade meals included, traditional decor, meditation space.',
   'Dhampus Village 8', 'Pokhara', 'Gandaki', 28.1950, 83.8950,
   ARRAY['wifi','breakfast','parking'],
   '/src/assets/homestay-peace.jpg',
   ARRAY['/src/assets/homestay-peace.jpg'],
   'flexible', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Cozy Room', 2, 2800, 6, 'Traditional room with ethnic furnishings'),
  (p_id, 'Family Room', 4, 4800, 3, 'Larger room suitable for families');

  -- Property 6: Lakefront Luxury Residences
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_pokhara, 'Lakefront Luxury Residences', 'hotel',
   'Premium 5-star hotel with personalized concierge, spa services, and fine dining. Direct lake access with private beach.',
   'Fewa Lake Edge 99', 'Pokhara', 'Gandaki', 28.2100, 83.9890,
   ARRAY['wifi','breakfast','parking','ac','tv','spa','pool'],
   '/src/assets/luxury-hotel.jpg',
   ARRAY['/src/assets/luxury-hotel.jpg'],
   'strict', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Executive Room', 2, 15500, 10, 'Luxury room with lake view, marble bathroom, butler service'),
  (p_id, 'Presidential Suite', 4, 28000, 2, 'Penthouse suite with Jacuzzi, private dining, panoramic lake views');

  -- BANDIPUR PROPERTIES (6 total)
  -- Property 2: Heritage Inn Bandipur
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_bandipur, 'Heritage Inn Bandipur', 'hotel',
   'Restored Newari mansion hotel in the old bazaar. Blends traditional architecture with modern comfort. Walking tours included.',
   'Bandipur Bazaar Main Street', 'Bandipur', 'Gandaki', 27.9390, 84.4140,
   ARRAY['wifi','breakfast','parking'],
   '/src/assets/heritage-inn.jpg',
   ARRAY['/src/assets/heritage-inn.jpg'],
   'moderate', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Heritage Room', 2, 4500, 8, 'Traditional Newari style room with carved wood'),
  (p_id, 'Deluxe Heritage', 2, 7200, 4, 'Premium room with antiques, silky bed linens, modern amenities');

  -- Property 3: Bandipur Mountain Lodge
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_bandipur, 'Bandipur Mountain Lodge', 'guesthouse',
   'Cozy mountain lodge with nature walks and bird watching. Perfect for adventure seekers and nature lovers.',
   'Thani Mai Hill Road', 'Bandipur', 'Gandaki', 27.9300, 84.4050,
   ARRAY['wifi','breakfast'],
   '/src/assets/mountain-lodge.jpg',
   ARRAY['/src/assets/mountain-lodge.jpg'],
   'flexible', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Standard Room', 2, 2600, 10, 'Simple, comfortable rooms with nature view'),
  (p_id, 'Superior Room', 2, 4200, 5, 'Larger room with better views and amenities');

  -- Property 4: Siddhartha Homestay
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_bandipur, 'Siddhartha Homestay', 'homestay',
   'Family-run homestay with authentic Newari hospitality. Home-cooked meals, traditional music, and cultural activities.',
   'Bandipur Old Town 34', 'Bandipur', 'Gandaki', 27.9400, 84.4130,
   ARRAY['wifi','breakfast'],
   '/src/assets/homestay-siddhartha.jpg',
   ARRAY['/src/assets/homestay-siddhartha.jpg'],
   'flexible', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Cozy Double', 2, 2400, 6, 'Traditional room with home comfort'),
  (p_id, 'Family Room', 4, 3900, 3, 'Multi-bed family accommodation');

  -- Property 5: Bandipur Premium Resort
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_bandipur, 'Bandipur Premium Resort', 'resort',
   'Modern resort with spa and wellness center. Perfect blend of heritage location and contemporary luxury.',
   'Resort Road, Bandipur 1', 'Bandipur', 'Gandaki', 27.9450, 84.4200,
   ARRAY['wifi','breakfast','parking','ac','tv','spa','pool'],
   '/src/assets/premium-resort.jpg',
   ARRAY['/src/assets/premium-resort.jpg'],
   'moderate', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Spa Suite', 2, 9500, 6, 'Suite with spa access and wellness treatments'),
  (p_id, 'Resort Villa', 4, 14000, 3, 'Private villa with garden and pool access');

  -- CHITWAN PROPERTIES (6 total)
  -- Property 2: Safari Lodge Chitwan
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_chitwan, 'Safari Lodge Chitwan', 'resort',
   'Classic safari lodge with experienced jungle guides. Daily jungle activities, bird watching, and elephant encounters.',
   'Sauraha Main Street', 'Chitwan', 'Bagmati', 27.5800, 84.4950,
   ARRAY['wifi','breakfast','parking','ac','tv'],
   '/src/assets/safari-lodge.jpg',
   ARRAY['/src/assets/safari-lodge.jpg'],
   'moderate', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Jungle Room', 2, 6500, 12, 'Comfortable room with jungle sounds and nature views'),
  (p_id, 'Safari Suite', 2, 11500, 4, 'Premium suite with telescope for wildlife viewing');

  -- Property 3: Jungle Night Guesthouse
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_chitwan, 'Jungle Night Guesthouse', 'guesthouse',
   'Budget-friendly guesthouse perfect for backpackers. Communal areas, group tours, and bonfire dinners.',
   'Sauraha 5', 'Chitwan', 'Bagmati', 27.5850, 84.5000,
   ARRAY['wifi','breakfast'],
   '/src/assets/guesthouse-jungle.jpg',
   ARRAY['/src/assets/guesthouse-jungle.jpg'],
   'flexible', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Dorm Bed', 1, 1200, 20, 'Shared dormitory with lockers and fan'),
  (p_id, 'Private Room', 2, 3000, 8, 'Private room with shared bathroom');

  -- Property 4: Tiger View Hotel
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_chitwan, 'Tiger View Hotel', 'hotel',
   'Mid-range hotel with excellent wildlife guides and organized jeep safaris through the national park.',
   'Sauraha 12', 'Chitwan', 'Bagmati', 27.5780, 84.4920,
   ARRAY['wifi','breakfast','parking','ac','tv'],
   '/src/assets/tiger-view.jpg',
   ARRAY['/src/assets/tiger-view.jpg'],
   'moderate', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Standard Room', 2, 3800, 15, 'Clean, comfortable room with river view'),
  (p_id, 'Deluxe Room', 3, 6500, 7, 'Spacious room with AC and balcony');

  -- Property 5: Chitwan Riverside Resort
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_chitwan, 'Chitwan Riverside Resort', 'resort',
   'Luxury riverside resort with infinity pool overlooking the Rapti River. Spa services and gourmet dining available.',
   'Rapti Riverside, Sauraha 1', 'Chitwan', 'Bagmati', 27.5750, 84.4900,
   ARRAY['wifi','breakfast','parking','ac','tv','spa','pool'],
   '/src/assets/riverside-resort.jpg',
   ARRAY['/src/assets/riverside-resort.jpg'],
   'strict', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'River Suite', 2, 12800, 8, 'Luxury suite with river-facing windows and hot tub'),
  (p_id, 'Premium Villa', 4, 19500, 4, 'Private villa with dedicated pool area');

  -- Property 6: Budget Tiger Hostel
  INSERT INTO public.properties (host_id, destination_id, name, type, description, address, region, province, latitude, longitude, amenities, hero_image, gallery, cancellation_policy, status, is_verified)
  VALUES
  (demo_host, d_chitwan, 'Budget Tiger Hostel', 'hostel',
   'Social hostel with safari packages, great vibes, and opportunity to meet fellow travelers. Rooftop area with views.',
   'Sauraha Bazaar 3', 'Chitwan', 'Bagmati', 27.5820, 84.5020,
   ARRAY['wifi','breakfast'],
   '/src/assets/budget-hostel.jpg',
   ARRAY['/src/assets/budget-hostel.jpg'],
   'flexible', 'active', true)
  RETURNING id INTO p_id;
  INSERT INTO public.room_types (property_id, name, capacity, price_per_night, quantity, description) VALUES
  (p_id, 'Shared Dorm', 1, 900, 30, 'Budget dorm bed in shared room'),
  (p_id, 'Twin Private', 2, 2500, 6, 'Two twin beds in private room');

END $$;
