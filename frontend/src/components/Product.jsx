import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        console.log("Fetched product:", data); // Debug log
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      navigate('/cart'); // Optionally navigate to cart or show confirmation
    }
  };

  const updateQuantity = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex items-center justify-center pt-24">
        <div className="text-2xl text-yellow-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex items-center justify-center pt-24">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex items-center justify-center pt-24">
        <div className="text-xl text-yellow-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8B0000] to-[#000000] text-white flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-4xl bg-black bg-opacity-50 border-4 border-yellow-500 rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.image_url || "/api/placeholder/400/400"} // Fallback to placeholder image if image_url is not available
              alt={product.name}
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-yellow-500 mb-4">{product.name}</h1>
              <p className="text-2xl text-yellow-300 mb-4">${product.price?.toFixed(2)}</p>
              <p className="text-gray-300 mb-6">{product.description}</p>
            </div>

            {/* Quantity Controls */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => updateQuantity(-1)}
                  className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                >
                  -
                </button>
                <span className="text-xl text-yellow-500">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(1)}
                  className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 px-6 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition transform hover:scale-105"
            >
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
