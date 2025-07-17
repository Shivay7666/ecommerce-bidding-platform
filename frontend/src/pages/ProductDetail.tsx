import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, Tag, Gavel, MessageCircle, ArrowLeft, Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, placeBid, makeBarterOffer } = useData();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [selectedBarterItem, setSelectedBarterItem] = useState('');
  const [barterMessage, setBarterMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'bid' | 'barter'>('bid');

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const highestBid = product.bids.length > 0 ? product.bids[0].amount : 0;
  const timeLeft = product.endsAt ? Math.max(0, new Date(product.endsAt).getTime() - Date.now()) : 0;
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const amount = parseFloat(bidAmount);
    if (amount > highestBid && user) {
      placeBid(product.id, amount, user.id, user.username);
      setBidAmount('');
      alert('Bid placed successfully!');
    }
  };

  const handleBarterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (selectedBarterItem && user) {
      makeBarterOffer({
        fromUserId: user.id,
        fromUserName: user.username,
        itemOfferedId: selectedBarterItem,
        itemOfferedTitle: 'Your Item', // In a real app, this would be looked up
        itemOfferedImage: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=150',
        message: barterMessage
      });
      setSelectedBarterItem('');
      setBarterMessage('');
      alert('Barter offer sent successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.condition}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Owner Info */}
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{product.ownerName}</p>
                <p className="text-sm text-gray-600">Seller</p>
              </div>
            </div>

            {/* Price and Bids */}
            <div className="bg-white p-6 rounded-lg space-y-4">
              {product.price && (
                <div>
                  <span className="text-sm text-gray-600">Starting Price</span>
                  <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
                </div>
              )}
              
              {product.bids.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Current Highest Bid</span>
                  <p className="text-2xl font-bold text-green-600">₹{highestBid}</p>
                  <p className="text-sm text-gray-600">
                    by {product.bids[0].bidderName}
                  </p>
                </div>
              )}

              {product.endsAt && timeLeft > 0 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">
                    {daysLeft > 0 && `${daysLeft}d `}
                    {hoursLeft > 0 && `${hoursLeft}h `}
                    {minutesLeft}m remaining
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex space-x-4 mb-6">
                {product.allowBidding && (
                  <button
                    onClick={() => setActiveTab('bid')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'bid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Gavel className="h-4 w-4" />
                    <span>Place Bid</span>
                  </button>
                )}
                {product.allowBarter && (
                  <button
                    onClick={() => setActiveTab('barter')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'barter'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="h-4 w-4" />
                    <span>Make Offer</span>
                  </button>
                )}
              </div>

              {/* Bidding Form */}
              {activeTab === 'bid' && product.allowBidding && (
                <form onSubmit={handleBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid Amount (INR)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={highestBid + 1}
                      step="1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Minimum bid: ₹${highestBid + 1}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Place Bid
                  </button>
                </form>
              )}

              {/* Barter Form */}
              {activeTab === 'barter' && product.allowBarter && (
                <form onSubmit={handleBarterOffer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Item to Offer
                    </label>
                    <select
                      value={selectedBarterItem}
                      onChange={(e) => setSelectedBarterItem(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Choose an item from your inventory</option>
                      <option value="1">Vintage Watch</option>
                      <option value="2">Gaming Console</option>
                      <option value="3">Art Supplies</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={barterMessage}
                      onChange={(e) => setBarterMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Add a message about your offer..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Send Barter Offer
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bid History */}
        {product.bids.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bid History</h2>
            <div className="bg-white rounded-lg shadow-sm">
              {product.bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`p-4 flex justify-between items-center ${
                    index !== product.bids.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{bid.bidderName}</p>
                      <p className="text-sm text-gray-600">
                        {bid.createdAt.toLocaleDateString()} at {bid.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${bid.amount}</p>
                    {index === 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Highest Bid
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;