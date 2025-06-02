"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import Image from "next/image";

const influencers = [
  {
    id: 1,
    name: "Sarah Johnson",
    followers: "2.4K",
    niche: "Food & Lifestyle",
    location: "New York",
    rating: 4.8,
    image: "/influencers/sarah-johnson.jpg",
    description: "Foodie exploring the best restaurants in NYC. Sharing authentic dining experiences.",
    engagementRate: "6.2%",
  },
  {
    id: 2,
    name: "Michael Chen",
    followers: "3.7K",
    niche: "Travel & Food",
    location: "San Francisco",
    rating: 4.6,
    image: "/influencers/michael-chen.jpg",
    description: "Traveling the world and discovering amazing local cuisines.",
    engagementRate: "5.8%",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    followers: "1.8K",
    niche: "Local Eats",
    location: "Chicago",
    rating: 4.7,
    image: "/influencers/emily-rodriguez.jpg",
    description: "Highlighting hidden gem restaurants in Chicago.",
    engagementRate: "7.1%",
  },
  {
    id: 4,
    name: "David Park",
    followers: "2.9K",
    niche: "Cocktails & Nightlife",
    location: "Los Angeles",
    rating: 4.5,
    image: "/influencers/david-park.jpg",
    description: "Bartender by day, bar reviewer by night.",
    engagementRate: "5.3%",
  },
  {
    id: 5,
    name: "Jessica Lee",
    followers: "4.1K",
    niche: "Food Photography",
    location: "Miami",
    rating: 4.9,
    image: "/influencers/jessica-lee.jpg",
    description: "Creating visually stunning food content for brands.",
    engagementRate: "6.7%",
  },
];

export default function InfluencersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("All");

  // Filter influencers based on search and niche
  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesNiche =
      selectedNiche === "All" || influencer.niche === selectedNiche;
    return matchesSearch && matchesNiche;
  });

  return (
    <div>
      
      <main className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <section className="mb-8">
          <h1 className="text-[#00B8D2] text-4xl font-bold mb-4">
            Our Influencer Community
          </h1>
          <p className="text-[#023047] text-lg max-w-2xl">
            Discover and connect with micro-influencers who can help promote your business through authentic social media content.
          </p>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex w-full md:w-auto">
            <input
              type="text"
              placeholder="Search influencers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
            >
              <option value="All">All Niches</option>
              <option value="Food & Lifestyle">Food & Lifestyle</option>
              <option value="Travel & Food">Travel & Food</option>
              <option value="Local Eats">Local Eats</option>
              <option value="Cocktails & Nightlife">Cocktails & Nightlife</option>
              <option value="Food Photography">Food Photography</option>
            </select>
          </div>
        </section>

        {/* Influencers Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInfluencers.map(influencer => (
            <div
              key={influencer.id}
              className="bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={influencer.image}
                  alt={`${influencer.name} profile image`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                />
                <div className="absolute top-3 right-3 bg-white rounded-full p-2">
                  <span className="text-sm font-bold text-[#023047]">
                    {influencer.rating} ⭐
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-[#00B8D2] text-xl font-bold mb-2">
                  {influencer.name}
                </h3>
                <p className="text-[#023047] text-base mb-2">
                  {influencer.niche}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  {influencer.location}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {influencer.description}
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#00B8D2] font-medium">
                      Followers: {influencer.followers}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#023047] text-sm">
                      Engagement Rate: {influencer.engagementRate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* How to Work With Influencers Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-[#00B8D2] text-3xl font-bold text-center mb-8">
            How to Work With Influencers
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Browse Profiles
                </h3>
                <p className="text-[#023047] text-base">
                  Search through our network of micro-influencers to find the perfect match for your brand.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                <div className="mb-4">
                </div>
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Create a Campaign
                </h3>
                <p className="text-[#023047] text-base">
                  Design your promotion campaign with specific requirements and compensation details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Connect with Influencers
                </h3>
                <p className="text-[#023047] text-base">
                  Send collaboration requests directly to influencers who match your campaign criteria.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Track Performance
                </h3>
                <p className="text-[#023047] text-base">
                  Monitor campaign performance and engagement metrics through our dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pagination (if needed) */}
        {influencers.length > 6 && (
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