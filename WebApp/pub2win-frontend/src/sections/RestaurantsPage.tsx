"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

// Sample data for restaurants and bars
const establishments = [
  {
    id: 1,
    name: "The Cozy Corner",
    type: "Restaurant",
    location: "Downtown",
    rating: 4.5,
    image: "/restaurants/cozy-corner.jpg",
    description: "A charming neighborhood spot with authentic local cuisine.",
    winCoins: 2,
    minSpend: 20,
  },
  {
    id: 2,
    name: "Bistro 54",
    type: "Restaurant",
    location: "City Center",
    rating: 4.8,
    image: "/restaurants/bistro-54.jpg",
    description: "Fine dining experience with seasonal ingredients.",
    winCoins: 3,
    minSpend: 30,
  },
  {
    id: 3,
    name: "The Pub House",
    type: "Bar",
    location: "Old Town",
    rating: 4.3,
    image: "/restaurants/pub-house.jpg",
    description: "A classic pub with craft beers and pub food.",
    winCoins: 1,
    minSpend: 15,
  },
  {
    id: 4,
    name: "Mediterranean Grill",
    type: "Restaurant",
    location: "Harbor District",
    rating: 4.7,
    image: "/restaurants/mediterranean-grill.jpg",
    description: "Fresh seafood and Mediterranean specialties.",
    winCoins: 3,
    minSpend: 25,
  },
  {
    id: 5,
    name: "The Rooftop Lounge",
    type: "Bar",
    location: "Downtown",
    rating: 4.6,
    image: "/restaurants/rooftop-lounge.jpg",
    description: "Stylish rooftop bar with city views.",
    winCoins: 2,
    minSpend: 20,
  },
];

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Filter establishments based on search and type
  const filteredEstablishments = establishments.filter(establishment => {
    const matchesSearch = establishment.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All" || establishment.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      
      <main className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <section className="mb-8">
          <h1 className="text-[#00B8D2] text-4xl font-bold mb-4">
            Partner Restaurants & Bars
          </h1>
          <p className="text-[#023047] text-lg max-w-2xl">
            Discover our partner establishments where you can earn WinCoins by sharing your experiences on Instagram.
          </p>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex w-full md:w-auto">
            <input
              type="text"
              placeholder="Search establishments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
            >
              <option value="All">All Types</option>
              <option value="Restaurant">Restaurants</option>
              <option value="Bar">Bars</option>
            </select>
          </div>
        </section>

        {/* Establishments Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEstablishments.map(establishment => (
            <div
              key={establishment.id}
              className="bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={establishment.image}
                  alt={`${establishment.name} image`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                />
                <div className="absolute top-3 right-3 bg-white rounded-full p-2">
                  <span className="text-sm font-bold text-[#023047]">
                    {establishment.rating} ⭐
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-[#00B8D2] text-xl font-bold mb-2">
                  {establishment.name}
                </h3>
                <p className="text-[#023047] text-base mb-2">
                  {establishment.type}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  {establishment.location}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {establishment.description}
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#00B8D2] font-medium">
                      Earn {establishment.winCoins} WinCoins
                    </span>
                  </div>
                  <div>
                    <span className="text-[#023047] text-sm">
                      Min. Spend: ${establishment.minSpend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination (if needed) */}
        {establishments.length > 6 && (
          <section className="mt-8 flex justify-center">
            <nav>
              <ul className="flex list-style-none">
                <li className="mr-2">
                  <button className="px-3 py-1 rounded-lg bg-[#F0F0F0] text-[#023047]">
                    1
                  </button>
                </li>
                <li className="mr-2">
                  <button className="px-3 py-1 rounded-lg bg-[#F0F0F0] text-[#023047]">
                    2
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 rounded-lg bg-[#F0F0F0] text-[#023047]">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </section>
        )}
      </main>
      
    </div>
  );
}