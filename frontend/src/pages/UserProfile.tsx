import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Gavel, MessageCircle, Settings, Star, Clock, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ProductCard from '../components/ProductCard';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, getUserProducts } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'listings' | 'bids' | 'offers' | 'settings'>('listings');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const userProducts = getUserProducts(user!.id);
  const userBids = products.filter(product => 
    product.bids.some(bid => bid.bidderId === user!.id)
  );
  const userOffers = products.filter(product => 
    product.offers.some(offer => offer.fromUserId === user!.id)
  );

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: Package, count: userProducts.length },
    { id: 'bids', label: 'My Bids', icon: Gavel, count: userBids.length },
    { id: 'offers', label: 'My Offers', icon: MessageCircle, count: userOffers.length },
    { id: 'settings', label: 'Settings', icon: Settings, count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
                </div>
                <div className="text-sm text-gray-600">
                  Member since January 2024
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{userProducts.length}</p>
                <p className="text-sm text-gray-600">Listings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userBids.length}</p>
                <p className="text-sm text-gray-600">Bids</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userOffers.length}</p>
                <p className="text-sm text-gray-600">Offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* My Listings Tab */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
                  <button
                    onClick={() => navigate('/create-listing')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create New Listing
                  </button>
                </div>
                
                {userProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first listing</p>
                    <button
                      onClick={() => navigate('/create-listing')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Listing
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* My Bids Tab */}
            {activeTab === 'bids' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Bids</h2>
                
                {userBids.length > 0 ? (
                  <div className="space-y-4">
                    {userBids.map((product) => {
                      const userBid = product.bids.find(bid => bid.bidderId === user!.id);
                      const isHighestBid = product.bids[0]?.bidderId === user!.id;
                      
                      return (
                        <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">{product.title}</h3>
                                <p className="text-sm text-gray-600">{product.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">₹{userBid?.amount}</p>
                              <div className="flex items-center space-x-2">
                                {isHighestBid ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Highest Bid
                                  </span>
                                ) : (
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                    Outbid
                                  </span>
                                )}
                                <Clock className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bids yet</h3>
                    <p className="text-gray-600 mb-4">Start bidding on items you like</p>
                    <button
                      onClick={() => navigate('/search')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Items
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* My Offers Tab */}
            {activeTab === 'offers' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Barter Offers</h2>
                
                {userOffers.length > 0 ? (
                  <div className="space-y-4">
                    {userOffers.map((product) => {
                      const userOffer = product.offers.find(offer => offer.fromUserId === user!.id);
                      
                      return (
                        <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">{product.title}</h3>
                                <p className="text-sm text-gray-600">
                                  Offered: {userOffer?.itemOfferedTitle}
                                </p>
                                {userOffer?.message && (
                                  <p className="text-sm text-gray-500 mt-1">"{userOffer.message}"</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                userOffer?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                userOffer?.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {userOffer?.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No barter offers yet</h3>
                    <p className="text-gray-600 mb-4">Start making barter offers on items you want</p>
                    <button
                      onClick={() => navigate('/search')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Items
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          value={user?.username}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Bid notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Barter offer notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;