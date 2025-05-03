import React, { useContext, useState } from "react";
import { ProductCustomerContext } from "../context/ContextProvider";
import { generateInvoiceNumber } from "../utils/invoiceGenerator";

const ActionButtons = () => {
  const {
    productData,
    invoiceNumber,
    cashamount,
    cardamount,
    selectedSalesPerson,
    grandTotal,
    salesPersons,
    totalReceivedAmount,
    phone,
    membershipId,
    discountAmount,
    vatAmount,
    changeAmount,
    setInvoiceNumber,
    setProductData,
    setCashAmount,
    setCardAmount,
    setSelectedSalesPerson,
    setGrandTotal,
    setPhone,
    subtotal,
    setMembershipId,
    setDiscountAmount,
    setVatAmount,
    paymentArray,
    setPaymentArray,
    setSalesPersons,
    setChangeAmount,
    setSubtotal,
    setTotalReceivedAmount,
  } = useContext(ProductCustomerContext);
  console.log(salesPersons);
  const [showModal, setShowModal] = useState(false);
  const [heldInvoiceNumber, setHeldInvoiceNumber] = useState("");

  const handleHold = () => {
    const holdData = {
      invoiceNumber,
      productData,
      cashamount,
      cardamount,
      selectedSalesPerson,
      grandTotal,
      phone,
      membershipId,
      discountAmount,
      subtotal,
      changeAmount,
      vatAmount,
      setInvoiceNumber,
      setProductData,
      setCashAmount,
      setCardAmount,
      setSelectedSalesPerson,
      setGrandTotal,
      setPhone,
      setMembershipId,
      setDiscountAmount,
      setVatAmount,
    };

    localStorage.setItem("heldInvoice", JSON.stringify(holdData));
    alert("Hold data saved to local storage!");
    window.location.reload();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleHoldListClick = () => {
    const holdData = JSON.parse(localStorage.getItem("heldInvoice"));
    if (holdData && holdData.invoiceNumber) {
      setHeldInvoiceNumber(holdData.invoiceNumber);
      setShowModal(true);
    } else {
      alert("No held invoice found.");
    }
  };

  const setData = () => {
    const holdData = JSON.parse(localStorage.getItem("heldInvoice"));
    if (holdData) {
      setInvoiceNumber(holdData.invoiceNumber || "");
      setProductData(holdData.productData || []);
      setCashAmount(holdData.cashamount || 0);
      setCardAmount(holdData.cardamount || 0);
      setSelectedSalesPerson(holdData.selectedSalesPerson || "");
      setGrandTotal(holdData.grandTotal || 0);
      setPhone(holdData.phone || "");
      setMembershipId(holdData.membershipId || "");
      setDiscountAmount(holdData.discountAmount || 0);
      setVatAmount(holdData.vatAmount || 0);
    }
  };

  const handleAddClick = () => {
    const newInvoice = generateInvoiceNumber();
    setInvoiceNumber(newInvoice);

    console.log("New Invoice Number:", newInvoice);
  };

  return (
    <div className="flex flex-col space-x-2 mt-4">
      <div className="flex justify-center gap-5 items-center">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Cancel & Clear
        </button>
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add POS
        </button>
      </div>
      <div className="flex gap-2 justify-around py-2">
        <button
          onClick={handleHold}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Hold
        </button>
        <button
          onClick={handleHoldListClick}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Hold List
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          SMS
        </button>
      </div>
      <div className="flex gap-2 justify-around py-2">
        <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Quotation
        </button>
        <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Reattempt
        </button>
        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Re-Print
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Held Invoice</h2>
            <p className="text-gray-700 mb-4">
              Invoice Number:{" "}
              <span className="font-semibold">{heldInvoiceNumber}</span>
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setData();
                  setTimeout(() => setShowModal(false), 50);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer "
              >
                Open
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
              >
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
