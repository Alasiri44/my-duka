import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockOverview = () => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [entriesRes, productsRes] = await Promise.all([
          axios.get('http://localhost:3001/stock_entries'),
          axios.get('http://localhost:3001/products')
        ]);

        const productMap = {};
        productsRes.data.forEach(prod => {
          productMap[prod.id] = prod;
        });

        const mergedData = entriesRes.data.map(entry => {
          const product = productMap[entry.product_id] || {};
          return {
            id: entry.id,
            product_name: product.name || 'Unknown',
            quantity_in_stock: entry.quantity_received,
            buying_price: entry.buying_price,
            selling_price: product.selling_price || '-'
          };
        });

        setStock(mergedData);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };

    fetchStockData();
  }, []);

  if (stock.length === 0) return <p>No stock data available.</p>;

  return (
    <div>
      <h2>Stock Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Buying Price</th>
            <th>Selling Price</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.quantity_in_stock}</td>
              <td>{item.buying_price}</td>
              <td>{item.selling_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockOverview;
