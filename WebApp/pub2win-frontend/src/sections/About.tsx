"use client";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import logo from "@/assets/pub2win-logo.png";

// Team member data
const teamMembers = [
  {
    name: "Othman MEKOUAR",
    role: "Founder & CEO",
    image: "/team/othman-mekouar.jpg",
  },
  {
    name: "Salah-eddine SLAOUI",
    role: "Web Developer",
    image: "/team/Slaoui-salaheddine.jpg",
  },
  {
    name: "Aymane EL-GHOUALI",
    role: "Lead Developer",
    image: "/team/Aymane-EL-GHOUALI.jpg",
  },
  
];

export default function About() {
  return (
    <div>
      
      <main className="container mx-auto px-4 py-10" >
        {/* Introduction Section */}
        <section className="text-center mb-16" >
          <Image src={logo} alt="Pub2Win Logo" width={120} height={40} className="mx-auto mb-4" />
          <h1 className="text-[#00B8D2] text-4xl md:text-5xl font-bold mb-4">
            About Pub2Win
          </h1>
          <p className="text-[#023047] text-lg md:text-xl max-w-2xl mx-auto">
            Pub2Win is revolutionizing the way businesses and everyday consumers connect through authentic social media promotion. Discover how we're creating a win-win ecosystem for everyone.
          </p>
        </section>

        {/* Mission and Vision Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">
                Our Mission
              </h2>
              <p className="text-[#023047] text-base">
                At Pub2Win, our mission is to create meaningful connections between local businesses and everyday consumers through authentic social media promotion. We believe that everyone should have the opportunity to earn rewards for activities they already enjoy, while helping businesses reach new audiences.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
              <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">
                Our Vision
              </h2>
              <p className="text-[#023047] text-base">
                Our vision is to become the leading platform for micro-influencer marketing, empowering small and medium businesses to grow their presence and revenue through authentic, community-driven promotions. We aim to create a win-win ecosystem where businesses thrive and consumers are rewarded.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16 text-center">
          <h2 className="text-[#00B8D2] text-3xl font-bold mb-8">
            How Pub2Win Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* For Businesses */}
            <div className="p-8 bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
              <div className="mb-4">
                <Image
                  src="/business-icon.svg"
                  alt="Business Icon"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                For Businesses
              </h3>
              <p className="text-[#023047] text-base">
                Promote your restaurant or bar through authentic social media stories created by real customers. Reach new audiences and drive sales with minimal investment.
              </p>
            </div>

            {/* For Influencers */}
            <div className="p-8 bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
              <div className="mb-4">
                <Image
                  src="/influencer-icon.svg"
                  alt="Influencer Icon"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <h3 className="text-[#00B8D2] text-xl font-bold mb-4">
                For Influencers
              </h3>
              <p className="text-[#023047] text-base">
                Get paid to share your authentic experiences at restaurants and bars. Turn your social media presence into a revenue stream with minimal follower requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-[#00B8D2] text-3xl font-bold text-center mb-8">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)] p-8 text-center"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-[#00B8D2] text-xl font-bold mb-2">
                  {member.name}
                </h3>
                <p className="text-[#023047] text-base">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
    </div>
  );
}