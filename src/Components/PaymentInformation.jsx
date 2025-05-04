import React, { useContext, useState } from "react";
import { ProductCustomerContext } from "../context/ContextProvider";

const PaymentInformation = () => {
  const [payment, setPayment] = useState("");
  const [paymentName, setPaymentName] = useState();
  const [isMethod, setisMethod] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    id: "",
    bankName: "",
  });
  console.log(payment, paymentName);
  const {
    subtotal,
    grandTotal,
    vatAmount,
    discountAmount,
    items,
    quantity,
    getPayment,
    setPaymentMethod,
    setpaymentArray,
    loading,
    paymentMethod,
    selectedPaymentMethods,
    setSelectedPaymentMethods,
  } = useContext(ProductCustomerContext);
  const handleAddPaymentMethod = (methodName) => {
    // Avoid duplicates
    if (!selectedPaymentMethods.includes(methodName)) {
      setSelectedPaymentMethods((prev) => [...prev, methodName]);
      console.log(methodName);
    }
  };
  console.log(paymentDetails);
  const paymentInfo = () => {
    if (paymentName && payment) {
      const newPaymentInfo = {
        method: paymentName,
        amount: payment,
        id: paymentDetails.id,
      };
      setpaymentArray((prevArray) => [...prevArray, newPaymentInfo]);

      setPayment("");
      setPaymentName("");
    } else {
      alert("Please select a payment method and enter the amount.");
    }
  };
  return (
    <div className="border-2 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
      <div className="">
        <div>
          <div className="flex justify-between items-center">
            <label className="label">
              <span className="label-text">Maximum Retail Price (MRP)</span>
            </label>
            <span className="font-semibold">{subtotal}.00৳</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="label">
              <span className="label-text">(+) Vat/Tax</span>
            </label>
            <span>{vatAmount}৳</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="label">
              <span className="label-text">(-) Discount</span>
            </label>
            <span>{discountAmount}৳</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="label">
              <span className="label-text">Number Of Items</span>
            </label>
            <span>{items}</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="label">
              <span className="label-text">Total Items Quantity</span>
            </label>
            <span className="font-semibold">{quantity}</span>{" "}
          </div>
          <div className="flex justify-between items-center font-semibold text-lg">
            <label className="label">
              <span className="label-text">Total Payable Amount</span>
            </label>
            <span>{grandTotal}৳</span>
          </div>
        </div>
      </div>
      <div className="form-control">
        <label htmlFor="selectSalesRep" className="label">
          <span className="label-text">Select Sales Person</span>
        </label>
        <select
          className="select select-bordered w-full"
          onClick={() => {
            if (paymentMethod.length === 0 && !loading) {
              getPayment();
            }
          }}
          onChange={(e) => {
            const selectedBankName = e.target.value;
            const selectedMethod = paymentMethod.find(
              (method) => method.bankName === selectedBankName
            );

            handleAddPaymentMethod(selectedBankName);
            setPaymentName(selectedBankName);

            if (selectedMethod) {
              setPaymentDetails({
                id: selectedMethod.id,
                bankName: selectedMethod.bankName,
                // Add more fields if needed:
                // type: selectedMethod.type,
                // accountNumber: selectedMethod.accountNumber,
              });
            }
          }}
        >
          <option value="">Select Payment Method</option>
          {paymentMethod.map((Method, id) => (
            <option key={id} value={Method.bankName}>
              {Method.bankName}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter amount"
          className="input input-bordered w-full mt-2"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        />

        <button
          onClick={paymentInfo}
          className="cursor-pointer bg-green-300 w-full my-4"
        >
          Save Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentInformation;
