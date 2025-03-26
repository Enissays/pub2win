'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/types";
import { Role } from "@/types";

export default function Dashboard() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Check token expiry
        const token = parsedUser.token;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000;

        if (Date.now() > expirationTime) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("userData");
          router.push("/login");
          return;
        }

        // Transform the API response format to match our User type
        const transformedUser: User = {
          id: parsedUser.id,
          email: parsedUser.email,
          firstName: parsedUser.firstName,
          lastName: parsedUser.lastName,
          role: parsedUser.role as "client" | "commercant",
          token: parsedUser.token,
          ...(parsedUser.role === "client"
            ? {
                clientData: {
                  coins: parsedUser.clientData?.coins ?? 0,
                  isInfluencer: parsedUser.clientData?.isInfluencer ?? false,
                  username_instagram: parsedUser.clientData?.username_instagram ?? "",
                },
              }
            : {
                commercantData: {
                  businessName: parsedUser.commercantData?.businessName ?? "",
                  coins: parsedUser.commercantData?.coins ?? 0,
                  totalEarnings: parsedUser.commercantData?.totalEarnings ?? 0,
                  activePromotions: parsedUser.commercantData?.activePromotions ?? 0,
                },
              }),
        };

        setUserData(transformedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Error loading user data");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  // Real-time updates for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
  
          // Ensure all required fields are present when updating userData
          setUserData((prevUserData) => {
            if (!prevUserData) {
              return {
                id: parsedUser.id,
                email: parsedUser.email,
                firstName: parsedUser.firstName,
                lastName: parsedUser.lastName,
                role: parsedUser.role as Role,
                token: parsedUser.token,
                ...(parsedUser.role === "client"
                  ? { clientData: parsedUser.clientData }
                  : {}),
                ...(parsedUser.role === "commercant"
                  ? { commercantData: parsedUser.commercantData }
                  : {}),
              };
            }
  
            return {
              ...prevUserData,
              ...(parsedUser.role === "client" ? { clientData: parsedUser.clientData } : {}),
              ...(parsedUser.role === "commercant" ? { commercantData: parsedUser.commercantData } : {}),
            };
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D2] mx-auto"></div>
        <p className="mt-4 text-[#023047]">Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return <div className="container mx-auto py-20 text-center">No user data found</div>;
  }

  const renderDashboard = () => {
    if (userData.role === "client") {
      return <ClientDashboard userData={userData} />;
    } else if (userData.role === "commercant") {
      return <CommercantDashboard userData={userData} />;
    } else {
      return <div>Access Denied: Unknown user role</div>;
    }
  };

  return (
    <div>
      <main className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[#00B8D2] text-3xl font-bold">
            {userData.role === "client" ? "Client Dashboard" : "Merchant Dashboard"}
          </h1>
        </div>

        {renderDashboard()}
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

// Client Dashboard Component
function ClientDashboard({ userData }: { userData: User }) {
  const clientData = userData.role === "client" ? userData.clientData : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
        <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">
          Welcome back, {userData.firstName}!
        </h2>
        <p className="text-[#023047] mb-6">
          Here you can manage your account and view your earnings.
        </p>

        <div className="space-y-4">
          <div>
            <p className="font-medium text-[#023047]">Available WinCoins:</p>
            <p className="text-2xl font-bold text-[#00B8D2]">
              {clientData?.coins ?? 0}
            </p>
          </div>

          <div>
            <p className="font-medium text-[#023047]">Influencer Status:</p>
            <p className="text-[#00B8D2]">
              {clientData?.isInfluencer ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <p className="font-medium text-[#023047]">Instagram Account:</p>
            <a
              href={
                clientData?.username_instagram
                  ? `https://www.instagram.com/${clientData.username_instagram}`
                  : "#"
              }
              className="text-[#00B8D2] underline hover:text-[#023047]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {clientData?.username_instagram ?? "N/A"}
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
        <h3 className="text-[#00B8D2] text-xl font-bold mb-4">Recent Activity</h3>
        <p className="text-[#023047] mb-6">Your recent transactions and earnings</p>

        <div className="space-y-4">
          <div className="p-4 border border-[#F0F0F0] rounded-lg">
            <p className="text-sm text-[#023047]">
              Earned 5 WinCoins for visiting Restaurant XYZ
            </p>
            <p className="text-xs text-gray-500">2 days ago</p>
          </div>

          <div className="p-4 border border-[#F0F0F0] rounded-lg">
            <p className="text-sm text-[#023047]">
              Withdrew 10 WinCoins to your account
            </p>
            <p className="text-xs text-gray-500">5 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Commercant Dashboard Component
function CommercantDashboard({ userData }: { userData: User }) {
  const commercantData = userData.role === "commercant" ? userData.commercantData : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Business Overview */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
        <h2 className="text-[#00B8D2] text-2xl font-bold mb-4">Business Overview</h2>
        <p className="text-[#023047] mb-6">
          Manage your business profile and view performance metrics
        </p>

        <div className="space-y-4">
          <div>
            <p className="font-medium text-[#023047]">Business Name:</p>
            <p className="text-xl font-bold text-[#00B8D2]">
              {commercantData?.businessName ?? "N/A"}
            </p>
          </div>

          <div>
            <p className="font-medium text-[#023047]">Available WinCoins:</p>
            <p className="text-2xl font-bold text-[#00B8D2]">
              {commercantData?.coins ?? 0}
            </p>
          </div>

          <div>
            <p className="font-medium text-[#023047]">Active Promotions:</p>
            <p className="text-[#00B8D2]">{commercantData?.activePromotions ?? 0}</p>
          </div>

          <div>
            <p className="font-medium text-[#023047]">Total Earnings:</p>
            <p className="text-[#00B8D2]">{commercantData?.totalEarnings ?? 0}€</p>
          </div>
        </div>
      </div>

      {/* Current Promotions */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_7px_14px_rgba(0,0,0,0.1)]">
        <h3 className="text-[#00B8D2] text-xl font-bold mb-4">Current Promotions</h3>
        <p className="text-[#023047] mb-6">Manage and track your active promotions</p>

        <div className="space-y-4">
          <div className="p-4 border border-[#F0F0F0] rounded-lg">
            <p className="text-sm text-[#023047]">Summer Special Promotion</p>
            <p className="text-xs text-gray-500">Expires in 14 days</p>
          </div>

          <div className="p-4 border border-[#F0F0F0] rounded-lg">
            <p className="text-sm text-[#023047]">Weekend Discount Offer</p>
            <p className="text-xs text-gray-500">Expires in 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}