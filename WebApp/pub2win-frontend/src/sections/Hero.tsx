"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import pub2winImage from "@/assets/pub2win-hero.png";
import secondImage from "@/assets/second-image.png";
import thirdImage from "@/assets/third-image.png";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    { src: pub2winImage.src, alt: "Pub2Win Hero" },
    { src: secondImage.src, alt: "Second Image" },
    { src: thirdImage.src, alt: "Third Image" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

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
              <Link href="/signup">
                <button className="bg-[#00B8D2] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-[#023047]">
                  Join us
                </button>
              </Link>
              <Link href="/about">
                <button className="text-[#023047] hover:text-[#023047] flex gap-1">
                  <span>Learn more</span>
                  <ArrowIcon className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={images[currentSlide].src}
                alt={images[currentSlide].alt}
                className="md:absolute md:h-full md:w-auto md:max-w-none md:left-60 lg:left-120" 
                style={{ translateY }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};