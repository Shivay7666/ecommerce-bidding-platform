// Type definitions for API client

declare module '../utils/api' {
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

  export interface ProfileResponse {
    user: User;
  }

  export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
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
    endsAt: string;
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

  export interface ProductsResponse {
    products: Product[];
  }

  export interface ProductResponse {
    product: Product;
  }

  export interface MessageResponse {
    message: string;
  }

  export interface NewsletterResponse {
    message: string;
  }

  export const authAPI: {
    login: (email: string, password: string) => Promise<AuthResponse>;
    signup: (username: string, email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    getProfile: () => Promise<ProfileResponse>;
    updateProfile: (userData: Partial<User>) => Promise<ProfileResponse>;
    getCurrentUser: () => User | null;
    isAuthenticated: () => boolean;
  };

  export const productAPI: {
    getAllProducts: () => Promise<ProductsResponse>;
    searchProducts: (query: string, category?: string) => Promise<ProductsResponse>;
    getProductById: (id: string) => Promise<ProductResponse>;
    createProduct: (productData: Partial<Product>) => Promise<ProductResponse>;
    updateProduct: (id: string, productData: Partial<Product>) => Promise<ProductResponse>;
    deleteProduct: (id: string) => Promise<MessageResponse>;
    getUserProducts: (userId: string) => Promise<ProductsResponse>;
    placeBid: (productId: string, amount: number) => Promise<ProductResponse>;
    makeOffer: (productId: string, itemOfferedId: string, message?: string) => Promise<ProductResponse>;
    respondToOffer: (productId: string, offerId: string, status: 'accepted' | 'rejected') => Promise<ProductResponse>;
  };

  export const newsletterAPI: {
    subscribe: (email: string) => Promise<NewsletterResponse>;
    unsubscribe: (email: string) => Promise<NewsletterResponse>;
  };
}
