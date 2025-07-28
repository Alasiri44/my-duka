import React from "react"

const ExitTable = ({ exits, products, users }) => {
  const productMap = Object.fromEntries(products.map(p => [p.id, p.name]))
  const userMap = Object.fromEntries(users.map(u => [u.id, `${u.first_name} ${u.last_name}`]))

  return (
    <div className="overflow-x-auto border border-[#f2f0ed] rounded-xl">
  <table className="min-w-[600px] w-full text-sm text-left text-[#011638]">
        <thead className="bg-[#f2f0ed] text-[#011638] uppercase text-xs sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Selling Price</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Recorded By</th>
            <th className="px-4 py-2">Reason</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {exits.map((e, i) => (
            <tr key={i} className="border-t hover:bg-[#fdfafa]">
              <td className="px-4 py-2">{productMap[e.product_id]}</td>
              <td className="px-4 py-2">{e.quantity}</td>
              <td className="px-4 py-2">KES {e.selling_price}</td>
              <td className="px-4 py-2">KES {e.quantity * e.selling_price}</td>
              <td className="px-4 py-2">{userMap[e.recorded_by]}</td>
              <td className="px-4 py-2">{e.reason}</td>
              <td className="px-4 py-2">{new Date(e.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExitTable
