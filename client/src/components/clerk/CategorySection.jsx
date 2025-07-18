import React from 'react'
import ProductCard from './ProductCard'

const CategorySection = ({categoryName, products, onProductClick}) => {
  return (
    <div className=''>
        <div className='mt-4'>
        <h2 className='text-xl font-semibold mb-2 text-gray-700'>{categoryName}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={onProductClick}/>
            ))}
        </div>
        </div>
    </div>
  )
}

export default CategorySection