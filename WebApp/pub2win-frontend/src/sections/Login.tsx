"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "@/assets/pub2win-logo.png";
import Image from "next/image";
import { User, ClientData, CommercantData } from "@/types"; // Import your type definitions

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.message || "Login failed. Please try again.");
        return;
      }
  
      // Transform the API response to match our User type
      const apiUser = data.user;
      
      if (apiUser.role === 'client') {
        // Create a properly typed client user
        const clientUser: User = {
          id: apiUser.id,
          email: apiUser.email,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          role: 'client',
          token: apiUser.token,
          clientData: {
            coins: apiUser.roleData?.coins || 0,
            isInfluencer: apiUser.roleData?.isInfluenceur || false,
            username_instagram: apiUser.roleData?.username_instagram || ''
          }
        };
        
        // Store the transformed user in localStorage
        localStorage.setItem("userData", JSON.stringify(clientUser));
      } else if (apiUser.role === 'commercant') {
        // Create a properly typed commercant user
        const commercantUser: User = {
          id: apiUser.id,
          email: apiUser.email,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          role: 'commercant',
          token: apiUser.token,
          commercantData: {
            businessName: apiUser.roleData?.businessName || '',
            coins: apiUser.roleData?.coins || 0,
            totalEarnings: 0, // Default value
            activePromotions: 0 // Default value
          }
        };
        
        // Store the transformed user in localStorage
        localStorage.setItem("userData", JSON.stringify(commercantUser));
      }
  
      toast.success("Login successful!");
  
      setTimeout(() => {
        router.push("/dashboard"); // Redirect to dashboard or appropriate page
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className={twMerge("min-h-screen bg-[#F0F0F0] py-10")} style={{ background: "radial-gradient(ellipse 200% 100% at bottom left, #00B8D2, #F0F0F0 100%)" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-[540px] mx-auto bg-white rounded-3xl shadow-[0_7px_14px_rgba(0,0,0,0.1)] p-8">
          <div className="text-center mb-8">
            <Image src={logo} alt="Pub2Win Logo" width={120} height={40} />
            <h1 className="text-[#00B8D2] text-2xl font-bold mt-4">Login to Your Account</h1>
            <p className="text-[#023047] text-sm">Welcome back! Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              className="w-full rounded-lg bg-[#00B8D2] py-3 font-medium text-white transition-colors hover:bg-[#023047]"
            >
              Login
            </button>

            <p className="text-center text-sm text-[#023047]">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#00B8D2] underline hover:text-[#023047]">
                Sign up
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