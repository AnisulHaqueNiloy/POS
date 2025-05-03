import React from "react";
import ProductCustomerNavigation from "./components/ProductCustomerNavigation";
import ProductsInformation from "./components/ProductsInformation";
import PaymentInformation from "./components/PaymentInformation";
import AdditionInformation from "./components/AdditionInformation";
import ActionButtons from "./components/ActionButtons";
import CustomerInformation from "./Components/CustomerInformation";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2">
        <div className="w-9/12 flex flex-col gap-3">
          <ProductCustomerNavigation />
          <ProductsInformation />
        </div>
        <div className="flex flex-col gap-3">
          <CustomerInformation />
          <PaymentInformation />

          <AdditionInformation />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};

export default App;
