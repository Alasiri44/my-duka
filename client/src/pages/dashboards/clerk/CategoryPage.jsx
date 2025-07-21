import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../../../components/clerk/ProductCard'; 
import axios from 'axios';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes, entriesRes, exitsRes, requestsRes] = await Promise.all([
          axios.get('http://localhost:3001/categories'),
          axios.get('http://localhost:3001/products'),
          axios.get('http://localhost:3001/stock_entries'),
          axios.get('http://localhost:3001/stock_exits'),
          axios.get('http://localhost:3001/supply_requests'),
        ]);

        const currentCategory = categoriesRes.data.find(cat => cat.id.toString() === categoryId);
        setCategoryName(currentCategory?.name || 'Unknown Category');

        const filteredProducts = productsRes.data.filter(
          prod => prod.category_id.toString() === categoryId
        );

        const enrichedProducts = filteredProducts.map(prod => {
          const entries = entriesRes.data.filter(e => e.product_id === prod.id);
          const exits = exitsRes.data.filter(e => e.product_id === prod.id);
          const requests = requestsRes.data.filter(r => r.product_id === prod.id && r.status === 'pending');

          const totalIn = entries.reduce((sum, e) => sum + e.quantity_received, 0);
          const totalOut = exits.reduce((sum, e) => sum + e.quantity, 0);
          const inStock = totalIn - totalOut;

          return {
            ...prod,
            inStock,
            pendingRequests: requests.length,
          };
        });

        setProducts(enrichedProducts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleProductClick = (productId) => {
    navigate(`/inventory/product/${productId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Category: <span className="text-blue-600">{categoryName}</span>
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products available in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
