import React from 'react';

const ProductCard = ({ product, onClick }) => {
  const {
    name,
    description,
    selling_price,
    inStock = 0,
    pendingRequests = 0,
  } = product;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500">{description}</p>

      <div className="mt-3 text-sm text-gray-700">
        <p><span className="font-medium">Price:</span> KES {selling_price?.toFixed(2)}</p>
        <p><span className="font-medium">Stock:</span> {inStock} item(s)</p>
        <p><span className="font-medium">Pending Requests:</span> {pendingRequests}</p>
      </div>
    </div>
  );
};

export default ProductCard;
