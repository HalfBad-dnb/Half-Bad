import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    // Fetch product data
    fetch('http://localhost:8081/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Check if data is paginated
        const productsList = data.content || data;
        setProducts(Array.isArray(productsList) ? productsList : []);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setProducts([]); // Set empty array on error
      });

    // Show title and grid after a slight delay
    setTimeout(() => {
      setVisible(true);
      setTitleVisible(true);
    }, 500);
  }, []);

  // Handle quantity updates
  const updateQuantity = (productId, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + amount),
    }));
  };

  // Handle adding to cart
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > 0) {
      addToCart({ ...product, quantity });
    }
  };

  // Get default image based on product name
  const getDefaultImage = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('hoodie')) return '/images/hoodie.jpg';
    if (name.includes('shoes')) return '/images/shoez.jpg';
    return '/images/tshirt.jpg';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${titleVisible ? 'opacity-100 transform scale-100 blur-0' : 'opacity-0 transform scale-150 blur-sm'}`}>
            Our Products
          </h1>
        </div>
      </section>

      {/* Product Grid */}
      <section className="relative py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-black bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="mb-6 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                    <img
                      src={product.imageUrl || getDefaultImage(product.name)}
                      alt={product.name}
                      className="h-64 w-full object-cover object-center rounded-lg shadow-xl ring-4 ring-[#FFD700]/20"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDefaultImage(product.name);
                      }}
                    />
                  </div>
                  <h2 className={`text-2xl font-bold text-[#FFD700] mb-4 transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-150'}`}>
                    {product.name}
                  </h2>
                  <p className="text-gray-300 mb-4 text-lg">{product.description}</p>
                  <p className="text-2xl text-yellow-500 mb-6">${product.price.toFixed(2)}</p>
                </Link>

                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="bg-black bg-opacity-50 text-[#FFD700] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    -
                  </button>
                  <span className="text-xl text-[#FFD700] w-12 text-center">{quantities[product.id] || 0}</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="bg-black bg-opacity-50 text-[#FFD700] border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#FFD700] hover:bg-[#FFD700]/80 text-black font-bold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    
    </div>
  );
}

export default ProductsPage;
