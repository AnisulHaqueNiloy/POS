// 📁 src/components/ActionButtons.jsx
import React, { useState } from "react";
import { useForm } from "../context/FormProvider";

const ActionButtons = () => {
  const { formFields, setFormFields, clearForm, clear } = useForm(); // Access clearForm from context
  const [isHolding, setIsHolding] = useState(false);

  // Handle Add button
  const handleAdd = () => {
    const newInvoiceNumber = formFields.invoiceNumber + 1;
    setFormFields((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));

    // Clear form fields and product data
    setFormFields((prev) => ({ ...prev, products: [] })); // Reset products

    // API or localStorage logic here to save data if needed
  };

  // Handle Hold button
  const handleHold = () => {
    const dataToHold = { formFields };
    localStorage.setItem("holdData", JSON.stringify(dataToHold));

    // Clear all form fields
    setFormFields({
      invoiceNumber: formFields.invoiceNumber + 1, // ইনভয়েস নম্বর ঠিক রাখতে চাইলে
      phoneNumber: "",
      membershipId: "",
      discountAmount: 0,
      discountType: "",
      vatAmount: 0,
      salesPerson: "",
      products: [],
      payment: [],
      receivedAmount: 0,
      paymentSummary: {
        id: 0,
        totalPrice: 0,
        vat: 0,
        discount: 0,
        quantity: 0,
        numberOfItems: 0,
        totalPayable: 0,
      },
    });
    setIsHolding(true);
  };

  // Handle Hold List button (Retrieve saved data from localStorage)
  const handleHoldList = () => {
    const heldData = JSON.parse(localStorage.getItem("holdData"));
    if (heldData) {
      setFormFields(heldData.formFields); // Populate form fields from saved data
    }
  };

  // Handle Clear button
  const handleClear = () => {
    clear(); // Call the clearForm function from the context
  };

  return (
    <div className="flex gap-4 mt-4">
      <button onClick={handleAdd} className="btn btn-primary">
        Add
      </button>
      <button onClick={handleHold} className="btn btn-secondary">
        Hold
      </button>
      <button onClick={handleHoldList} className="btn btn-info">
        Hold List
      </button>
      <button onClick={handleClear} className="btn btn-warning">
        Clear
      </button>
    </div>
  );
};

export default ActionButtons;
