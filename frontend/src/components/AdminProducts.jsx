import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:8081/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-[#FFD700] mb-6">Products</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b border-gray-700 p-2">
            {product.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminProducts;
