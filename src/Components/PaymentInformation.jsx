import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "../context/FormProvider";

const PaymentInformation = () => {
  const { formFields, updateField, setFormFields } = useForm();
  const { products } = formFields;
  const [payments, setpayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [tempReceivedAmount, setTempReceivedAmount] = useState("");
  console.log(payments);

  useEffect(() => {
    const fetchpayments = async () => {
      try {
        const res = await fetch(
          "https://front-end-task-lake.vercel.app/api/v1/account/get-accounts?type=All",
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
            },
          }
        );
        const data = await res.json();
        setpayments(data.data);
      } catch (error) {
        console.error("Failed to fetch salespersons:", error);
      }
    };
    fetchpayments();
  }, []);

  // const addPayment = () => {
  //   if (!selectedPaymentId || !tempReceivedAmount) return;

  //   const newPayment = {
  //     id: selectedPaymentId,
  //     amount: parseFloat(tempReceivedAmount),
  //   };

  //   setFormFields((prev) => ({
  //     ...prev,
  //     payment: [...prev.payment, newPayment],
  //     receivedAmount: parseFloat(tempReceivedAmount), // Update receivedAmount
  //   }));

  //   setTempReceivedAmount(""); // Reset tempReceivedAmount after adding payment
  // };
  const addPayment = () => {
    if (!selectedPaymentId || !tempReceivedAmount) return;

    const newPayment = {
      id: selectedPaymentId,
      amount: parseFloat(tempReceivedAmount),
    };

    setFormFields((prev) => ({
      ...prev,
      payment: [...prev.payment, newPayment],
      receivedAmount:
        (prev.receivedAmount || 0) + parseFloat(tempReceivedAmount), // আগের মানের সাথে যোগ করো
    }));

    setTempReceivedAmount(""); // Reset tempReceivedAmount after adding payment
  };
  const totalQuantity = useMemo(
    () => products?.reduce((acc, product) => acc + product.skuList.length, 0),
    [products]
  );

  const totalPrice = useMemo(
    () =>
      products?.reduce((acc, product) => {
        const priceToUse = product.productdiscount
          ? product.discPrice
          : product.sellprice;
        return acc + priceToUse * product.skuList.length;
      }, 0),
    [products]
  );

  const vat = useMemo(() => formFields.vatAmount || 0, [formFields]);
  const discount = useMemo(() => formFields.discountAmount || 0, [formFields]);
  const payableAmount = useMemo(
    () => totalPrice + vat - discount,
    [totalPrice, vat, discount]
  );

  const handleReceivedAmountChange = (e) => {
    const receivedAmount = parseFloat(e.target.value) || 0;
    updateField("receivedAmount", receivedAmount);
    setTempReceivedAmount(receivedAmount); // Update tempReceivedAmount as well
  };

  const changeAmount =
    formFields.receivedAmount >= payableAmount
      ? formFields.receivedAmount - payableAmount
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="text-lg font-medium">Total Items: {products?.length}</div>
      <div className="text-lg font-medium">Total Quantity: {totalQuantity}</div>
      <div className="text-lg font-medium">
        Total Price: {totalPrice?.toFixed(2)}
      </div>
      <div className="text-lg font-medium">VAT: {vat.toFixed(2)}</div>
      <div className="text-lg font-medium">
        Discount: {discount?.toFixed(2)}
      </div>
      <div className="text-xl font-bold text-primary">
        Total Payable: {payableAmount?.toFixed(2)}
      </div>

      <div>
        <label htmlFor="receivedAmount" className="block text-lg font-medium">
          Received Amount:
        </label>
        <input
          type="number"
          id="receivedAmount"
          className="border px-2 py-1 rounded-md"
          value={formFields.receivedAmount || ""}
          onChange={handleReceivedAmountChange}
        />
      </div>

      <div className="text-xl font-bold text-primary">
        Change: {changeAmount?.toFixed(2)}
      </div>

      <select
        className="select select-bordered"
        value={selectedPaymentId}
        onChange={(e) => setSelectedPaymentId(e.target.value)}
      >
        <option value="">Select Method</option>
        {payments?.map((p) => (
          <option key={p.id} value={p.id}>
            {p.bankName}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        className="border px-2 py-1 rounded-md"
        value={tempReceivedAmount}
        onChange={(e) => setTempReceivedAmount(e.target.value)}
      />

      <button
        className="btn btn-primary"
        onClick={addPayment}
        disabled={!selectedPaymentId || !tempReceivedAmount}
      >
        Add Payment
      </button>
    </div>
  );
};

export default PaymentInformation;
