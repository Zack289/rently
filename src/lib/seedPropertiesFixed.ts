import { supabase } from "@/integrations/supabase/client";

type PropertyType = "hotel" | "guesthouse" | "homestay" | "resort" | "hostel";
type CancellationPolicy = "flexible" | "moderate" | "strict";

export async function seedProperties() {
  try {
    console.log("Starting property seeding...");

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

    // Check if properties already exist
    const { data: existingProps } = await supabase.from("properties").select("id").limit(1);
    if (existingProps && existingProps.length > 0) {
      console.log("Properties already exist, skipping seed");
      return;
    }

    // Properties to add - using first destination's host_id
    const propertiesToAdd: Array<{
      destination: string;
      properties: Array<{
        name: string;
        type: PropertyType;
        description: string;
        address: string;
        latitude: number;
        longitude: number;
        amenities: string[];
        rooms: Array<{ name: string; capacity: number; price: number; quantity: number }>;
        image: string;
      }>;
    }> = [
      // POKHARA
      {
        destination: "pokhara",
        properties: [
          {
            name: "Lakeside Dreams Resort",
            type: "resort" as PropertyType,
            description: "Modern resort with stunning lake views, infinity pool, and Himalayan backdrop.",
            address: "Lakeside Promenade 45",
            latitude: 28.2089,
            longitude: 83.987,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "pool"],
            rooms: [
              { name: "Deluxe Room", capacity: 2, price: 5500, quantity: 8 },
              { name: "Family Suite", capacity: 4, price: 9800, quantity: 4 },
            ],
            image: "/property-1.jpg",
          },
          {
            name: "Mountain Gate Guesthouse",
            type: "guesthouse" as PropertyType,
            description: "Budget-friendly guesthouse with cozy rooms and rooftop restaurant.",
            address: "Bindabasini Road 12",
            latitude: 28.212,
            longitude: 83.979,
            amenities: ["wifi", "breakfast", "parking"],
            rooms: [
              { name: "Basic Room", capacity: 2, price: 2200, quantity: 10 },
              { name: "Private Ensuite", capacity: 2, price: 3500, quantity: 6 },
            ],
            image: "/property-2.jpg",
          },
          {
            name: "Sarangkot View Hotel",
            type: "hotel" as PropertyType,
            description: "Located on Sarangkot hill with 360-degree views of Annapurna range.",
            address: "Sarangkot 1",
            latitude: 28.23,
            longitude: 83.965,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv"],
            rooms: [
              { name: "Standard Room", capacity: 2, price: 4200, quantity: 12 },
              { name: "Premium Suite", capacity: 3, price: 7900, quantity: 5 },
            ],
            image: "/dest-pokhara.jpg",
          },
          {
            name: "Peace Retreat Homestay",
            type: "homestay" as PropertyType,
            description: "Authentic Nepali homestay with warm family hospitality.",
            address: "Dhampus Village 8",
            latitude: 28.195,
            longitude: 83.895,
            amenities: ["wifi", "breakfast", "parking"],
            rooms: [
              { name: "Cozy Room", capacity: 2, price: 2800, quantity: 6 },
              { name: "Family Room", capacity: 4, price: 4800, quantity: 3 },
            ],
            image: "/property-3.jpg",
          },
          {
            name: "Lakefront Luxury Residences",
            type: "hotel" as PropertyType,
            description: "Premium 5-star hotel with personalized concierge and spa services.",
            address: "Fewa Lake Edge 99",
            latitude: 28.21,
            longitude: 83.989,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "spa", "pool"],
            rooms: [
              { name: "Executive Room", capacity: 2, price: 15500, quantity: 10 },
              { name: "Presidential Suite", capacity: 4, price: 28000, quantity: 2 },
            ],
            image: "/property-1.jpg",
          },
        ],
      },
      // BANDIPUR
      {
        destination: "bandipur",
        properties: [
          {
            name: "Heritage Inn Bandipur",
            type: "hotel" as PropertyType,
            description: "Restored Newari mansion hotel blending traditional architecture with modern comfort.",
            address: "Bandipur Bazaar Main Street",
            latitude: 27.939,
            longitude: 84.414,
            amenities: ["wifi", "breakfast", "parking"],
            rooms: [
              { name: "Heritage Room", capacity: 2, price: 4500, quantity: 8 },
              { name: "Deluxe Heritage", capacity: 2, price: 7200, quantity: 4 },
            ],
            image: "/dest-bandipur.jpg",
          },
          {
            name: "Bandipur Mountain Lodge",
            type: "guesthouse" as PropertyType,
            description: "Cozy mountain lodge with nature walks and bird watching.",
            address: "Thani Mai Hill Road",
            latitude: 27.93,
            longitude: 84.405,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Standard Room", capacity: 2, price: 2600, quantity: 10 },
              { name: "Superior Room", capacity: 2, price: 4200, quantity: 5 },
            ],
            image: "/property-2.jpg",
          },
          {
            name: "Siddhartha Homestay",
            type: "homestay" as PropertyType,
            description: "Family-run homestay with authentic Newari hospitality.",
            address: "Bandipur Old Town 34",
            latitude: 27.94,
            longitude: 84.413,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Cozy Double", capacity: 2, price: 2400, quantity: 6 },
              { name: "Family Room", capacity: 4, price: 3900, quantity: 3 },
            ],
            image: "/property-3.jpg",
          },
          {
            name: "Bandipur Premium Resort",
            type: "resort" as PropertyType,
            description: "Modern resort with spa and wellness center.",
            address: "Resort Road, Bandipur 1",
            latitude: 27.945,
            longitude: 84.42,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "spa", "pool"],
            rooms: [
              { name: "Spa Suite", capacity: 2, price: 9500, quantity: 6 },
              { name: "Resort Villa", capacity: 4, price: 14000, quantity: 3 },
            ],
            image: "/dest-bandipur.jpg",
          },
        ],
      },
      // CHITWAN
      {
        destination: "chitwan",
        properties: [
          {
            name: "Safari Lodge Chitwan",
            type: "resort" as PropertyType,
            description: "Classic safari lodge with experienced jungle guides and daily activities.",
            address: "Sauraha Main Street",
            latitude: 27.58,
            longitude: 84.495,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv"],
            rooms: [
              { name: "Jungle Room", capacity: 2, price: 6500, quantity: 12 },
              { name: "Safari Suite", capacity: 2, price: 11500, quantity: 4 },
            ],
            image: "/dest-chitwan.jpg",
          },
          {
            name: "Jungle Night Guesthouse",
            type: "guesthouse" as PropertyType,
            description: "Budget-friendly guesthouse perfect for backpackers.",
            address: "Sauraha 5",
            latitude: 27.585,
            longitude: 84.5,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Dorm Bed", capacity: 1, price: 1200, quantity: 20 },
              { name: "Private Room", capacity: 2, price: 3000, quantity: 8 },
            ],
            image: "/property-2.jpg",
          },
          {
            name: "Tiger View Hotel",
            type: "hotel" as PropertyType,
            description: "Mid-range hotel with excellent wildlife guides and organized safaris.",
            address: "Sauraha 12",
            latitude: 27.578,
            longitude: 84.492,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv"],
            rooms: [
              { name: "Standard Room", capacity: 2, price: 3800, quantity: 15 },
              { name: "Deluxe Room", capacity: 3, price: 6500, quantity: 7 },
            ],
            image: "/property-1.jpg",
          },
          {
            name: "Chitwan Riverside Resort",
            type: "resort" as PropertyType,
            description: "Luxury riverside resort with infinity pool overlooking the Rapti River.",
            address: "Rapti Riverside, Sauraha 1",
            latitude: 27.575,
            longitude: 84.49,
            amenities: ["wifi", "breakfast", "parking", "ac", "tv", "spa", "pool"],
            rooms: [
              { name: "River Suite", capacity: 2, price: 12800, quantity: 8 },
              { name: "Premium Villa", capacity: 4, price: 19500, quantity: 4 },
            ],
            image: "/dest-chitwan.jpg",
          },
          {
            name: "Budget Tiger Hostel",
            type: "hostel" as PropertyType,
            description: "Social hostel with safari packages and great vibes.",
            address: "Sauraha Bazaar 3",
            latitude: 27.582,
            longitude: 84.502,
            amenities: ["wifi", "breakfast"],
            rooms: [
              { name: "Shared Dorm", capacity: 1, price: 900, quantity: 30 },
              { name: "Twin Private", capacity: 2, price: 2500, quantity: 6 },
            ],
            image: "/property-3.jpg",
          },
        ],
      },
    ];

    // Get the first user to use as host (or create a guest insertion without host_id)
    const { data: userData } = await supabase.auth.getSession();
    let hostId = userData?.session?.user?.id;

    // If no logged-in user, get any user from profiles
    if (!hostId) {
      const { data: users } = await supabase.from("profiles").select("id").limit(1);
      if (users && users.length > 0) {
        hostId = users[0].id;
      }
    }

    if (!hostId) {
      console.error("No host ID found");
      return;
    }

    console.log("Using host ID:", hostId);

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
                hero_image: prop.image || "/placeholder.svg",
                gallery: [],
                cancellation_policy: "moderate" as CancellationPolicy,
                status: "active",
                is_verified: true,
              } as any,
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
