"use client";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import logo from "@/assets/pub2win-logo.png";

export default function Terms() {
  return (
    <div>
      
      <main className="container mx-auto px-4 py-10">
        <section className="mb-16">
          <div className="text-center mb-8">
            <Image src={logo} alt="Pub2Win Logo" width={120} height={40} className="mx-auto" />
            <h1 className="text-[#00B8D2] text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-[#023047] text-lg">Last updated: September 1, 2023</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-[#023047] mb-6">
              Welcome to Pub2Win ("Service"). These Terms of Service ("Terms") govern your access to and use of our website located at [your-domain.com] (the "Site") and any related services provided by Pub2Win.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">2. Acceptance of Terms</h2>
            <p className="text-[#023047] mb-6">
              By accessing or using the Site or Service, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not access or use the Site or Service.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">3. Eligibility</h2>
            <p className="text-[#023047] mb-6">
              You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant that you are of legal age to form a binding contract.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">4. User Accounts</h2>
            <p className="text-[#023047] mb-6">
              To access certain features of the Service, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">5. User Conduct</h2>
            <p className="text-[#023047] mb-6">
              You agree not to use the Service for any illegal or unauthorized purpose. You shall not engage in any activities that could damage, disrupt, or impair the Service or the rights of other users.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="text-[#023047] mb-6">
              All content on the Site, including but not limited to text, graphics, logos, and images, is the property of Pub2Win or its content suppliers and is protected by international copyright laws.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">7. Privacy Policy</h2>
            <p className="text-[#023047] mb-6">
              Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you consent to the practices described in our Privacy Policy.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-[#023047] mb-6">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. Pub2Win does not warrant that the Service will be uninterrupted, timely, secure, or error-free.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">9. Limitation of Liability</h2>
            <p className="text-[#023047] mb-6">
              In no event shall Pub2Win be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use or performance of the Service.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">10. Indemnification</h2>
            <p className="text-[#023047] mb-6">
              You agree to indemnify and hold harmless Pub2Win and its affiliates from and against any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">11. Termination</h2>
            <p className="text-[#023047] mb-6">
              Pub2Win reserves the right to terminate or suspend your access to the Service at any time, with or without cause.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="text-[#023047] mb-6">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">13. Disputes Resolution</h2>
            <p className="text-[#023047] mb-6">
              Any dispute arising out of or related to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Body].
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">14. Changes to Terms</h2>
            <p className="text-[#023047] mb-6">
              Pub2Win reserves the right to modify these Terms at any time. Changes will be effective upon posting on the Site. Your continued use of the Service after such changes constitutes your acceptance of the modified Terms.
            </p>

            <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">15. Contact Information</h2>
            <p className="text-[#023047] mb-6">
              If you have any questions about these Terms, please contact us at:
              <br />
              <br />
              <strong>Email:</strong> info@esisa.ac.ma
              <br />
              <strong>Address:</strong> 29 bis avenue Ibn Khatib, route D'imouzzer, Fès 30050
            </p>
          </div>
        </section>
      </main>
      
    </div>
  );
}