"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "@/assets/pub2win-logo.png";
import Image from "next/image";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    role: "client",
    coins: 0,
    isInfluenceur: false,
    username_instagram: "",
    businessName: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: "",
    role: "",
    coins: "",
    isInfluenceur: "",
    username_instagram: "",
    businessName: ""
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value
    }));
  };

  const validateForm = () => {
    let newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: "",
      role: "",
      coins: "",
      isInfluenceur: "",
      username_instagram: "",
      businessName: ""
    };


    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    if (formData.role === 'client') {
      if (!formData.username_instagram) {
        newErrors.username_instagram = "Instagram username is required";
      }
    } else if (formData.role === 'commercant') {
      if (!formData.businessName) {
        newErrors.businessName = "Business name is required";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          coins: formData.coins,
          isInfluenceur: formData.isInfluenceur,
          username_instagram: formData.username_instagram,
          businessName: formData.businessName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the backend
        toast.error(data.message || "Signup failed. Please try again.");
        return;
      }

      // Handle successful signup
      toast.success("Signup successful! Please check your email to verify your account.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className={twMerge("min-h-screen bg-[#F0F0F0] py-10")} style={{ background: "radial-gradient(ellipse 200% 100% at bottom left, #00B8D2, #F0F0F0 100%)" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-[540px] mx-auto bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)] p-8">
          <div className="text-center mb-8">
            <Image src={logo} alt="Pub2Win Logo" width={120} height={40} />
            <h1 className="text-[#00B8D2] text-2xl font-bold mt-4">Create Your Account</h1>
            <p className="text-[#023047] text-sm">Join Pub2Win and start earning cashback today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-[#023047] mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={twMerge(
                    "w-full rounded-lg border border-gray-300 p-2 text-sm",
                    errors.firstName && "border-red-500"
                  )}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-[#023047] mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={twMerge(
                    "w-full rounded-lg border border-gray-300 p-2 text-sm",
                    errors.lastName && "border-red-500"
                  )}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#023047] mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={twMerge(
                  "w-full rounded-lg border border-gray-300 p-2 text-sm",
                  errors.email && "border-red-500"
                )}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#023047] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={twMerge(
                  "w-full rounded-lg border border-gray-300 p-2 text-sm",
                  errors.password && "border-red-500"
                )}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#023047] mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={twMerge(
                  "w-full rounded-lg border border-gray-300 p-2 text-sm",
                  errors.confirmPassword && "border-red-500"
                )}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-[#023047] mb-2"
              >
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className={twMerge(
                  "w-full rounded-lg border border-gray-300 p-2 text-sm",
                  errors.role && "border-red-500"
                )}
              >
                <option value="client">Client</option>
                <option value="commercant">Merchant</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            {formData.role === 'client' && (
              <>
                <div>
                  <label
                    htmlFor="username_instagram"
                    className="block text-sm font-medium text-[#023047] mb-2"
                  >
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    id="username_instagram"
                    name="username_instagram"
                    value={formData.username_instagram}
                    onChange={handleChange}
                    className={twMerge(
                      "w-full rounded-lg border border-gray-300 p-2 text-sm",
                      errors.username_instagram && "border-red-500"
                    )}
                    placeholder="yourusername"
                  />
                  {errors.username_instagram && (
                    <p className="text-red-500 text-xs mt-1">{errors.username_instagram}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="isInfluenceur"
                    className="block text-sm font-medium text-[#023047] mb-2"
                  >
                    Are you an influencer?
                  </label>
                  <select
                    id="isInfluenceur"
                    name="isInfluenceur"
                    value={formData.isInfluenceur ? "true" : "false"}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      isInfluenceur: e.target.value === "true"
                    }))}
                    className={twMerge(
                      "w-full rounded-lg border border-gray-300 p-2 text-sm",
                      errors.isInfluenceur && "border-red-500"
                    )}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  {errors.isInfluenceur && (
                    <p className="text-red-500 text-xs mt-1">{errors.isInfluenceur}</p>
                  )}
                </div>
              </>
            )}

            {formData.role === 'commercant' && (
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-[#023047] mb-2"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={twMerge(
                    "w-full rounded-lg border border-gray-300 p-2 text-sm",
                    errors.businessName && "border-red-500"
                  )}
                  placeholder="Your Business Name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 accent-[#00B8D2]"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-[#023047]">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-[#00B8D2] underline hover:text-[#023047]"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[#00B8D2] underline hover:text-[#023047]"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-[#00B8D2] py-3 font-medium text-white transition-colors hover:bg-[#023047]"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-[#023047]">
              Already have an account?{" "}
              <a href="/login" className="text-[#00B8D2] underline hover:text-[#023047]">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>

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