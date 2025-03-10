import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/pub2win-logo.png"; // Update the logo path
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-[#023047] text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">Promote your business and earn cashback with Pub2Win</p>
        <div className="inline-flex gap-1 items-center">
          <p className="text-[#00B8D2]">Join for free</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center text-[#00B8D2]" />
        </div>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Image src={Logo} alt="Pub2Win logo" height={80} width={80} />
            <MenuIcon className="h-5 w-5 md:hidden" />
            <nav className="hidden md:flex gap-6 text-[#023047] items-center">
              <a href="/about" className="hover:text-[#00B8D2]">About</a>
              <a href="/how-it-works" className="hover:text-[#00B8D2]">How It Works</a>
              <a href="/restaurants" className="hover:text-[#00B8D2]">Restaurants & Bars</a>
              <a href="/influencers" className="hover:text-[#00B8D2]">Influencers</a>
              <a href="/contact" className="hover:text-[#00B8D2]">Contact</a>
              <button className="bg-[#00B8D2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-[#023047]">
                Join for free
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};