import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Repeat, Shield, ArrowRight, Smartphone, Shirt, Book, Home } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const { products } = useData();
  const featuredProducts = products.slice(0, 6);

  const categories = [
    { name: 'Electronics', icon: Smartphone, count: products.filter(p => p.category === 'Electronics').length },
    { name: 'Apparel', icon: Shirt, count: products.filter(p => p.category === 'Apparel').length },
    { name: 'Books', icon: Book, count: products.filter(p => p.category === 'Books').length },
    { name: 'Home Goods', icon: Home, count: products.filter(p => p.category === 'Home Goods').length },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trade Smart, <span className="text-yellow-300">Bid Better</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join the premier peer-to-peer marketplace where you can bid on items, propose barters, and discover unique treasures from your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-listing"
                className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2"
              >
                <span>List an Item Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/search"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Browse Items</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Bid & Barter?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a revolutionary way to buy, sell, and trade with our unique platform features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Bidding</h3>
              <p className="text-gray-600">
                Participate in exciting auctions with real-time bidding. Find great deals and win amazing items.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Barter System</h3>
              <p className="text-gray-600">
                Trade items directly with other users. No money needed - just swap what you have for what you want.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Trading</h3>
              <p className="text-gray-600">
                Trade with confidence using our secure platform with verified users and protected transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h2>
            <p className="text-xl text-gray-600">
              Discover items across various categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/search?category=${category.name}`}
                  className="bg-gray-50 hover:bg-gray-100 p-6 rounded-xl transition-colors text-center group"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count} items</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-600">
              Check out these trending items and hot deals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/search"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Listings</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already trading smart on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/create-listing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              List Your First Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;