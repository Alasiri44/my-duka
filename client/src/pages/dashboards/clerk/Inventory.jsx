import React,{useEffect, useState} from 'react'
import CategorySection from '../../../components/clerk/CategorySection'
import axios from 'axios'


const API_URL='http://localhost:3001'
const Inventory = () => {

  const [groupedProducts, setGroupedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchInventory = async()=>{
      try{
        const[productRes, categoriesRes, stockEntriesRes, stockExitsRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/stock_entries`),
          axios.get(`${API_URL}/stock_exits`)
        ]);

        const products = productRes.data
        const categories = categoriesRes.data
        const stockEntries = stockEntriesRes.data
        const stockExits = stockExitsRes.data

        const stockMap = {};
        products.forEach(product=>{
          const entries = stockEntries.filter(entry => entry.product_id === product.id);
          const exits = stockExits.filter(exit=>exit.product_id === product.id)
          const totalIn = entries.reduce((sum, e) => sum + e.quantity_received, 0)
          const totalOut = exits.reduce((sum,e)=> sum +e.quantity, 0)
          stockMap[product.id] = totalIn-totalOut
        })

        const grouped ={}
        categories.forEach(category => {
          grouped[category.name]=products
          .filter(p=>p.category_id===category.id)
          .map(p=>({
            id:p.id,
            name:p.name,
            stock:stockMap[p.id]||0,
          }))
        })
        setGroupedProducts(grouped);
      }catch(error){
        console.log('Failed to retirieve inventory data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory();
  },[])

  if (loading){
    return <div>Loading inventory...</div>
  }
  return (
    <div>
      <h1>Inventory Overview</h1>

      {Object.entries(groupedProducts).map(([categoryName, products])=>(
        <CategorySection
        key={categoryName}
        categoryName={categoryName}
        products={products}
        onProductClick={(product)=>{
          console.log("product clicked:",product)
        }}
        />
      ))}
      
    </div>
  )
}

export default Inventory