"use client";
import Image from "next/image";
import pyramidImage from "@/assets/pyramid.png";
import tubeImage from "@/assets/pub2win-tube.png";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#F0F0F0] to-[#00B8D2] py-24 overflow-x-clip">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">Promote and earn cashback</div>
          </div>

          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-[#00B8D2] to-[#023047] text-transparent bg-clip-text mt-5">
            A more effective way to promote and earn
          </h2>
          <p className="section-des mt-5 text-[#023047]">
            Effortlessly promote your favorite restaurants and bars on Instagram and earn cashback for every visit.
          </p>
        </div>

        <div className="relative">
          {/* Updated video source */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="mt-10 w-full max-w-[540px] mx-auto rounded-lg shadow-lg"
          >
            <source src="/videos/pub2win-product-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Optimized Next.js images */}
          <motion.div
            className="hidden md:block absolute -right-36 -top-32"
            style={{ translateY: translateY }}
          >
            <Image src={pyramidImage} alt="Pyramid image" height={262} width={262} />
          </motion.div>

          <motion.div
            className="hidden md:block absolute bottom-24 -left-36"
            style={{ translateY: translateY }}
          >
            <Image src={tubeImage} alt="Tube image" height={248} width={248} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
