import React, { useState } from 'react';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import bedImg from '../../assets/product-bed-1.jpg';
import sofaImg from '../../assets/product-sofa-1.jpg';
import diwanImg from '../../assets/category-diwan.jpg';
import chairImg from '../../assets/category-chair.jpg';
import swingImg from '../../assets/category-swing.jpg';
import balconyImg from '../../assets/category-balcony.jpg';
import cotImg from '../../assets/category-cot.jpg';
import livingRoomImg from '../../assets/hero-living-room.jpg';

const FeaturedProducts = () => {
  const [wishlist, setWishlist] = useState([]);

  const products = [
    {
      id: 1,
      category: 'COT',
      title: 'Oslo Premium King Bed',
      rating: 4.8,
      reviews: 124,
      price: 45999,
      oldPrice: 52999,
      badge: 'Bestseller',
      badgeColor: 'green',
      image: bedImg,
    },
    {
      id: 2,
      category: 'SOFA',
      title: 'Vienna L-Shape Sofa',
      rating: 4.7,
      reviews: 89,
      price: 68999,
      oldPrice: 79999,
      badge: 'New',
      badgeColor: 'lightGreen',
      image: sofaImg,
    },
    {
      id: 3,
      category: 'DIWAN',
      title: 'Maharaja Wooden Diwan',
      rating: 4.9,
      reviews: 156,
      price: 32999,
      oldPrice: null,
      badge: 'Bestseller',
      badgeColor: 'green',
      image: diwanImg,
    },
    {
      id: 4,
      category: 'CHAIR',
      title: 'Copenhagen Dining Chair',
      rating: 4.6,
      reviews: 78,
      price: 8999,
      oldPrice: 10999,
      badge: '-18%',
      badgeColor: 'red',
      image: chairImg,
    },
    {
      id: 5,
      category: 'SWING',
      title: 'Garden Swing Chair',
      rating: 4.5,
      reviews: 92,
      price: 24999,
      oldPrice: 28999,
      badge: 'New',
      badgeColor: 'lightGreen',
      image: swingImg,
    },
    {
      id: 6,
      category: 'BALCONY',
      title: 'Balcony Lounge Set',
      rating: 4.8,
      reviews: 67,
      price: 42999,
      oldPrice: null,
      badge: 'Bestseller',
      badgeColor: 'green',
      image: balconyImg,
    },
    {
      id: 7,
      category: 'COT',
      title: 'Royal Wooden Cot',
      rating: 4.7,
      reviews: 143,
      price: 38999,
      oldPrice: 45999,
      badge: '-15%',
      badgeColor: 'red',
      image: cotImg,
    },
    {
      id: 8,
      category: 'SOFA',
      title: 'Classic Living Room Set',
      rating: 4.9,
      reviews: 201,
      price: 89999,
      oldPrice: null,
      badge: 'Bestseller',
      badgeColor: 'green',
      image: livingRoomImg,
    },
  ];

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getBadgeStyles = (color) => {
    const styles = {
      green: 'text-white',
      lightGreen: 'text-white',
      red: 'bg-red-500 text-white',
    };
    return styles[color] || styles.green;
  };

  return (
    <section className="py-16 px-4 md:px-8" style={{ backgroundColor: '#FFF7F2' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-xs tracking-widest mb-2 uppercase font-medium" style={{ color: '#93a267' }}>
              CURATED SELECTION
            </p>
            <h2 className="text-2xl md:text-4xl font-bold" style={{ color: '#93a267' }}>
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#93a267' }}
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Products Grid with Multiple Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyles(
                      product.badgeColor
                    )}`}
                    style={
                      product.badgeColor === 'green' || product.badgeColor === 'lightGreen'
                        ? { backgroundColor: '#93a267' }
                        : {}
                    }
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all group/heart"
                  style={{ border: '1px solid #e5e7eb' }}
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      wishlist.includes(product.id)
                        ? 'fill-red-500 stroke-red-500'
                        : 'stroke-gray-600 group-hover/heart:stroke-red-500'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Category */}
                <p className="text-xs tracking-wider uppercase mb-2 font-semibold" style={{ color: '#93a267' }}>
                  {product.category}
                </p>

                {/* Title */}
                <h3 className="text-xs font-bold mb-2 text-gray-900 line-clamp-1">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="fill-amber-400 stroke-amber-400" />
                  <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: '#93a267' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.oldPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="md:hidden mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            style={{ color: '#1a4d2e' }}
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
