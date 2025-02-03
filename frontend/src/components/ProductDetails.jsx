import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart({ ...product, quantity });
    }
  };

  const getDefaultImage = (productName) => {
    if (productName.toLowerCase().includes('hoodie')) {
      return '/images/hoodie.jpg';
    } else if (productName.toLowerCase().includes('shoes')) {
      return '/images/shoez.jpg';
    } else {
      return '/images/tshirt.jpg';
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white flex items-center justify-center">
        <div className="text-2xl text-[#FFD700] animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      <section className="relative py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.imageUrl || getDefaultImage(product.name)}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-lg shadow-xl ring-4 ring-[#FFD700]/20"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDefaultImage(product.name);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-lg"></div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-[#FFD700] mb-4">{product.name}</h1>
                  <p className="text-2xl text-yellow-500 mb-6">${product.price.toFixed(2)}</p>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">{product.description}</p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-xl text-gray-300">Quantity:</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-black bg-opacity-50 text-[#FFD700] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 px-4 py-2 rounded-full transition-all duration-300"
                    >
                      -
                    </button>
                    <span className="text-xl text-[#FFD700] w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-black bg-opacity-50 text-[#FFD700] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 px-4 py-2 rounded-full transition-all duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#FFD700] hover:bg-[#FFD700]/80 text-black font-bold py-4 px-8 rounded-full transform transition-all duration-300 hover:scale-105"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full bg-black bg-opacity-50 text-[#FFD700] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 font-bold py-4 px-8 rounded-full transform transition-all duration-300 hover:scale-105"
                  >
                    Back to Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="relative py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#FFD700] mb-6 text-center">You May Also Like</h2>
          <p className="text-xl text-gray-300 mb-12 text-center">Discover similar items</p>
          
          {/* Add related products grid here if needed */}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
