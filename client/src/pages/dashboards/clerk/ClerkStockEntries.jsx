import React from "react";
import StockEntries from "../../../components/shared/store/inventory/StockEntries";
// import StockEntryForm from "../../../components/clerk/StockEntryForm";

const ClerkStockEntries = () => {
  return (
    <>
      {/* <div>
        <StockEntryForm />
      </div> */}
      <div className="p-4">
        <StockEntries />
      </div>
    </>
  );
};

export default ClerkStockEntries;
