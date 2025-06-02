// Define the User Role
export type Role = "client" | "commercant";

// Define the Client Data Type
export interface ClientData {
  coins: number;
  isInfluencer: boolean;
  username_instagram: string;
}

// Define the Commercant Data Type
export interface CommercantData {
  businessName: string;
  coins: number;
  totalEarnings: number;
  activePromotions: number;
}

// Define the User Type
export interface User {
  id: string; // Unique identifier for the user
  email: string; // User's email address
  firstName: string; // User's first name
  lastName: string; // User's last name
  role: Role; // User's role (client or commercant)
  token: string; // JWT token for authentication
  clientData?: ClientData; // Optional client-specific data
  commercantData?: CommercantData; // Optional commercant-specific data
}