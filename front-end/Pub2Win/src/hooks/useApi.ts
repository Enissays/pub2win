import { useAuth } from '@clerk/clerk-expo';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export const useApi = () => {
  const { getToken } = useAuth();
  const baseUrl = 'https://holland-leaf-publication-observation.trycloudflare.com'; // Change to your actual API URL

  const fetchWithAuth = async (endpoint: string, options: ApiOptions = {}) => {
    try {
      console.log("Fetching with auth:", endpoint, options);
      const token = '';
      console.log("Token:", token);
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      };

      // Prepare request options
      const requestOptions: RequestInit = {
        method: options.method || 'GET',
        headers,
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      };

      // Make the request
      console.log("Request options:", requestOptions);
      const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
      
      // Parse the JSON response
      const data = await response.json();
      console.log("Response data:", data);
      
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  return {
    get: (endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) => 
      fetchWithAuth(endpoint, { ...options, method: 'GET' }),
    
    post: (endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
      fetchWithAuth(endpoint, { ...options, method: 'POST', body }),
    
    put: (endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
      fetchWithAuth(endpoint, { ...options, method: 'PUT', body }),
    
    patch: (endpoint: string, body: any, options?: Omit<ApiOptions, 'method'>) => 
      fetchWithAuth(endpoint, { ...options, method: 'PATCH', body }),
    
    delete: (endpoint: string, options?: Omit<ApiOptions, 'method'>) => 
      fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
  };
};