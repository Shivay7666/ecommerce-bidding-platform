import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../contexts/DataContext';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchProducts, products, loading, error } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const categories = ['Electronics', 'Apparel', 'Books', 'Home Goods', 'Sports & Recreation', 'Automotive', 'Art & Collectibles', 'Other'];
  const conditions = ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'];

  // Fallback products in case the backend fails
  const sampleProducts: Product[] = [
    {
      id: "sample1",
      title: "Vintage Camera",
      description: "A beautiful vintage camera in excellent condition",
      price: 299,
      category: "Electronics",
      condition: "Very Good",
      images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
      ownerId: "user1",
      ownerName: "John Doe",
      bids: [],
      offers: [],
      allowBidding: true,
      allowBarter: true,
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "sample2",
      title: "Leather Jacket",
      description: "Genuine leather jacket, barely worn",
      price: 12000,
      category: "Apparel",
      condition: "Like New",
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
      ownerId: "user2",
      ownerName: "Jane Smith",
      bids: [],
      offers: [],
      allowBidding: true,
      allowBarter: false,
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "sample3",
      title: "Antique Desk",
      description: "Beautiful oak writing desk from the 1900s",
      price: 450,
      category: "Home Goods",
      condition: "Good",
      images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
      ownerId: "user1",
      ownerName: "John Doe",
      bids: [],
      offers: [],
      allowBidding: true,
      allowBarter: true,
      status: "active",
      createdAt: new Date(),
    }
  ];

  // Fetch products when search params change
  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      console.log("Starting product fetch...");
      const params = new URLSearchParams(location.search);
      const query = params.get('q') || '';
      const category = params.get('category') || '';
      
      setSearchQuery(query);
      setSelectedCategory(category);
      
      // Always fetch initial products, regardless of search query
      try {
        // If we have a search query, use it
        if (query) {
          console.log(`Searching for products with query: "${query}"`);
          await searchProducts(query);
        } 
        // If products array is empty and we don't have a query, fetch all products
        else if (!products || products.length === 0) {
          console.log("No products loaded yet, fetching all products...");
          // This assumes searchProducts can be called with an empty string to get all products
          await searchProducts("");
        }
        
        console.log("Current products state:", products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      
      // Filter the products based on our criteria
      let results: Product[] = [];
      
      // Use products from backend if available, otherwise use sample products as fallback
      if (products && products.length > 0) {
        results = [...products]; // Create a copy to avoid mutating the original
        console.log("Using backend products:", results.length);
      } else {
        // If no products from backend, use sample products for demonstration
        results = [...sampleProducts];
        console.log("Using sample products as fallback:", results.length);
      }
      
      // Apply category filter if not done by the backend
      if (category && Array.isArray(results)) {
        results = results.filter(product => product.category === category);
      }
      
      // Apply condition filter
      if (selectedCondition && Array.isArray(results)) {
        results = results.filter(product => product.condition === selectedCondition);
      }
      
      // Apply sorting
      if (Array.isArray(results)) {
        switch (sortBy) {
          case 'price-low':
            results.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case 'price-high':
            results.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          case 'ending-soon':
            results.sort((a, b) => {
              const aTime = a.endsAt ? new Date(a.endsAt).getTime() : Infinity;
              const bTime = b.endsAt ? new Date(b.endsAt).getTime() : Infinity;
              return aTime - bTime;
            });
            break;
          case 'most-bids':
            results.sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0));
            break;
          default:
            results.sort((a, b) => {
              const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return bTime - aTime;
            });
        }
      }
      
      setFilteredProducts(Array.isArray(results) ? results : []);
      console.log("Final filtered products:", Array.isArray(results) ? results.length : 0);
    };
    
    fetchAndFilterProducts();
  }, [location.search, selectedCondition, sortBy, searchProducts, products]);
  
  // Load initial products on first mount
  useEffect(() => {
    const loadInitialProducts = async () => {
      console.log("Loading initial products on component mount");
      try {
        await searchProducts("");
      } catch (error) {
        console.error("Error loading initial products:", error);
      }
    };
    
    if (products.length === 0) {
      loadInitialProducts();
    }
  }, []);

  // Ensure we always have products to display
  useEffect(() => {
    // If after loading is done, we still have no products, use the sample data
    if (!loading && filteredProducts.length === 0) {
      console.log("No products loaded after search - using sample products");
      setFilteredProducts(sampleProducts);
    }
  }, [loading, filteredProducts.length]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    try {
      console.log(`Performing search for: "${searchQuery}"`);
      const results = await searchProducts(searchQuery);
      console.log(`Search returned ${results.length} products`);
      
      // Directly update the filteredProducts state with the results
      if (Array.isArray(results)) {
        setFilteredProducts(results);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      // If search fails, show sample products
      setFilteredProducts(sampleProducts);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Found {filteredProducts.length} items
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="most-bids">Most Bids</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Condition</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value=""
                      checked={selectedCondition === ''}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">All Conditions</span>
                  </label>
                  {conditions.map(condition => (
                    <label key={condition} className="flex items-center">
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={selectedCondition === condition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedCondition('');
                  navigate('/search');
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-blue-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                  <div className="h-4 bg-blue-200 rounded w-2/3 mt-4"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/3 mt-4"></div>
                </div>
                <p className="text-gray-600 mt-6">Loading products...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-red-500 text-xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading products</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSelectedCondition('');
                    navigate('/search');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSelectedCondition('');
                    navigate('/search');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;