import React from "react";
import { useForm } from "../context/FormProvider";

const ProductInformation = () => {
  const { formFields, removeSKU, removeProduct } = useForm();

  return (
    <div className="border-2 min-h-[400px] p-4">
      <div className="grid gap-4">
        {formFields?.products?.map((product) => {
          const pricePerUnit = product.productdiscount
            ? product.sellprice - product.productdiscount
            : product.sellprice;
          const subtotal = pricePerUnit * product.skuList.length;

          return (
            <div
              key={product.id}
              className="card bg-base-100 shadow-md p-4 relative"
            >
              {/* ❌ Delete Button at Top-Right */}
              <button
                onClick={() => removeProduct(product.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                title="Delete this product"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold">{product.name}</h2>
              <p>Size: {product.size}</p>
              <p>Color: {product.color}</p>
              <p>Available Stock: {product.availableStock}</p>

              {/* ✅ Price and Subtotal Display */}
              <div className="relative">
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold ">Price per Unit:</span> ৳
                  {pricePerUnit}
                </p>
                {product.productdiscount ? (
                  <span className="absolute top-0 left-32   ">
                    {product.sellprice}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Subtotal:</span> ৳{subtotal}
              </p>

              {/* SKU Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {product.skuList.map((sku) => (
                  <div
                    key={sku}
                    className="badge badge-info cursor-pointer"
                    onClick={() => removeSKU(product.name, sku)}
                  >
                    {sku} ❌
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductInformation;
