import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/products/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const productData = response.data;
        
        // Parse colors and sizes from the database
        const colors = productData.colors ? 
          (typeof productData.colors === 'string' ? JSON.parse(productData.colors.replace('{', '[').replace('}', ']')) : productData.colors) : 
          ['Default'];
        
        const sizes = productData.sizes ? 
          (typeof productData.sizes === 'string' ? JSON.parse(productData.sizes.replace('{', '[').replace('}', ']')) : productData.sizes) : 
          ['One Size'];

        setProduct({
          ...productData,
          colors: colors,
          sizes: sizes,
          image_url: productData.image_url // Ensure image_url is passed through
        });

        // Set default selections
        setSelectedColor(colors[0]);
        setSelectedSize(sizes[0]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    // You can add logic here to update the product image based on color if needed
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // You can add logic here to update price or availability based on size if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white flex items-center justify-center">
        <div className="text-2xl text-[#FFD700]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  const imageUrl = product.image_url || '/images/default-product.jpg';
  const colors = product.colors || ['Default'];
  const sizes = product.sizes || ['One Size'];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-8">
              <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 transition-all duration-300 hover:border-[#FFD700]/40">
                <img 
                  src={`http://localhost:8081${product.image_url}`}
                  alt={product.name || 'Product Image'} 
                  className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-product.jpg';
                  }}
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-8">
              <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20">
                <h1 className="text-4xl font-bold text-[#FFD700] mb-4">{product.name}</h1>
                <p className="text-2xl text-white mb-6">${product.price}</p>
                <div className="prose prose-lg prose-invert mb-8">
                  <p className="text-gray-300">{product.description}</p>
                </div>

                {/* Color Selection */}
                {colors && colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#FFD700] mb-3">Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                            selectedColor === color
                              ? 'border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700]'
                              : 'border-gray-500 hover:border-[#FFD700]/50 text-gray-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {sizes && sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#FFD700] mb-3">Size</h3>
                    <div className="flex flex-wrap gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                            selectedSize === size
                              ? 'border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700]'
                              : 'border-gray-500 hover:border-[#FFD700]/50 text-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <button 
                    className="w-full bg-[#FFD700] text-black font-bold py-3 px-6 rounded-lg shadow-lg 
                             transition-all duration-300 hover:bg-[#FFC500] hover:shadow-[#FFD700]/50 
                             active:transform active:scale-95"
                  >
                    Add to Cart
                  </button>
                  
                  <Link 
                    to="/products" 
                    className="block text-center w-full bg-transparent border-2 border-[#FFD700] text-[#FFD700] 
                             font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 
                             hover:bg-[#FFD700]/10 hover:shadow-[#FFD700]/30"
                  >
                    Back to Products
                  </Link>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Product Details</h2>
                <div className="space-y-4 text-gray-300">
                  <p><span className="font-semibold">Category:</span> {product.category}</p>
                  <p><span className="font-semibold">Stock:</span> {product.stock} units</p>
                  <p><span className="font-semibold">SKU:</span> {product.id}</p>
                  {selectedColor && <p><span className="font-semibold">Selected Color:</span> {selectedColor}</p>}
                  {selectedSize && <p><span className="font-semibold">Selected Size:</span> {selectedSize}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
