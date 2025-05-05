import React, { createContext, useContext, useEffect, useState } from "react";

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [invoiceCounter, setInvoiceCounter] = useState(1);
  const [heldInvoices, setHeldInvoices] = useState(() => {
    const held = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("held-invoice-")) {
        held.push(key.replace("held-invoice-", ""));
      }
    }
    return held;
  });

  const generateInvoiceNumber = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const counter = String(invoiceCounter).padStart(4, "0");
    return Number(`${day}${month}${year}${counter}`);
  };

  const [formFields, setFormFields] = useState({
    invoiceNumber: generateInvoiceNumber(),
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

  const updateField = (field, value) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
    recalculatePayment(formFields.products);
  }, [formFields.vatAmount, formFields.discountAmount, formFields.products]);
  const setSalesPerson = (salesPerson) =>
    updateField("salesPerson", salesPerson);

  const addProductByBarcode = async (barcode) => {
    const res = await fetch(
      `https://front-end-task-lake.vercel.app/api/v1/purchase/get-purchase-single?search=${barcode}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
      }
    );
    const data = await res.json();
    const products = data.data;

    if (!Array.isArray(products) || products.length === 0) return;

    const updatedProducts = [...formFields.products];

    products.forEach((product) => {
      const existingProduct = updatedProducts.find((p) =>
        p.skuList.includes(product.sku)
      );

      if (existingProduct) {
        return;
      }

      const sameNameProduct = updatedProducts.find((p) => p.id === product.id);

      if (sameNameProduct) {
        sameNameProduct.skuList.push(product.sku);
        sameNameProduct.skuData[product.sku] = product;
      } else {
        updatedProducts.push({
          id: product.id,
          name: product.productName,
          size: product.size,
          color: product.color || null,
          availableStock: product.stock,
          productdiscount: product.discount,
          discPrice: product.discountPrice,
          sellprice: product.sellPrice,
          skuList: [product.sku],
          skuData: { [product.sku]: product },
        });
      }
    });

    recalculatePayment(updatedProducts);
    setFormFields((prev) => ({ ...prev, products: updatedProducts }));
  };
  console.log(formFields);
  const removeSKU = (productName, sku) => {
    setFormFields((prev) => {
      const updatedProducts = prev.products
        .map((product) => {
          if (product.name !== productName) return product;

          const updatedSkuList = product.skuList.filter((s) => s !== sku);
          const { [sku]: removed, ...updatedSkuData } = product.skuData;

          if (updatedSkuList.length === 0) return null;

          return {
            ...product,
            skuList: updatedSkuList,
            skuData: updatedSkuData,
          };
        })
        .filter(Boolean);

      recalculatePayment(updatedProducts);

      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const removeProduct = (productId) => {
    setFormFields((prev) => {
      const updatedProducts = prev.products.filter(
        (product) => product.id !== productId
      );
      recalculatePayment(updatedProducts);
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };

  const recalculatePayment = (updatedProducts) => {
    let total = 0;
    let qty = 0;
    let receivedAmount = formFields.receivedAmount || 0;
    let changeAmount = 0;

    updatedProducts?.forEach((p) => {
      const priceToUse = p.productdiscount ? p.discPrice : p.sellprice;
      const productTotal = priceToUse * p.skuList.length || 0;
      total += productTotal;
      qty += p.skuList.length;
    });

    const vat = formFields.vatAmount || 0;
    const discount = formFields.discountAmount || 0;
    const payable = total - discount + vat;

    if (receivedAmount >= payable) {
      changeAmount = receivedAmount - payable;
    }

    const updatedPaymentSummary = {
      totalPrice: total,
      vat,
      discount,
      quantity: qty,
      numberOfItems: updatedProducts.length,
      totalPayable: payable,
      receivedAmount,
      changeAmount,
    };

    setFormFields((prev) => ({
      ...prev,
      paymentSummary: updatedPaymentSummary,
    }));
  };
  const clearForm = () => {
    setInvoiceCounter((prevCounter) => prevCounter + 1);
    setFormFields({
      invoiceNumber: generateInvoiceNumber(),
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
        totalPrice: 0,
        vat: 0,
        discount: 0,
        quantity: 0,
        numberOfItems: 0,
        totalPayable: 0,
      },
    });
  };
  const clear = () => {
    setFormFields({
      invoiceNumber: formFields.invoiceNumber, // Keep invoice number
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
        totalPrice: 0,
        vat: 0,
        discount: 0,
        quantity: 0,
        numberOfItems: 0,
        totalPayable: 0,
      },
    });
  };

  const holdInvoice = () => {
    localStorage.setItem(
      `held-invoice-${formFields.invoiceNumber}`,
      JSON.stringify(formFields)
    );
    setHeldInvoices((prev) => {
      if (!prev.includes(formFields.invoiceNumber.toString())) {
        return [...prev, formFields.invoiceNumber.toString()];
      }
      return prev;
    });
    clear();
  };

  const restoreInvoice = (invoiceNo) => {
    const saved = localStorage.getItem(`held-invoice-${invoiceNo}`);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormFields(parsedData);
      } catch (error) {
        console.error("Error parsing held invoice data:", error);
        // Handle the error, e.g., show a message to the user
        alert("Failed to restore invoice.  The data may be corrupted.");
      }
    }
  };

  const getHeldInvoiceNumbers = () => {
    const numbers = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("held-invoice-")) {
        numbers.push(key.replace("held-invoice-", ""));
      }
    }
    return numbers.sort((a, b) => parseInt(b) - parseInt(a));
  };

  useEffect(() => {
    const held = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("held-invoice-")) {
        held.push(key.replace("held-invoice-", ""));
      }
    }
    setHeldInvoices(held);
  }, []);

  const value = {
    formFields,
    updateField,
    addProductByBarcode,
    removeSKU,
    clearForm,
    holdInvoice,
    restoreInvoice,
    setSalesPerson,
    setFormFields,
    removeProduct,
    clear,
    heldInvoices,
    getHeldInvoiceNumbers,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
