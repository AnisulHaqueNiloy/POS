import React, { useContext, useState } from "react";
import { ProductCustomerContext } from "../context/ContextProvider";
import { generateInvoiceNumber } from "../utils/invoiceGenerator";
import apiRequest from "../utils/api/apiRequest";
import Swal from "sweetalert2";
import clearInvoiceData from "../utils/clearInvoice";

const ActionButtons = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postedData, setPostedData] = useState(null);
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
    setSelectedBarcode,
    seletedBarcode,
  } = useContext(ProductCustomerContext);

  const [heldInvoiceNumber, setHeldInvoiceNumber] = useState("");

  // clear data

  const data = async () => {
    setLoading(true); // Start loading

    const salesId = salesPersons.map((id) => id.id);

    const productArray = productData.map((item) => {
      const totalQuantity = item.SKUS.length;
      const totalPrice = item.discount
        ? item.discountPrice * totalQuantity
        : item.sellPrice * totalQuantity;

      return {
        variationProductId: item.id,
        quantity: Number(totalQuantity),
        unitPrice: Number(item.sellPrice),
        discount: Number(item.discount || 0),
        subTotal: Number(totalPrice),
      };
    });

    const payments = paymentArray.map((item) => ({
      paymentAmount: Number(item.amount),
      accountId: item.id,
    }));

    // Ensure SKUs are strings
    const Skus = productData.flatMap((item) =>
      item.SKUS.map((sku) => (typeof sku === "string" ? sku : sku.code))
    );

    const body = {
      invoiceNo: String(invoiceNumber),
      salesmenId: salesId[0],
      discountType: "Fixed",
      discount: Number(discountAmount || 0),
      phone: phone,
      totalPrice: Number(subtotal),
      totalPaymentAmount: Number(totalReceivedAmount),
      changeAmount: Number(changeAmount),
      vat: Number(vatAmount || 0),
      products: productArray,
      payments: payments,
      sku: Skus,
    };

    try {
      const response = await fetch(
        "https://front-end-task-lake.vercel.app/api/v1/sell/create-sell",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create sale");
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Sale created successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#28a745",
        color: "#fff",
        iconColor: "#fff",
      }).then(() => {
        window.location.reload();
      });

      window.location.reload();
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
      setSelectedBarcode,
      seletedBarcode,
    };

    localStorage.setItem("heldInvoice", JSON.stringify(holdData));
    alert("Hold data saved to local storage!");
    window.location.reload();
  };

  const handleShowHoldList = () => {
    const heldData = JSON.parse(localStorage.getItem("heldInvoice"));
    if (heldData && heldData.invoiceNumber) {
      setHeldInvoiceNumber(heldData.invoiceNumber);
      setShowModal(true);
    } else {
      Swal.fire({
        icon: "info",
        title: "No Held Invoice Found",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleOpenHeldInvoice = () => {
    const heldData = JSON.parse(localStorage.getItem("heldInvoice"));
    if (!heldData) return;
    setSelectedBarcode;
    setInvoiceNumber(heldData.invoiceNumber || "");
    setProductData(heldData.productData || []);
    setCashAmount(heldData.cashamount || 0);
    setCardAmount(heldData.cardamount || 0);
    setSelectedSalesPerson(heldData.selectedSalesPerson || null);
    setGrandTotal(heldData.grandTotal || 0);
    setPhone(heldData.phone || "");
    setMembershipId(heldData.membershipId || "");
    setDiscountAmount(heldData.discountAmount || 0);
    setVatAmount(heldData.vatAmount || 0);
    setChangeAmount(heldData.changeAmount || 0);
    setSubtotal(heldData.subtotal || 0);

    setShowModal(false); // Close the modal
  };

  const cancle = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col space-x-2 mt-4">
      <div className="flex justify-center gap-5 items-center">
        <button
          onClick={cancle}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel & Clear
        </button>
        <button
          onClick={data}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-white"></div>
          ) : (
            "Add POS"
          )}
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
          onClick={handleShowHoldList}
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
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Held Invoice</h2>
            <p className="mb-4">Invoice Number: {heldInvoiceNumber}</p>
            <button
              onClick={handleOpenHeldInvoice}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Open Invoice
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
