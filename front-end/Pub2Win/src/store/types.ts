// Define app state types
export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Influencer {
  id: string;
  name: string;
  followers: number;
  description: string;
  imageUrl: string;
}

// These interfaces will be used in the slices
export interface AuthState {
  user: User | null;
  token: string | null;
  userType: 'vendor' | 'influencer' | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface InfluencersState {
  items: Influencer[];
  loading: boolean;
  error: string | null;
}

// The RootState will be inferred from the store