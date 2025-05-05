// import React, { useContext } from "react";
// import { FiSearch } from "react-icons/fi";
// import { ProductCustomerContext } from "../context/ContextProvider";

// const ProductCustomerNavigation = () => {
//   const {
//     invoiceNumber,
//     salesPersons,
//     selectedSalesPerson,
//     loading,
//     selectedBarcode,
//     barcodeOptions,
//     setSelectedBarcode,
//     setSelectedSalesPerson,
//     getSalesPerson,
//     phone,
//     membershipId,
//     discountAmount,
//     setPhone,
//     setMembershipId,
//     setdiscountAmount,
//     vatAmount,
//     setvatAmount,
//   } = useContext(ProductCustomerContext);

//   return (
//     <div className="border-2 p-4 rounded-md gap-4">
//       <div>
//         <h2 className="text-lg font-semibold mb-2">
//           Product & Customer Navigation
//         </h2>
//         <div className="grid grid-cols-4 gap-4">
//           {/* Invoice Number */}
//           <div className="form-control">
//             <label htmlFor="invoiceNumber" className="label">
//               <span className="label-text">Invoice Number</span>
//             </label>
//             <input
//               type="text"
//               id="invoiceNumber"
//               className="input input-bordered"
//               value={invoiceNumber}
//               readOnly
//             />
//           </div>

//           {/* Product Barcode */}
//           <div className="form-control">
//             <label htmlFor="productBarcode" className="label">
//               <span className="label-text">Product Barcode #</span>
//             </label>
//             <div className="relative">
//               <select
//                 id="productBarcode"
//                 className="input input-bordered pr-10"
//                 value={selectedBarcode}
//                 onChange={(e) => setSelectedBarcode(e.target.value)}
//               >
//                 <option value="">Select Barcode</option>
//                 {barcodeOptions.map((barcode) => (
//                   <option key={barcode} value={barcode}>
//                     {barcode}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Select Sales Person */}
//           <div className="form-control">
//             <label htmlFor="selectSalesRep" className="label">
//               <span className="label-text">Select Sales Person</span>
//             </label>
//             <select
//               id="selectSalesRep"
//               className="select select-bordered w-full"
//               value={selectedSalesPerson}
//               onClick={() => {
//                 if (salesPersons.length === 0 && !loading) {
//                   getSalesPerson();
//                 }
//               }}
//               onChange={(e) => setSelectedSalesPerson(e.target.value)}
//             >
//               {loading || salesPersons.length === 0 ? (
//                 <option disabled>Loading...</option>
//               ) : (
//                 <>
//                   <option value="">Select Sales Person</option>
//                   {salesPersons?.map((salesPerson) => (
//                     <option key={salesPerson._id} value={salesPerson._id}>
//                       {salesPerson.firstName}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </select>
//           </div>

//           {/* Select Discount Type */}
//           <div className="form-control">
//             <label htmlFor="selectDiscountType" className="label">
//               <span className="label-text">Select Discount Type</span>
//             </label>
//             <select
//               id="selectDiscountType"
//               className="select select-bordered w-full"
//             >
//               <option>Fixed</option>
//               <option>Percentage</option>
//             </select>
//           </div>

//           {/* Phone */}
//           <div className="form-control">
//             <label htmlFor="phone" className="label">
//               <span className="label-text">Phone</span>
//             </label>
//             <input
//               type="text"
//               id="phone"
//               className="input input-bordered"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />
//           </div>

//           {/* Membership ID */}
//           <div className="form-control">
//             <label htmlFor="membershipId" className="label">
//               <span className="label-text">Membership ID</span>
//             </label>
//             <input
//               type="text"
//               id="membershipId"
//               className="input input-bordered"
//               value={membershipId}
//               onChange={(e) => setMembershipId(e.target.value)}
//             />
//           </div>

//           {/* Discount Amount */}
//           <div className="form-control">
//             <label htmlFor="enterDiscountAmount" className="label">
//               <span className="label-text">Enter The Discount Amount</span>
//             </label>
//             <input
//               type="number"
//               id="enterDiscountAmount"
//               className="input input-bordered"
//               value={discountAmount}
//               onChange={(e) => setdiscountAmount(e.target.value)}
//             />
//           </div>

//           {/* VAT Amount */}
//           <div className="form-control">
//             <label htmlFor="enterVatAmount" className="label">
//               <span className="label-text">Enter The VAT Amount</span>
//             </label>
//             <input
//               type="number"
//               id="enterVatAmount"
//               className="input input-bordered"
//               value={vatAmount}
//               onChange={(e) => setvatAmount(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCustomerNavigation;
