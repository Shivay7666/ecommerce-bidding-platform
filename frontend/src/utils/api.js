import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
    // Log the error for debugging
    console.error('API response error:', error);
    
    // Add custom error handling here if needed
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API services
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  signup: async (username, email, password) => {
    const response = await apiClient.post('/auth/signup', { username, email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await apiClient.put('/auth/me', userData);
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

// Products API services
export const productAPI = {
  getAllProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },
  
  searchProducts: async (query, category) => {
    const response = await apiClient.get('/products/search', { 
      params: { q: query, category } 
    });
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },
  
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
  
  getUserProducts: async (userId) => {
    const response = await apiClient.get(`/products/user/${userId}`);
    return response.data;
  },
  
  placeBid: async (productId, amount) => {
    const response = await apiClient.post(`/products/${productId}/bid`, { amount });
    return response.data;
  },
  
  makeOffer: async (productId, itemOfferedId, message) => {
    // productId is the ID of the product receiving the offer
    // itemOfferedId is the ID of the item being offered in exchange
    const response = await apiClient.post(`/products/${productId}/offer`, { 
      itemOfferedId, 
      message 
    });
    return response.data;
  },
  
  respondToOffer: async (productId, offerId, status) => {
    const response = await apiClient.put(`/products/${productId}/offer/${offerId}`, { status });
    return response.data;
  }
};

// Newsletter API services
export const newsletterAPI = {
  subscribe: async (email) => {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  },
  
  unsubscribe: async (email) => {
    const response = await apiClient.post('/newsletter/unsubscribe', { email });
    return response.data;
  }
};

export default {
  auth: authAPI,
  products: productAPI,
  newsletter: newsletterAPI
};
