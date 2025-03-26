"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import logo from "@/assets/pub2win-logo.png";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to your backend
      // For demonstration purposes, we'll just show a success toast
      toast.success("Your message has been sent successfully!");
      setTimeout(() => {
        // Reset form after 2 seconds
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      
      <main className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <section className="text-center mb-16">
          <Image src={logo} alt="Pub2Win Logo" width={120} height={40} className="mx-auto mb-4" />
          <h1 className="text-[#00B8D2] text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-[#023047] text-lg md:text-xl max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions, feedback, or want to collaborate, feel free to reach out using the form below or through our social media channels.
          </p>
        </section>

        {/* Contact Form Section */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-[#00B8D2] text-2xl font-bold mb-8 text-center">
              Get in Touch
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#023047] mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#023047] mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-[#023047] mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
                  placeholder="Your inquiry subject"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#023047] mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#00B8D2] focus:ring-[#00B8D2]"
                  rows={4}
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#00B8D2] py-3 font-medium text-white transition-colors hover:bg-[#023047] disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="mb-16 text-center">
          <h2 className="text-[#00B8D2] text-2xl font-bold mb-8">
            Contact Information
          </h2>
          <div className="max-w-xl mx-auto">
            <p className="text-[#023047] text-base mb-4">
              <span className="font-bold">Email:</span> info@esisa.ac.ma
            </p>
            <p className="text-[#023047] text-base mb-4">
              <span className="font-bold">Phone:</span> +212 5356-57095
            </p>
            <p className="text-[#023047] text-base mb-4">
              <span className="font-bold">Address:</span> 29 bis avenue Ibn Khatib, route D'imouzzer, Fès 30050
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <a
                href="https://facebook.com/pub2win"
                className="text-[#00B8D2] hover:text-[#023047]"
              >
                <span className="sr-only">Facebook</span>
                {/* Facebook icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/pub2win"
                className="text-[#00B8D2] hover:text-[#023047]"
              >
                <span className="sr-only">Twitter</span>
                {/* Twitter icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="mb-16">
          <h2 className="text-[#00B8D2] text-2xl font-bold text-center mb-4">
            Visit Our Office
          </h2>
          <div className="h-96 rounded-lg overflow-hidden">
            {/* Google Maps Embed */}
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&q=34.025111,-4.9953721`}
            ></iframe>
          </div>
        </section>
      </main>
      
      
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}