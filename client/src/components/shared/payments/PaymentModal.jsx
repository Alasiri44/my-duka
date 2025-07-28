import React, { useState } from "react";

const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  direction = "out",
  onSubmit,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mpesaReceipt, setMpesaReceipt] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      amount,
      direction,
      paymentMethod,
      mpesaReceipt: paymentMethod === "Mpesa" ? mpesaReceipt : undefined,
      phoneNumber: paymentMethod === "Mpesa" ? phoneNumber : undefined,
      cardNumber: paymentMethod === "Card" ? cardNumber : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Record Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Direction</label>
            <input
              type="text"
              value={direction}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Method --</option>
              <option value="Mpesa">Mpesa</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
          {paymentMethod === "Mpesa" && (
            <>
              <div>
                <label className="block text-sm font-medium">Mpesa Receipt Number</label>
                <input
                  type="text"
                  value={mpesaReceipt}
                  onChange={(e) => setMpesaReceipt(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              {phoneNumber && (
                <div className="text-blue-600 text-sm mt-2">
                  Please complete the payment on your phone for {amount} KES.
                </div>
              )}
            </>
          )}
          {paymentMethod === "Card" && (
            <div>
              <label className="block text-sm font-medium">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
