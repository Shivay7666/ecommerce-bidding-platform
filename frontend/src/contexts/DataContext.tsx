import React, { createContext, useContext, useState, useEffect } from 'react';
import { productAPI } from '../utils/api';

export interface Product {
  id: string;
  title: string;
  category: string;
  condition: string;
  description: string;
  price?: number;
  images: string[];
  ownerId: string;
  ownerName: string;
  bids: Bid[];
  offers: BarterOffer[];
  allowBidding: boolean;
  allowBarter: boolean;
  status: 'active' | 'sold' | 'closed';
  createdAt: Date;
  endsAt?: Date;
}

export interface Bid {
  id: string;
  amount: number;
  bidderId: string;
  bidderName: string;
  createdAt: Date;
}

export interface BarterOffer {
  id: string;
  fromUserId: string;
  fromUserName: string;
  itemOfferedId: string;
  itemOfferedTitle: string;
  itemOfferedImage: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

interface DataContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'bids' | 'offers'>) => Promise<void>;
  placeBid: (productId: string, amount: number, bidderId: string, bidderName: string) => Promise<void>;
  makeBarterOffer: (offer: Omit<BarterOffer, 'id' | 'createdAt'>) => Promise<void>;
  getUserProducts: (userId: string) => Promise<Product[]>;
  searchProducts: (query: string, category?: string) => Promise<Product[]>;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching products from API...');
        const response = await productAPI.getAllProducts();
        console.log('API response:', response);
        if (response && response.products) {
          // Transform API response to match our interface format
          const formattedProducts = response.products.map((product: any) => ({
            id: product._id,
            title: product.title,
            category: product.category,
            condition: product.condition,
            description: product.description,
            price: product.price,
            images: product.images,
            ownerId: product.ownerId,
            ownerName: product.ownerName,
            bids: product.bids.map((bid: any) => ({
              id: bid._id,
              amount: bid.amount,
              bidderId: bid.bidderId,
              bidderName: bid.bidderName,
              createdAt: new Date(bid.createdAt)
            })),
            offers: product.offers.map((offer: any) => ({
              id: offer._id,
              fromUserId: offer.fromUserId,
              fromUserName: offer.fromUserName,
              itemOfferedId: offer.itemOfferedId,
              itemOfferedTitle: offer.itemOfferedTitle,
              itemOfferedImage: offer.itemOfferedImage,
              message: offer.message,
              status: offer.status as 'pending' | 'accepted' | 'rejected',
              createdAt: new Date(offer.createdAt)
            })),
            allowBidding: product.allowBidding,
            allowBarter: product.allowBarter,
            status: product.status as 'active' | 'sold' | 'closed',
            createdAt: new Date(product.createdAt),
            endsAt: product.endsAt ? new Date(product.endsAt) : undefined
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to fetch products');
        
        // Fallback to mock data if API fails
        const mockProducts: Product[] = [
          {
            id: '1',
            title: 'iPhone 14 Pro Max',
            category: 'Electronics',
            condition: 'Like New',
            description: 'Barely used iPhone 14 Pro Max in excellent condition. Includes original box and all accessories.',
            price: 65000,
            images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600'],
            ownerId: '2',
            ownerName: 'Sarah Johnson',
            bids: [
              { id: '1', amount: 62000, bidderId: '3', bidderName: 'Mike Smith', createdAt: new Date() }
            ],
            offers: [],
            allowBidding: true,
            allowBarter: true,
            status: 'active',
            createdAt: new Date(),
            endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            title: 'Vintage Leather Jacket',
            category: 'Apparel',
            condition: 'Good',
            description: 'Authentic vintage leather jacket from the 80s. Perfect for collectors or fashion enthusiasts.',
            price: 12000,
            images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600'],
            ownerId: '3',
            ownerName: 'Alex Chen',
            bids: [],
            offers: [],
            allowBidding: true,
            allowBarter: true,
            status: 'active',
            createdAt: new Date(),
            endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
          }
        ];
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'bids' | 'offers'>) => {
    setLoading(true);
    setError(null);
    try {
      // Convert dates to string format for the API and adjust field names
      const apiProductData = {
        ...productData,
        endsAt: productData.endsAt?.toISOString(),
        // Ensure we're using the correct field name for the API
        _id: undefined // We don't want to send an ID for new products
      };
      const response = await productAPI.createProduct(apiProductData);
      if (response && response.product) {
        const newProduct: Product = {
          id: response.product._id,
          title: response.product.title,
          category: response.product.category,
          condition: response.product.condition,
          description: response.product.description,
          price: response.product.price,
          images: response.product.images,
          ownerId: response.product.ownerId,
          ownerName: response.product.ownerName,
          bids: [],
          offers: [],
          allowBidding: response.product.allowBidding,
          allowBarter: response.product.allowBarter,
          status: response.product.status as 'active' | 'sold' | 'closed',
          createdAt: new Date(response.product.createdAt),
          endsAt: response.product.endsAt ? new Date(response.product.endsAt) : undefined
        };
        setProducts(prev => [newProduct, ...prev]);
      }
    } catch (error: any) {
      console.error('Failed to create product:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to create product'
      );
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (productId: string, amount: number, _bidderId: string, _bidderName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.placeBid(productId, amount);
      if (response && response.product) {
        // Update the products state with the updated product that has the new bid
        setProducts(prev => prev.map(product => {
          if (product.id === productId) {
            const updatedBids = response.product.bids.map((bid: any) => ({
              id: bid._id,
              amount: bid.amount,
              bidderId: bid.bidderId,
              bidderName: bid.bidderName,
              createdAt: new Date(bid.createdAt)
            }));
            
            return {
              ...product,
              bids: updatedBids
            };
          }
          return product;
        }));
      }
    } catch (error: any) {
      console.error('Failed to place bid:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to place bid'
      );
    } finally {
      setLoading(false);
    }
  };

  const makeBarterOffer = async (offer: Omit<BarterOffer, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      // The order of parameters:
      // 1. productId (the product receiving the offer)
      // 2. itemOfferedId (the item being offered in exchange)
      // 3. message (optional message with the offer)
      const response = await productAPI.makeOffer(
        offer.itemOfferedId,  // Target product ID receiving the offer
        offer.fromUserId,     // ID of the item being offered
        offer.message || ''   // Optional message
      );
      
      if (response && response.product) {
        // Update the products state with the updated product that has the new offer
        setProducts(prev => prev.map(product => {
          if (product.id === offer.itemOfferedId) {
            const updatedOffers = response.product.offers.map((apiOffer: any) => ({
              id: apiOffer._id,
              fromUserId: apiOffer.fromUserId,
              fromUserName: apiOffer.fromUserName,
              itemOfferedId: apiOffer.itemOfferedId,
              itemOfferedTitle: apiOffer.itemOfferedTitle,
              itemOfferedImage: apiOffer.itemOfferedImage,
              message: apiOffer.message,
              status: apiOffer.status as 'pending' | 'accepted' | 'rejected',
              createdAt: new Date(apiOffer.createdAt)
            }));
            
            return {
              ...product,
              offers: updatedOffers
            };
          }
          return product;
        }));
      }
    } catch (error: any) {
      console.error('Failed to make barter offer:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to make barter offer'
      );
    } finally {
      setLoading(false);
    }
  };

  const getUserProducts = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getUserProducts(userId);
      if (response && response.products) {
        const userProducts = response.products.map((product: any) => ({
          id: product._id,
          title: product.title,
          category: product.category,
          condition: product.condition,
          description: product.description,
          price: product.price,
          images: product.images,
          ownerId: product.ownerId,
          ownerName: product.ownerName,
          bids: product.bids.map((bid: any) => ({
            id: bid._id,
            amount: bid.amount,
            bidderId: bid.bidderId,
            bidderName: bid.bidderName,
            createdAt: new Date(bid.createdAt)
          })),
          offers: product.offers.map((offer: any) => ({
            id: offer._id,
            fromUserId: offer.fromUserId,
            fromUserName: offer.fromUserName,
            itemOfferedId: offer.itemOfferedId,
            itemOfferedTitle: offer.itemOfferedTitle,
            itemOfferedImage: offer.itemOfferedImage,
            message: offer.message,
            status: offer.status as 'pending' | 'accepted' | 'rejected',
            createdAt: new Date(offer.createdAt)
          })),
          allowBidding: product.allowBidding,
          allowBarter: product.allowBarter,
          status: product.status as 'active' | 'sold' | 'closed',
          createdAt: new Date(product.createdAt),
          endsAt: product.endsAt ? new Date(product.endsAt) : undefined
        }));
        return userProducts;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get user products:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to get user products'
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string, category?: string) => {
    console.log(`DataContext: searching for "${query}", category: "${category || 'all'}"`);
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first
      try {
        const response = await productAPI.searchProducts(query, category);
        console.log(`API returned ${response.products?.length || 0} products`);
        
        if (response && response.products) {
          // Transform API response to match our interface format
          const formattedProducts = response.products.map((product: any) => ({
            id: product._id,
            title: product.title,
            category: product.category,
            condition: product.condition,
            description: product.description,
            price: product.price,
            images: product.images,
            ownerId: product.ownerId,
            ownerName: product.ownerName,
            bids: product.bids.map((bid: any) => ({
              id: bid._id,
              amount: bid.amount,
              bidderId: bid.bidderId,
              bidderName: bid.bidderName,
              createdAt: new Date(bid.createdAt)
            })),
            offers: product.offers.map((offer: any) => ({
              id: offer._id,
              fromUserId: offer.fromUserId,
              fromUserName: offer.fromUserName,
              itemOfferedId: offer.itemOfferedId,
              itemOfferedTitle: offer.itemOfferedTitle,
              itemOfferedImage: offer.itemOfferedImage,
              message: offer.message,
              status: offer.status as 'pending' | 'accepted' | 'rejected',
              createdAt: new Date(offer.createdAt)
            })),
            allowBidding: product.allowBidding,
            allowBarter: product.allowBarter,
            status: product.status as 'active' | 'sold' | 'closed',
            createdAt: new Date(product.createdAt),
            endsAt: product.endsAt ? new Date(product.endsAt) : undefined
          }));
          
          setLoading(false);
          return formattedProducts;
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        // Continue to fallback if API fails
      }
      
      // Fallback to client-side filtering of existing products
      console.log("Using client-side filtering as fallback");
      let filteredProducts = [...products];
      
      // If query is empty and we're fetching all products
      if (!query && products.length > 0) {
        setLoading(false);
        return products;
      }
      
      // Filter by query and category
      if (query || category) {
        filteredProducts = products.filter(product => {
          const matchesQuery = !query || 
                               product.title.toLowerCase().includes(query.toLowerCase()) ||
                               product.description.toLowerCase().includes(query.toLowerCase());
          const matchesCategory = !category || product.category === category;
          return matchesQuery && matchesCategory;
        });
      }
      
      console.log(`Client-side filtering returned ${filteredProducts.length} products`);
      setLoading(false);
      return filteredProducts;
    } catch (err: any) {
      console.error("Search error:", err);
      setLoading(false);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error searching products'
      );
      return [];
    }
  };

  return (
    <DataContext.Provider value={{
      products,
      addProduct,
      placeBid,
      makeBarterOffer,
      getUserProducts,
      searchProducts,
      loading,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
};