import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? '/api' 
  : import.meta.env.VITE_API_URL || '/api';

// TypeScript interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price?: number;
  category: string;
  condition: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  bids: Bid[];
  offers: Offer[];
  allowBidding: boolean;
  allowBarter: boolean;
  status: 'active' | 'sold' | 'closed';
  createdAt: string;
  endsAt?: string;
}

export interface Bid {
  _id: string;
  amount: number;
  bidderId: string;
  bidderName: string;
  createdAt: string;
}

export interface Offer {
  _id: string;
  fromUserId: string;
  fromUserName: string;
  itemOfferedId: string;
  itemOfferedTitle: string;
  itemOfferedImage: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API response error:', error);
    
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
      
      // Handle specific error statuses
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('API Error Request:', error.request);
      // Network error or server not reachable
      error.message = 'Unable to connect to server. Please check your internet connection.';
    } else {
      console.error('API Error Message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API services
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  signup: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', { username, email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
    const response = await apiClient.put('/auth/me', userData);
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  }
};

// Products API services
export const productAPI = {
  getAllProducts: async (): Promise<{ products: Product[] }> => {
    const response = await apiClient.get('/products');
    return response.data;
  },
  
  searchProducts: async (query: string, category?: string): Promise<{ products: Product[] }> => {
    const response = await apiClient.get('/products/search', { 
      params: { q: query, category } 
    });
    return response.data;
  },
  
  getProductById: async (id: string): Promise<{ product: Product }> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData: any): Promise<{ product: Product }> => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },
  
  updateProduct: async (id: string, productData: any): Promise<{ product: Product }> => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
  
  getUserProducts: async (userId: string): Promise<{ products: Product[] }> => {
    const response = await apiClient.get(`/products/user/${userId}`);
    return response.data;
  },
  
  placeBid: async (productId: string, amount: number): Promise<{ product: Product }> => {
    const response = await apiClient.post(`/products/${productId}/bid`, { amount });
    return response.data;
  },
  
  makeOffer: async (productId: string, itemOfferedId: string, message: string): Promise<{ product: Product }> => {
    const response = await apiClient.post(`/products/${productId}/offer`, { 
      itemOfferedId, 
      message 
    });
    return response.data;
  },
  
  respondToOffer: async (productId: string, offerId: string, status: string): Promise<{ product: Product }> => {
    const response = await apiClient.put(`/products/${productId}/offer/${offerId}`, { status });
    return response.data;
  }
};

// File upload API services
export const uploadAPI = {
  uploadImages: async (files: File[]): Promise<{ files: string[] }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    console.log('Uploading files:', files);
    console.log('FormData entries:', Array.from(formData.entries()));

    try {
      // Get token manually since multipart/form-data might interfere with interceptor
      const token = localStorage.getItem('token');
      const headers: any = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient.post('/uploads/upload', formData, {
        headers
      });
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Upload error details:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },
  
  deleteImage: async (filename: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/uploads/${filename}`);
    return response.data;
  }
};

// Newsletter API services
export const newsletterAPI = {
  subscribe: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  },
  
  unsubscribe: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/newsletter/unsubscribe', { email });
    return response.data;
  }
};

export default {
  auth: authAPI,
  products: productAPI,
  uploads: uploadAPI,
  newsletter: newsletterAPI
};