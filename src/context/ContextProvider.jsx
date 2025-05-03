import React, { createContext, useState, useEffect, useContext } from "react";
import { generateInvoiceNumber } from "../utils/invoiceGenerator";
import apiRequest from "../utils/api/apiRequest";

export const ProductCustomerContext = createContext();

export const ContextProvider = ({ children }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(() =>
    generateInvoiceNumber()
  );
  const [salesPersons, setSalesPersons] = useState([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [paymentArray, setpaymentArray] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [productData, setProductData] = useState([]);
  const [phone, setPhone] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [discountAmount, setdiscountAmount] = useState("");
  const [vatAmount, setvatAmount] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalReceivedAmount, setReceiveAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [items, setItems] = useState(0);
  console.log(productData);
  const barcodeOptions = [
    "01007-00025",

    "01007-00026",
    "01007-00143",
    "01007-00144",
    "01004-00015",
    "01004-00016",
  ];
  console.log(grandTotal);
  console.log(totalReceivedAmount);
  //  payment information all states are managed from here
  console.log(paymentMethod);
  useEffect(() => {
    const receiveAmount = paymentArray.reduce((total, item) => {
      return total + Number(item.amount);
    }, 0);

    const received = Number(totalReceivedAmount) || 0;
    const total = Number(grandTotal) || 0;

    const change = received - total;
    setChangeAmount(change);

    const numberOfItems = productData.length; // Total number of products
    const totalQuantity = productData.reduce((total, product) => {
      return total + product.SKUS.length; // Total quantity (based on SKUs length)
    }, 0);
    const calculatedSubtotal = productData.reduce((total, product) => {
      const price = product.discount
        ? product.discountPrice
        : product.sellPrice;
      return total + price * product.SKUS.length;
    }, 0);

    const vat = (calculatedSubtotal * parseFloat(vatAmount || 0)) / 100;
    const discount =
      (calculatedSubtotal * (parseFloat(discountAmount) || 0)) / 100;
    const calculatedGrandTotal = calculatedSubtotal + vat - discount;
    setReceiveAmount(receiveAmount);
    setSubtotal(calculatedSubtotal);
    setGrandTotal(calculatedGrandTotal);
    setItems(numberOfItems);
    setQuantity(totalQuantity);
  }, [
    productData,
    vatAmount,
    discountAmount,
    grandTotal,
    paymentArray,
    changeAmount,
    totalReceivedAmount,
  ]);
  console.log(totalReceivedAmount);
  // product data and barcode sates are managed from here
  useEffect(() => {
    if (selectedBarcode) {
      const fetchProduct = async () => {
        try {
          const data = await apiRequest(
            `/purchase/get-purchase-single?search=${selectedBarcode}`
          );

          const incomingSku = data.data[0].sku;

          // checking the same product is added or not
          const isDuplicateSku = productData.some((product) =>
            product.SKUS.includes(incomingSku)
          );

          if (isDuplicateSku) {
            alert("This SKU already exists in the product data.");
            return;
          }

          // Check if the product itself already exists
          const existingProductIndex = productData.findIndex(
            (product) => product.id === data.data[0].id
          );

          if (existingProductIndex !== -1) {
            // Add SKU to existing product
            const updatedProducts = [...productData];
            updatedProducts[existingProductIndex].SKUS.push(incomingSku);
            setProductData(updatedProducts);
          } else {
            // Create new product with SKUS array
            const newProduct = {
              ...data.data[0],
              SKUS: [incomingSku],
            };
            setProductData((prev) => [...prev, newProduct]);
          }
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      };

      fetchProduct();
    } else {
      setProductData([]);
    }
  }, [selectedBarcode]);

  // delete product quantity from cart
  const handleDeleteProduct = (skuID) => {
    const updatedProducts = productData.map((product) => {
      if (product.SKUS.length > 1) {
        const filteredSkus = product.SKUS.filter((sku) => sku !== skuID);
        return { ...product, SKUS: filteredSkus };
      }

      return product;
    });

    setProductData(updatedProducts);
  };

  console.log("Product data:", productData);

  //   sell person name api call
  const getSalesPerson = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/employee/get-employee-all");
      setSalesPersons(data.data);
    } catch (error) {
      console.error("Error fetching sales persons:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPayment = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/account/get-accounts?type=All");
      setPaymentMethod(data.data);
    } catch (error) {
      console.error("Error fetching sales persons:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(salesPersons);
  const contextValue = {
    handleDeleteProduct,
    invoiceNumber,
    salesPersons,
    selectedSalesPerson,
    loading,
    selectedBarcode,
    productData,
    barcodeOptions,
    phone,
    membershipId,
    discountAmount,
    vatAmount,
    subtotal,
    grandTotal,
    items,
    quantity,
    paymentMethod,
    paymentArray,
    totalReceivedAmount,
    changeAmount,
    paymentArray,
    setpaymentArray,
    setPaymentMethod,
    getPayment,
    setSubtotal,
    setGrandTotal,
    setItems,
    setQuantity,
    setInvoiceNumber,
    setvatAmount,
    setPhone,
    setMembershipId,
    setdiscountAmount,
    selectedPaymentMethods,
    setSelectedPaymentMethods,
    setSalesPersons,
    setSelectedSalesPerson,
    setLoading,
    setSelectedBarcode,
    setProductData,
    getSalesPerson,
  };

  return (
    <ProductCustomerContext.Provider value={contextValue}>
      {children}
    </ProductCustomerContext.Provider>
  );
};

export default ContextProvider;
