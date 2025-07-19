import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { productId } = useParams()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product: {productId}</h1>
      {/* Supply form, stock info, history, etc. */}
    </div>
  )
}