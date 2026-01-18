function BillingInfo() {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-gray-800 font-semibold text-xl">Billing Info</h3>
      <div className="flex justify-between">
        <h4 className="text-gray-500 text-sm">
          Please enter your billing info
        </h4>
        <h4 className="text-gray-500 text-sm">Step 1 of 4</h4>
      </div>
      <div className="py-4">
        <div className="md:flex">
          <div className="md:pe-2 flex-1">
            <label className="text-sm font-semibold text-gray-800">Name</label>
            <input
              type="text"
              className="w-full bg-gray-100 p-2 focus:ring-0 focus:outline-none rounded-md my-3"
              placeholder="Your name"
            />
          </div>
          <div className="md:ps-2 flex-1">
            <label className="text-sm font-semibold text-gray-800">
              Phone Number
            </label>
            <input
              type="text"
              className="w-full bg-gray-100 p-2 focus:ring-0 focus:outline-none rounded-md my-3"
              placeholder="Phone number"
            />
          </div>
        </div>
        <div className="md:flex mt-2">
          <div className="md:pe-2 flex-1">
            <label className="text-sm font-semibold text-gray-800">
              Address
            </label>
            <input
              type="text"
              className="w-full bg-gray-100 p-2 focus:ring-0 focus:outline-none rounded-md my-3"
              placeholder="Address"
            />
          </div>
          <div className="md:ps-2 flex-1">
            <label className="text-sm font-semibold text-gray-800">
              Town / City
            </label>
            <input
              type="text"
              className="w-full bg-gray-100 p-2 focus:ring-0 focus:outline-none rounded-md my-3"
              placeholder="Town or city"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingInfo;
