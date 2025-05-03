import React, { useContext } from "react";
import { ProductCustomerContext } from "../context/ContextProvider";

const AdditionInformation = () => {
  const { grandTotal, totalReceivedAmount, changeAmount } = useContext(
    ProductCustomerContext
  );
  return (
    <div className="border-2 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">Addition Information</h2>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="payableAmount" className="label">
            <span className="label-text">Payable Amount</span>
          </label>
          <span className="font-semibold text-right w-32">
            {grandTotal}.00৳
          </span>
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="totalReceivedAmount" className="label">
            <span className="label-text">Total Received Amount</span>
          </label>
          <span className="font-semibold text-right w-32">
            {totalReceivedAmount}.00৳
          </span>
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="change" className="label">
            <span className="label-text">Change</span>
          </label>
          <span className="font-semibold text-right w-32">
            {totalReceivedAmount > grandTotal ? changeAmount : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdditionInformation;
