"use client";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Pub2Win has revolutionized how I promote my favorite local businesses and earn cashback at the same time.",
    imageSrc: avatar1.src,
    name: "Emily Johnson",
    username: "@emilyj",
  },
  {
    text: "I've been using Pub2Win for a few months now, and it's amazing how easy it is to earn cashback just by sharing my experiences on Instagram.",
    imageSrc: avatar2.src,
    name: "Michael Brown",
    username: "@michaelb",
  },
  {
    text: "As a frequent visitor to local restaurants and bars, Pub2Win is the perfect app for me to get rewarded for my spending.",
    imageSrc: avatar3.src,
    name: "Sarah Lee",
    username: "@sarahlee",
  },
  {
    text: "Pub2Win has made it incredibly simple for me to support local businesses and get cashback in return. It's a win-win situation!",
    imageSrc: avatar4.src,
    name: "David Kim",
    username: "@davidkim",
  },
  {
    text: "I love how Pub2Win allows me to discover new places and earn cashback for my visits. It's a great way to explore and save money.",
    imageSrc: avatar5.src,
    name: "Jessica Park",
    username: "@jessicap",
  },
  {
    text: "Pub2Win is a fantastic app for anyone who loves trying out new restaurants and bars. Plus, earning cashback is just a bonus!",
    imageSrc: avatar6.src,
    name: "Chris Lee",
    username: "@chrislee",
  },
  {
    text: "I've been using Pub2Win for a while now, and it's been a great way to support local businesses while also earning some extra cash.",
    imageSrc: avatar7.src,
    name: "Alex Kim",
    username: "@alexkim",
  },
  {
    text: "Pub2Win is the perfect app for food and drink enthusiasts. It's easy to use and offers great cashback rewards.",
    imageSrc: avatar8.src,
    name: "Sophia Lee",
    username: "@sophiale",
  },
  {
    text: "I highly recommend Pub2Win to anyone looking to support local businesses and earn cashback. It's a great app with a user-friendly interface.",
    imageSrc: avatar9.src,
    name: "Daniel Park",
    username: "@danielp",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, imageSrc, name, username }) => (
                <div className="card" key={username}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <Image
                      width={40}
                      height={40}
                      src={imageSrc}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 tracking-tight">{username}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section className="bg-[#F0F0F0]">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>

          <h2 className="section-title mt-5 text-[#00B8D2]">What our users say</h2>
          <p className="section-des mt-5 text-[#023047]">
            Discover how Pub2Win helps users earn cashback while promoting their favorite local businesses.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};