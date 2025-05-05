// 📁 src/components/ActionButtons.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "../context/FormProvider";
import Swal from "sweetalert2";

const ActionButtons = () => {
  const {
    formFields,
    clear,
    holdInvoice,
    heldInvoices,
    restoreInvoice,
    getHeldInvoiceNumbers,
    setFormFields,
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localHeldInvoices, setLocalHeldInvoices] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading spinner

  useEffect(() => {
    const numbers = getHeldInvoiceNumbers();
    setLocalHeldInvoices(numbers);
  }, [getHeldInvoiceNumbers, heldInvoices]);

  const handleAddPOS = async () => {
    setLoading(true);
    console.log("Form Data on Add POS Click:", formFields);
    const newproducts = formFields.products.map((product) => ({
      variationProductId: Number(product.id),
      quantity: Number(product.skuList.length),
      unitPrice: Number(product.sellprice),
      discount: Number(product.productdiscount),
      subTotal: Number(product.skuList.length * product.sellprice),
    }));

    const payment = formFields.payment.map((p) => ({
      paymentAmount: Number(p.amount),
      accountId: Number(p.id),
    }));

    const allSKUs = formFields.products.reduce((skuArray, product) => {
      if (product.skuList && Array.isArray(product.skuList)) {
        skuArray.push(...product.skuList);
      }
      return skuArray;
    }, []);
    const data = {
      invoiceNo: String(formFields.invoiceNumber),
      salesmenId: Number(4),
      discountType: "Fixed",
      discount: Number(formFields.discountAmount) || 0,
      phone: formFields.phoneNumber,
      totalPrice: Number(formFields.paymentSummary.totalPrice),
      totalPaymentAmount: Number(formFields.paymentSummary.totalPayable),
      changeAmount: Number(formFields.paymentSummary.changeAmount),
      vat: Number(formFields.vatAmount) || 0,
      products: newproducts,
      payments: payment,
      sku: allSKUs,
    };
    console.log(data);

    try {
      const response = await fetch(
        "https://front-end-task-lake.vercel.app/api/v1/sell/create-sell",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Response from API:", result);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Sale completed successfully.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });

      clear();
      const newInvoiceNumber = formFields.invoiceNumber + 1;
      setFormFields((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));
    } catch (error) {
      console.error("Error sending data:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to complete sale.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleHold = () => {
    holdInvoice();
    const newInvoiceNumber = formFields.invoiceNumber + 1;
    setFormFields((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));
  };

  const handleHoldList = () => {
    setIsModalOpen(true);
  };

  const handleClear = () => {
    clear();
  };

  const handleRestoreClick = (invoiceNo) => {
    restoreInvoice(invoiceNo);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-4">
      <div className="mt-6 ">
        <div className="grid grid-cols-2 my-1">
          <button onClick={handleClear} className="btn">
            Cancel & Clear
          </button>
          <button onClick={handleAddPOS} className="btn relative">
            {loading && ( // Show spinner when loading is true
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-md">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
            Add POS
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 my-1">
          <button onClick={handleHold} className="btn bg-red-500 text-white">
            Hold
          </button>
          <button onClick={handleHoldList} className="btn">
            Hold List
          </button>
          <button className="btn">Quotation</button>
        </div>

        <div className="grid grid-cols-3 gap-2 my-1">
          <button className="btn">SMS</button>
          <button className="btn">Reattempt</button>
          <button className="btn">Reprint</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full  bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Held Invoices</h2>
            {localHeldInvoices.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto">
                {localHeldInvoices.map((invoiceNo) => (
                  <li
                    key={invoiceNo}
                    className="mb-2 cursor-pointer text-blue-500 hover:underline"
                    onClick={() => handleRestoreClick(invoiceNo)}
                  >
                    Invoice # {invoiceNo}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No invoices currently on hold.</p>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={closeModal} className="btn btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
