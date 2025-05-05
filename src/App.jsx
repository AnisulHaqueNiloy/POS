import React from "react";
import CustomerInformation from "./Components/CustomerInformation";
import ProductInformation from "./Components/ProductsInformation";
import PaymentInformation from "./Components/PaymentInformation";
import ActionButtons from "./Components/ActionButtons";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2">
        <div className="w-9/12 flex flex-col gap-3">
          <CustomerInformation></CustomerInformation>
          <ProductInformation></ProductInformation>
        </div>
        <div className="flex flex-col gap-3">
          <PaymentInformation></PaymentInformation>
          <ActionButtons></ActionButtons>
        </div>
      </div>
    </div>
  );
};

export default App;
