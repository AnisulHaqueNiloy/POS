import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "../context/FormProvider";

const PaymentInformation = () => {
  const { formFields, updateField, setFormFields } = useForm();
  const { products, payment } = formFields;
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ method: "", amount: "" });

  useEffect(() => {
    const fetchPayments = async () => {
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
        setPayments(data.data);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      }
    };
    fetchPayments();
  }, []);

  const handleAddPaymentMethod = () => {
    if (!newPayment.method || !newPayment.amount) return;

    const paymentToAdd = {
      id: newPayment.method,
      amount: parseFloat(newPayment.amount),
    };

    setFormFields((prev) => ({
      ...prev,
      payment: [...(prev.payment || []), paymentToAdd],
      receivedAmount:
        (prev.receivedAmount || 0) + parseFloat(newPayment.amount),
    }));

    setNewPayment({ method: "", amount: "" });
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

  const vat = useMemo(
    () => parseFloat(formFields.vatAmount) || 0,
    [formFields.vatAmount]
  );
  const discount = useMemo(
    () => parseFloat(formFields.discountAmount) || 0,
    [formFields.discountAmount]
  );
  const payableAmount = useMemo(
    () => totalPrice + vat - discount,
    [totalPrice, vat, discount]
  );

  const totalReceivedAmount = useMemo(() => {
    return (formFields.payment || []).reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
  }, [formFields.payment]);

  const changeAmount = useMemo(() => {
    return totalReceivedAmount >= payableAmount
      ? totalReceivedAmount - payableAmount
      : 0;
  }, [totalReceivedAmount, payableAmount]);

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <div className="grid gap-2 border-2 p-1 rounded-md">
        <h2>Customer Information</h2>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value="N/A"
            readOnly
            className="w-full p-1 bg-white border-2 rounded-md"
          />
          <input
            type="text"
            value="01284462842"
            readOnly
            className="w-full p-1 bg-white border-2 rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value="Membership"
            readOnly
            className="w-full p-1 bg-white border-2 rounded-md"
          />
          <input
            type="text"
            value="Discount"
            readOnly
            className="w-full p-1 bg-white border-2 rounded-md"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-2 mb-4">
        <div className="font-medium text-gray-700">
          Maximum Retail Price (MRP)
        </div>
        <div className="text-right">{totalPrice?.toFixed(2)}৳</div>
        <div className="font-medium text-gray-700">(+) Vat/Tax</div>
        <div className="text-right">{vat?.toFixed(2)}৳</div>
        <div className="font-medium text-gray-700">(-) Discount</div>
        <div className="text-right">{discount?.toFixed(2)}৳</div>
        <div className="font-medium text-gray-700">Number Of Items</div>
        <div className="text-right">{products?.length}</div>
        <div className="font-medium text-gray-700">Total Items Quantity</div>
        <div className="text-right">{totalQuantity}</div>
        <div className="font-bold text-xl text-gray-800">
          Total Payable Amount
        </div>
        <div className="text-right font-bold text-xl text-primary">
          {payableAmount?.toFixed(2)}৳
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-700 mb-2">
          Payment Information
        </h3>
        <div>
          {(payment || []).map((p, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-2 mb-2 items-center"
            >
              <select
                className="select select-bordered w-full max-w-xs"
                value={p.id}
                disabled
              >
                {payments?.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.bankName || opt.accountName || "Cash"}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="input input-bordered w-full max-w-xs"
                value={p.amount}
                readOnly
              />
            </div>
          ))}
          <div className="flex items-center gap-2 mb-2">
            <button className="btn btn-sm">+</button>
            <select
              className="select select-bordered w-1/2"
              value={newPayment.method}
              onChange={(e) =>
                setNewPayment({ ...newPayment, method: e.target.value })
              }
            >
              <option value="">Choose The Method</option>
              {payments?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.bankName || p.accountName || "Cash"}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Enter Payment Amount"
              className="input input-bordered w-1/2"
              value={newPayment.amount}
              onChange={(e) =>
                setNewPayment({ ...newPayment, amount: e.target.value })
              }
            />
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddPaymentMethod}
            disabled={!newPayment.method || !newPayment.amount}
          >
            Add Payment
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg text-gray-700 mb-2">
          Addition Information
        </h3>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="font-medium text-gray-700">Payable Amount</div>
          <div className="text-right">{payableAmount?.toFixed(2)}৳</div>
          <div className="font-medium text-gray-700">Total Received Amount</div>
          <div className="text-right">{totalReceivedAmount?.toFixed(2)}৳</div>
          <div className="font-bold text-gray-800">Change</div>
          <div className="text-right font-bold text-green-500">
            {changeAmount?.toFixed(2)}৳
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInformation;
