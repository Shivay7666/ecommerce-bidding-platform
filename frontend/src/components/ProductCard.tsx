import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Tag, Gavel } from 'lucide-react';
import { Product } from '../contexts/DataContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const highestBid = product.bids.length > 0 ? product.bids[0].amount : 0;
  const timeLeft = product.endsAt ? Math.max(0, new Date(product.endsAt).getTime() - Date.now()) : 0;
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              {product.category}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
              {product.condition}
            </span>
          </div>
          {product.endsAt && timeLeft > 0 && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>
                {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h` : `${hoursLeft}h`} left
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{product.ownerName}</span>
          </div>
          <div className="flex items-center space-x-2">
            {product.allowBidding && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
                <Gavel className="h-3 w-3" />
                <span>Bidding</span>
              </span>
            )}
            {product.allowBarter && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
                <Tag className="h-3 w-3" />
                <span>Barter</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.price && (
              <p className="text-lg font-bold text-gray-900">
                ₹{product.price}
              </p>
            )}
            {highestBid > 0 && (
              <p className="text-sm text-green-600">
                Highest bid: ₹{highestBid}
              </p>
            )}
          </div>
          <Link
            to={`/product/${product.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;