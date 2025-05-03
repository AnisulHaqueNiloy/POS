import React, { useContext } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { ProductCustomerContext } from "../context/ContextProvider";

const ProductItem = ({ product, handleDeleteProduct }) => (
  <div className="bg-white border-2 rounded-md shadow-sm p-4 flex items-center justify-between relative">
    <div>
      <h3 className="text-sm font-semibold">{product.productName}</h3>
      <p className="text-xs text-gray-500">Size: {product.size}</p>
      <p className="text-xs text-gray-500">
        Color: {product.color ? product.color : "Not found"}
      </p>
      <p className="text-xs text-gray-500">
        Available Stock: {product.stock} Units
      </p>
      <div className="text-xs flex  gap-2 text-gray-500">
        SKU:{" "}
        {product.SKUS.map((sku, id) => (
          <p
            onClick={() => handleDeleteProduct(sku)}
            key={id}
            className="text-green-500 cursor-pointer"
          >
            {sku.split("-")[1]}
          </p>
        ))}
      </div>
    </div>
    <div className="flex justify-start border-2 relative rounded-md">
      <p className="w-[160px]  py-2 px-4  text-start ">
        {product.discount
          ? product.sellPrice - product.discount
          : product.sellPrice}{" "}
      </p>
      <span className="absolute right-22 text-xs">
        {product.discount ? product.sellPrice : ""}
      </span>
    </div>

    <div className="flex flex-col items-center">
      <p>SubTotal</p>
      <p className="font-bold">
        {product.discount
          ? product.discountPrice * product.SKUS.length
          : product.sellPrice * product.SKUS.length}{" "}
        .00 &#x9F3;
      </p>
    </div>
    <div></div>
    <FiDelete className="top-0 right-0"></FiDelete>
  </div>
);

const ProductsInformation = () => {
  const { productData, handleDeleteProduct } = useContext(
    ProductCustomerContext
  );

  console.log("Product data:", productData);

  return (
    <div className="border-2 p-4 rounded-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Products Information</h2>
      <div className="space-y-2">
        {productData?.map((product, index) => (
          <ProductItem
            key={index}
            product={product}
            handleDeleteProduct={handleDeleteProduct}
          />
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <AiOutlinePlus className="inline-block mr-2" /> Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductsInformation;
