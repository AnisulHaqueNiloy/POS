import React from "react";

const CustomerInformation = () => {
  return (
    <div className="border-2 p-4 rounded-md gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Customer's Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* First Row (2 Input Fields) */}
          <div className="form-control">
            <label htmlFor="customerName" className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              id="customerName"
              className="input input-bordered"
              defaultValue="N/A"
              readOnly
            />
          </div>
          <div className="form-control">
            <label htmlFor="customerPhone" className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              id="customerPhone"
              className="input input-bordered"
              defaultValue="0165271276"
              readOnly
            />
          </div>

          {/* Second Row (The remaining 2 Input Fields will automatically go here) */}
          <div className="form-control">
            <label htmlFor="customerMembership" className="label">
              <span className="label-text">Membership</span>
            </label>
            <input
              type="text"
              id="customerMembership"
              className="input input-bordered"
              defaultValue="Not Found"
              readOnly
            />
          </div>
          <div className="form-control">
            <label htmlFor="customerDiscount" className="label">
              <span className="label-text">Discount</span>
            </label>
            <input
              type="text"
              id="customerDiscount"
              className="input input-bordered"
              defaultValue="Not Found"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformation;
