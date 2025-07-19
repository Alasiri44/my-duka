import React from "react";
import { FaBuilding, FaStoreAlt, FaTruckLoading, FaMoneyBillWave } from "react-icons/fa";

const cardStyle =
  "bg-[#f2f0ed] rounded-lg shadow-md p-4 flex items-center justify-between  transition-colors duration-300 cursor-pointer";
const labelStyle = "text-sm text-[#5e574d]";
const valueStyle = "text-xl font-bold text-[#011638] flex items-center gap-2";

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      label: "Total Businesses",
      value: summary.totalBusinesses,
      icon: <FaBuilding size={24} className="text-[#011638]" />,
    },
    {
      label: "Total Stores",
      value: summary.totalStores,
      icon: <FaStoreAlt size={24} className="text-[#011638]" />,
    },
    {
      label: "Unpaid Deliveries",
      value: summary.unpaidDeliveries || 0,
      icon: <FaTruckLoading size={24} className="text-[#011638]" />,
    },
    {
      label: "Outstanding Amount",
      value: `KES ${summary.outstandingAmount?.toLocaleString() || "0"}`,
      icon: <FaMoneyBillWave size={24} className="text-[#011638]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={cardStyle}>
          <div>
            <p className={labelStyle}>{card.label}</p>
            <p className={valueStyle}>
              {card.icon} {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
