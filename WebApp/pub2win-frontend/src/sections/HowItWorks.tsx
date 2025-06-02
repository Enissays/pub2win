"use client";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import logo from "@/assets/pub2win-logo.png";

export default function HowItWorks() {
  return (
    <div>
      
      <main className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <section className="text-center mb-16">
          <Image src={logo} alt="Pub2Win Logo" width={120} height={40} className="mx-auto mb-4" />
          <h1 className="text-[#00B8D2] text-4xl md:text-5xl font-bold mb-4">
            How Pub2Win Works
          </h1>
          <p className="text-[#023047] text-lg md:text-xl max-w-2xl mx-auto">
            Pub2Win connects local businesses with everyday consumers through authentic social media promotion. Here's how it works:
          </p>
        </section>

        {/* For Businesses Section */}
        <section className="mb-16">
          <h2 className="text-[#00B8D2] text-3xl font-bold text-center mb-8">
            For Businesses
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Create an Account
                </h3>
                <p className="text-[#023047] text-base">
                  Sign up as a business owner and complete your profile with details about your restaurant or bar.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 18H21V20H3V18ZM3 13H21V15H3V13ZM3 8H21V10H3V8Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Create Promotions
                </h3>
                <p className="text-[#023047] text-base">
                  Design attractive promotion offers that customers can redeem by sharing your business on Instagram.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM11 9H13V11H11V9ZM11 13H13V15H11V13ZM11 17H13V19H11V17Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Attract Customers
                </h3>
                <p className="text-[#023047] text-base">
                  Micro-influencers will promote your offers through authentic Instagram stories, driving new customers to your business.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16C8.4695 16 8 15.5305 8 15V11C8 10.4695 8.4695 10 9 10H15C15.5305 10 16 10.4695 16 11V15C16 15.5305 15.5305 16 15 16H9Z" fill="#00B8D2" />
                    <path d="M19 19H15V17H19V19ZM19 13H15V11H19V13ZM19 7H15V5H19V7ZM5 19H1V17H5V19ZM5 13H1V11H5V13ZM5 7H1V5H5V7Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Track Performance
                </h3>
                <p className="text-[#023047] text-base">
                  Monitor the success of your promotions through our dashboard and analyze customer engagement metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Influencers Section */}
        <section className="mb-16">
          <h2 className="text-[#00B8D2] text-3xl font-bold text-center mb-8">
            For Influencers
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 11H11V9H13V11Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Create an Account
                </h3>
                <p className="text-[#023047] text-base">
                  Sign up as an influencer and complete your profile with details about your social media presence.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8C4 6.31658 5.31658 5 7 5H17C18.6834 5 20 6.31658 20 8V16C20 17.6834 18.6834 19 17 19H7C5.31658 19 4 17.6834 4 16V8Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Browse Offers
                </h3>
                <p className="text-[#023047] text-base">
                  Discover promotion offers from local businesses that match your interests and audience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5C20.5523 5 21 5.44772 21 6V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V6C3 5.44772 3.44772 5 4 5H20ZM19 7H5V18H19V7Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Create Content
                </h3>
                <p className="text-[#023047] text-base">
                  Share authentic experiences at participating businesses through Instagram stories.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
                {/* <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-[#00B8D2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM11 9H13V11H11V9ZM11 13H13V15H11V13ZM11 17H13V19H11V17Z" fill="#00B8D2" />
                  </svg>
                </div> */}
                <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                  Earn Rewards
                </h3>
                <p className="text-[#023047] text-base">
                  Get paid for your promotions and build your influence in the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Representation Section */}
        <section className="mb-16 text-center">
          <h2 className="text-[#00B8D2] text-3xl font-bold mb-8">
            How It All Connects
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-8">
              <p className="text-[#023047]">Process diagram will be displayed here</p>
            </div>
            <p className="text-[#023047] text-lg">
              Pub2Win creates a win-win ecosystem where businesses gain visibility and influencers earn rewards for sharing authentic experiences.
            </p>
          </div>
        </section>
      </main>
      
    </div>
  );
}