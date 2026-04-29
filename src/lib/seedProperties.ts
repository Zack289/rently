import { supabase } from "@/integrations/supabase/client";

export async function seedProperties() {
  try {
    console.log("Starting property seeding...");

    // Get demo host
    const { data: hostData, error: hostError } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", "demo-host@tourbook.np")
      .single();

    if (hostError) {
      console.error("Error finding host:", hostError);
      return;
    }

    const hostId = hostData?.id;
    console.log("Host ID:", hostId);

    // Get destinations
    const { data: destinationsData, error: destError } = await supabase
      .from("destinations")
      .select("id, slug, name");

    if (destError) {
      console.error("Error fetching destinations:", destError);
      return;
    }

    const destinations = destinationsData as any[];
    console.log("Found destinations:", destinations);

    // Properties to add
    const propertiesToAdd = [
      // POKHARA
      {
        destination: "pokhara",
        properties: [
          {
            name: "Lakeside Dreams Resort",
            type: "resort",
            description: "Modern resort with stunning lake views, infinity pool, and Himalayan backdrop.",
            address: "Lakeside Promenade 45",
            latitude: 28.2089,
            longitude: 83.987,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "pool"],
            rooms: [
              { name: "Deluxe Room", capacity: 2, price: 5500, quantity: 8 },
              { name: "Family Suite", capacity: 4, price: 9800, quantity: 4 },
            ],
          },
          {
            name: "Mountain Gate Guesthouse",
            type: "guesthouse",
            description: "Budget-friendly guesthouse with cozy rooms and rooftop restaurant.",
            address: "Bindabasini Road 12",
            latitude: 28.212,
            longitude: 83.979,
            amenities: ["wifi", "breakfast", "parking"],
            rooms: [
              { name: "Basic Room", capacity: 2, price: 2200, quantity: 10 },
              { name: "Private Ensuite", capacity: 2, price: 3500, quantity: 6 },
            ],
          },
          {
            name: "Sarangkot View Hotel",
            type: "hotel",
            description: "Located on Sarangkot hill with 360-degree views of Annapurna range.",
            address: "Sarangkot 1",
            latitude: 28.23,
            longitude: 83.965,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv"],
            rooms: [
              { name: "Standard Room", capacity: 2, price: 4200, quantity: 12 },
              { name: "Premium Suite", capacity: 3, price: 7900, quantity: 5 },
            ],
          },
          {
            name: "Peace Retreat Homestay",
            type: "homestay",
            description: "Authentic Nepali homestay with warm family hospitality.",
            address: "Dhampus Village 8",
            latitude: 28.195,
            longitude: 83.895,
            amenities: ["wifi", "breakfast", "parking"],
            rooms: [
              { name: "Cozy Room", capacity: 2, price: 2800, quantity: 6 },
              { name: "Family Room", capacity: 4, price: 4800, quantity: 3 },
            ],
          },
          {
            name: "Lakefront Luxury Residences",
            type: "hotel",
            description: "Premium 5-star hotel with personalized concierge and spa services.",
            address: "Fewa Lake Edge 99",
            latitude: 28.21,
            longitude: 83.989,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "spa", "pool"],
            rooms: [
              { name: "Executive Room", capacity: 2, price: 15500, quantity: 10 },
              { name: "Presidential Suite", capacity: 4, price: 28000, quantity: 2 },
            ],
          },
        ],
      },
      // BANDIPUR
      {
        destination: "bandipur",
        properties: [
          {
            name: "Heritage Inn Bandipur",
            type: "hotel",
            description: "Restored Newari mansion hotel blending traditional architecture with modern comfort.",
            address: "Bandipur Bazaar Main Street",
            latitude: 27.939,
            longitude: 84.414,
            amenities: ["wifi", "breakfast", "parking"],
            rooms: [
              { name: "Heritage Room", capacity: 2, price: 4500, quantity: 8 },
              { name: "Deluxe Heritage", capacity: 2, price: 7200, quantity: 4 },
            ],
          },
          {
            name: "Bandipur Mountain Lodge",
            type: "guesthouse",
            description: "Cozy mountain lodge with nature walks and bird watching.",
            address: "Thani Mai Hill Road",
            latitude: 27.93,
            longitude: 84.405,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Standard Room", capacity: 2, price: 2600, quantity: 10 },
              { name: "Superior Room", capacity: 2, price: 4200, quantity: 5 },
            ],
          },
          {
            name: "Siddhartha Homestay",
            type: "homestay",
            description: "Family-run homestay with authentic Newari hospitality.",
            address: "Bandipur Old Town 34",
            latitude: 27.94,
            longitude: 84.413,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Cozy Double", capacity: 2, price: 2400, quantity: 6 },
              { name: "Family Room", capacity: 4, price: 3900, quantity: 3 },
            ],
          },
          {
            name: "Bandipur Premium Resort",
            type: "resort",
            description: "Modern resort with spa and wellness center.",
            address: "Resort Road, Bandipur 1",
            latitude: 27.945,
            longitude: 84.42,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "spa", "pool"],
            rooms: [
              { name: "Spa Suite", capacity: 2, price: 9500, quantity: 6 },
              { name: "Resort Villa", capacity: 4, price: 14000, quantity: 3 },
            ],
          },
        ],
      },
      // CHITWAN
      {
        destination: "chitwan",
        properties: [
          {
            name: "Safari Lodge Chitwan",
            type: "resort",
            description: "Classic safari lodge with experienced jungle guides and daily activities.",
            address: "Sauraha Main Street",
            latitude: 27.58,
            longitude: 84.495,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv"],
            rooms: [
              { name: "Jungle Room", capacity: 2, price: 6500, quantity: 12 },
              { name: "Safari Suite", capacity: 2, price: 11500, quantity: 4 },
            ],
          },
          {
            name: "Jungle Night Guesthouse",
            type: "guesthouse",
            description: "Budget-friendly guesthouse perfect for backpackers.",
            address: "Sauraha 5",
            latitude: 27.585,
            longitude: 84.5,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Dorm Bed", capacity: 1, price: 1200, quantity: 20 },
              { name: "Private Room", capacity: 2, price: 3000, quantity: 8 },
            ],
          },
          {
            name: "Tiger View Hotel",
            type: "hotel",
            description: "Mid-range hotel with excellent wildlife guides and organized safaris.",
            address: "Sauraha 12",
            latitude: 27.578,
            longitude: 84.492,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv"],
            rooms: [
              { name: "Standard Room", capacity: 2, price: 3800, quantity: 15 },
              { name: "Deluxe Room", capacity: 3, price: 6500, quantity: 7 },
            ],
          },
          {
            name: "Chitwan Riverside Resort",
            type: "resort",
            description: "Luxury riverside resort with infinity pool overlooking the Rapti River.",
            address: "Rapti Riverside, Sauraha 1",
            latitude: 27.575,
            longitude: 84.49,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "spa", "pool"],
            rooms: [
              { name: "River Suite", capacity: 2, price: 12800, quantity: 8 },
              { name: "Premium Villa", capacity: 4, price: 19500, quantity: 4 },
            ],
          },
          {
            name: "Budget Tiger Hostel",
            type: "hostel",
            description: "Social hostel with safari packages and great vibes.",
            address: "Sauraha Bazaar 3",
            latitude: 27.582,
            longitude: 84.502,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Shared Dorm", capacity: 1, price: 900, quantity: 30 },
              { name: "Twin Private", capacity: 2, price: 2500, quantity: 6 },
            ],
          },
        ],
      },
    ];

    // Add properties
    for (const destGroup of propertiesToAdd) {
      const dest = destinations.find((d: any) => d.slug === destGroup.destination);
      if (!dest) {
        console.warn(`Destination ${destGroup.destination} not found`);
        continue;
      }

      for (const prop of destGroup.properties) {
        try {
          const { data: propData, error: propError } = await supabase
            .from("properties")
            .insert([
              {
                host_id: hostId,
                destination_id: dest.id,
                name: prop.name,
                type: prop.type,
                description: prop.description,
                address: prop.address,
                region: dest.name,
                province: "Gandaki",
                latitude: prop.latitude,
                longitude: prop.longitude,
                amenities: prop.amenities,
                hero_image: "/placeholder.svg",
                gallery: [],
                cancellation_policy: "moderate",
                status: "active",
                is_verified: true,
              },
            ])
            .select()
            .single();

          if (propError) {
            console.error(`Error adding property ${prop.name}:`, propError);
            continue;
          }

          console.log(`Added property: ${prop.name}`);

          // Add rooms
          if (propData && prop.rooms.length > 0) {
            const { error: roomsError } = await supabase.from("room_types").insert(
              prop.rooms.map((room) => ({
                property_id: propData.id,
                name: room.name,
                capacity: room.capacity,
                price_per_night: room.price,
                quantity: room.quantity,
                description: `${room.name} at ${prop.name}`,
              }))
            );

            if (roomsError) {
              console.error(`Error adding rooms for ${prop.name}:`, roomsError);
            } else {
              console.log(`Added ${prop.rooms.length} rooms for ${prop.name}`);
            }
          }
        } catch (error) {
          console.error(`Error processing property ${prop.name}:`, error);
        }
      }
    }

    console.log("Property seeding completed!");
  } catch (error) {
    console.error("Error in seedProperties:", error);
  }
}
