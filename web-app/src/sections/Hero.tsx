"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import pub2winImage from "@/assets/pub2win-hero.png"; // Update the hero image path
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 overflow-x-clip"
      style={{ background: "radial-gradient(ellipse 200% 100% at bottom left, #00B8D2, #F0F0F0 100%)" }}
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="text-sm inline-flex border border-[#00B8D2]/10 px-3 py-1 rounded-lg tracking-tight">
              Earn cashback with Pub2Win
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-[#00B8D2] to-[#023047] text-transparent bg-clip-text mt-6">
              Promote your business and earn cashback
            </h1>
            <p className="text-xl text-[#023047] tracking-tight mt-6">
              Join Pub2Win to promote your favorite restaurants and bars on Instagram and earn cashback for every visit.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <button className="bg-[#00B8D2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-[#023047]">
                Join for free
              </button>
              <button className="text-[#00B8D2] hover:text-[#023047] flex gap-1">
                <span>Learn more</span>
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src={pub2winImage.src}
              alt="Pub2Win Hero"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};