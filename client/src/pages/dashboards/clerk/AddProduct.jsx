import React from 'react'
import StockEntryForm from '../../../components/clerk/StockEntryForm' 

const AddProduct = () => {
  return (
    <>
    <h1 className='text-center text-2xl font-bold mt-8 mb-4 text-gray 300'>Add New Received Batch</h1>
      <div>
        <StockEntryForm />
      </div>
    </>
  )
}

export default AddProduct