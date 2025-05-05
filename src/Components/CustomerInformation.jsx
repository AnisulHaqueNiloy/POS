// 📁 src/components/CustomerInfo.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "../context/FormProvider";

const CustomerInformation = () => {
  const { formFields, updateField, setSalesPerson, addProductByBarcode } =
    useForm();
  const [salesOptions, setSalesOptions] = useState([]);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    const fetchSalesPersons = async () => {
      try {
        const res = await fetch(
          "https://front-end-task-lake.vercel.app/api/v1/employee/get-employee-all",
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
            },
          }
        );
        const data = await res.json();
        setSalesOptions(data.data);
      } catch (error) {
        console.error("Failed to fetch salespersons:", error);
      }
    };
    fetchSalesPersons();
  }, []);
  console.log(salesOptions);
  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    await addProductByBarcode(barcode); // only sending barcode, context does the rest
    setBarcode("");
  };

  console.log(barcode);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1 md:col-span-2">
        <p className="font-semibold">
          Invoice Number: {formFields.invoiceNumber}
        </p>
      </div>
      <input
        type="text"
        placeholder="Phone Number"
        value={formFields.phoneNumber || ""}
        onChange={(e) => updateField("phoneNumber", e.target.value)}
        className="input input-bordered"
      />
      <input
        type="text"
        placeholder="Membership ID"
        value={formFields.membershipId || ""}
        onChange={(e) => updateField("membershipId", e.target.value)}
        className="input input-bordered"
      />
      <input
        type="number"
        placeholder="Discount Amount"
        value={formFields.discountAmount || ""}
        onChange={(e) => updateField("discountAmount", Number(e.target.value))}
        className="input input-bordered"
      />
      <input
        type="number"
        placeholder="VAT Amount"
        value={formFields.vatAmount || ""}
        onChange={(e) => updateField("vatAmount", Number(e.target.value))}
        className="input input-bordered"
      />
      <select
        className="select select-bordered"
        value={formFields.salesPerson || ""}
        onChange={(e) => setSalesPerson(e.target.value)}
      >
        <option value="">Select Sales Person</option>
        {salesOptions?.map((person) => (
          <option key={person.id} value={person.firstname}>
            {person.firstName}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Discount Type"
        value={formFields.discountType || ""}
        onChange={(e) => updateField("discountType", e.target.value)}
        className="input input-bordered"
      />

      {/* Barcode Input */}
      <form
        onSubmit={handleBarcodeSubmit}
        className="col-span-1 md:col-span-2 flex gap-2"
      >
        <input
          type="text"
          placeholder="Enter Barcode"
          value={barcode || ""}
          onChange={(e) => setBarcode(e.target.value)}
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </div>
  );
};

export default CustomerInformation;
