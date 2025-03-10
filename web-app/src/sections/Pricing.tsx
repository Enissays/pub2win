"use client";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Basic",
    monthlyPrice: 0,
    buttonText: "Join for free",
    popular: false,
    inverse: false,
    features: [
      "Access to basic cashback offers",
      "Limited promotions",
      "Basic support",
    ],
  },
  {
    title: "Premium",
    monthlyPrice: 9.99,
    buttonText: "Upgrade now",
    popular: true,
    inverse: true,
    features: [
      "Unlimited cashback offers",
      "Priority promotions",
      "Priority support",
      "Exclusive deals",
    ],
  },
  {
    title: "Business",
    monthlyPrice: 19.99,
    buttonText: "Upgrade now",
    popular: false,
    inverse: false,
    features: [
      "Unlimited cashback offers",
      "Priority promotions",
      "Dedicated account manager",
      "Advanced analytics",
      "Custom promotions",
      "API access",
      "Advanced security features",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-[#F0F0F0]">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title text-[#00B8D2]">Pricing</h2>
          <p className="section-des mt-5 text-[#023047]">
            Choose the plan that fits your needs and start earning cashback today.
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(({ title, monthlyPrice, buttonText, popular, features, inverse }) => (
            <div
              key={title}
              className={twMerge(
                "p-10 rounded-3xl border border-[#F1F1F1] shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full",
                inverse === true && "border-black bg-black text-white"
              )}
            >
              <div className="flex justify-between">
                <h3 className={twMerge("text-lg font-bold text-[#023047]", inverse && "text-white")}>
                  {title}
                </h3>
                {popular && (
                  <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                    <motion.span
                      animate={{
                        backgroundPositionX: "-100%",
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      }}
                      className="bg-[linear-gradient(to_right,#00B8D2,#023047)] [background-size:200%] text-transparent bg-clip-text font-medium"
                    >
                      Popular
                    </motion.span>
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-[30px]">
                <span className="text-4xl font-bold tracking-tighter leading-none">${monthlyPrice}</span>
                <span className="tracking-tight font-bold text-[#023047]">/month</span>
              </div>
              <button
                className={twMerge("btn btn-primary w-full mt-[30px]", inverse && "bg-white text-black")}
              >
                {buttonText}
              </button>
              <ul className="flex flex-col gap-5 mt-8">
                {features.map((feature) => (
                  <li key={feature} className="text-sm flex items-center gap-4">
                    <CheckIcon className="h-6 w-6" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};