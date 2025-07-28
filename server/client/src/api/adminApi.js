dispatch({
  type: 'supplyRequests/fetchAll/fulfilled',
  payload: [
    {
      id: 1,
      product_name: 'Sugar',
      quantity_requested: 25,
      clerk_name: 'Jane Doe',
      status: 'pending'
    },
    {
      id: 2,
      product_name: 'Flour',
      quantity_requested: 10,
      clerk_name: 'John Smith',
      status: 'approved'
    }
  ]
});
