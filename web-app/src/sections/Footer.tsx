import logo from "@/assets/pub2win-logo.png"; // Update the logo path
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";
import Image from "next/image";

export const Footer = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#023047] text-white text-sm py-10 text-center">
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#00B8D2,#023047)] before:absolute">
          <Image src={logo} alt="Pub2Win logo" height={40} className="relative" />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="/about">About</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/restaurants">Restaurants & Bars</a>
          <a href="/influencers">Influencers</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
        </nav>

        <div className="flex justify-center gap-6 mt-6">
          <SocialX />
          <SocialInsta />
          <SocialLinkedin />
          <SocialPin />
          <SocialYoutube />
        </div>
        <p className="mt-6">&copy; {currentYear} Pub2Win. All rights reserved.</p>
      </div>
    </footer>
  );
};