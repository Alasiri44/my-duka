import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockOverview = () => {
  const [stock, setStock] = useState([]);


  useEffect(() => {
    axios.get('/api/stock') 
      .then((res) => setStock(res.data))
      .catch((err) => console.error('Error fetching stock:', err));
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
