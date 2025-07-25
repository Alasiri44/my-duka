import React, { useEffect, useState } from "react"
import ExitFilters from "./ExitFilters"
import ExitTable from "./ExitTable"
import ExitBatchList from "./ExitBatchList"
import ExitBatchDetailPanel from "./ExitBatchDetailPanel"
import { useOutletContext } from "react-router-dom"

const StockExits = () => {
  const { storeId } = useOutletContext()
  const [exits, setExits] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [batches, setBatches] = useState([])
  const [groupedView, setGroupedView] = useState(true)
  const [selectedBatchId, setSelectedBatchId] = useState(null)
  const [filters, setFilters] = useState({
    productId: "",
    reason: "",
    date: ""
  })

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/stock_exits"),
      fetch("http://localhost:3000/products"),
      fetch("http://localhost:3000/users"),
      fetch("http://localhost:3000/batches"),
    ])
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(([exitData, productData, userData, batchData]) => {
        const filteredProducts = productData.filter(p => Number(p.store_id) === Number(storeId)).map(p => ({ ...p, id: Number(p.id) }))
        const productIds = filteredProducts.map(p => p.id)

        const filteredExits = exitData.filter(e => productIds.includes(Number(e.product_id))).map(e => ({ ...e, id: Number(e.id) }))
        const typedUsers = userData.map(u => ({ ...u, id: Number(u.id) }))
        const filteredBatches = batchData.filter(b => Number(b.store_id) === Number(storeId) && b.direction === "out").map(b => ({ ...b, id: Number(b.id) }))

        setExits(filteredExits)
        setProducts(filteredProducts)
        setUsers(typedUsers)
        setBatches(filteredBatches)
      })
  }, [storeId])

  const handleFilterChange = (field, value) => {
    setSelectedBatchId(null)
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const filteredExitsRaw = exits.filter(e => {
    const matchesProduct = !filters.productId || String(e.product_id) === filters.productId
    const matchesReason = !filters.reason || e.reason === filters.reason
    const matchesDate = !filters.date || new Date(e.created_at).toISOString().slice(0, 10) === filters.date
    return matchesProduct && matchesReason && matchesDate
  })

  const groupedExits = filteredExitsRaw.reduce((acc, exit) => {
    const batchId = exit.batch_id ? String(exit.batch_id) : `no-batch-${exit.id}`
    if (!acc[batchId]) acc[batchId] = []
    acc[batchId].push(exit)
    return acc
  }, {})

  const filteredExits = selectedBatchId ? groupedExits[selectedBatchId] || [] : filteredExitsRaw

  const getFirstExit = (batchExits) => {
    return batchExits.reduce((earliest, current) => {
      return new Date(current.created_at) < new Date(earliest.created_at)
        ? current
        : earliest
    }, batchExits[0])
  }

  const getBatchTotal = (batchExits) => {
    return batchExits.reduce((sum, e) => sum + e.selling_price * e.quantity, 0)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#011638]">Stock Exits</h2>
        <button onClick={() => setGroupedView(!groupedView)} className="text-sm text-[#011638] border border-[#011638] px-3 py-1.5 rounded hover:bg-[#011638] hover:text-white transition">
          {groupedView ? " Show all" : "Show by batch"}
        </button>
      </div>
      <ExitFilters
        filters={filters}
        onChange={handleFilterChange}
        products={products}
      />
      {groupedView ? (
        <div className="flex flex-col md:flex-row gap-4">
          <ExitBatchList
            batches={groupedExits}
            selectedBatchId={selectedBatchId}
            onSelectBatch={setSelectedBatchId}
            getFirstExit={getFirstExit}
            getBatchTotal={getBatchTotal}
          />
          <ExitBatchDetailPanel
            selectedBatchId={selectedBatchId}
            selectedBatchExits={filteredExits}
            getProductName={(id) => products.find(p => p.id === id)?.name || "—"}
            getUserName={(id) => {
              const u = users.find(u => u.id === id)
              return u ? `${u.first_name} ${u.last_name}` : "—"
            }}
          />
        </div>
      ) : (
        <ExitTable exits={filteredExitsRaw} products={products} users={users} />
      )}
    </div>
  )
}

export default StockExits
