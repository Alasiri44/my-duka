export default function StatCard({ title, value, icon, bg = "bg-white", text = "text-gray-800", desc }) {
  return (
    <div className={`rounded-xl shadow p-3 w-full border border-black ${bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-medium text-black`}>{title}</h3>
          <p className={`text-2xl font-medium mt-1 ${text}`}>{value}</p>
          {desc && <p className="text-xs text-gray-400 mt-1">{desc}</p>}
        </div>
        {icon && (
          <div className="text-3xl opacity-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}