function RentalInfo() {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-gray-800 font-semibold text-xl">Rental Info</h3>
      <div className="flex justify-between">
        <h4 className="text-gray-500 text-sm">
          Please select your rental date
        </h4>
        <h4 className="text-gray-500 text-sm">Step 2 of 4</h4>
      </div>
      <div className="py-4">
        <div className="flex items-center">
          <input type="checkbox" id="pickup" className="w-4 h-4" />
          <label htmlFor="pickup" className="ms-2 text-base font-semibold">
            Pick - Up
          </label>
        </div>
        <div className="my-4">
          <div className="md:flex">
            <div className="flex-1 md:pe-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Locations
                </label>
                <select className="bg-gray-100 p-2 w-full focus:outline-none text-gray-600 rounded-md my-3">
                  <option value="">Select your city</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Cairo">Cairo</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Time
                </label>
                <select className="bg-gray-100 p-2 w-full focus:outline-none text-gray-600 rounded-md my-3">
                  <option value="">Select your time</option>
                  <option value="9 AM">9 AM</option>
                  <option value="10 AM">10 AM</option>
                  <option value="11 AM">11 AM</option>
                  <option value="12 PM">12 PM</option>
                </select>
              </div>
            </div>
            <div className="flex-1 md:ps-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Date
                </label>
                <select className="bg-gray-100 p-2 w-full focus:outline-none text-gray-600 rounded-md my-3">
                  <option value="">Select your date</option>
                  <option value="1">Today</option>
                  <option value="2">Tomorrow</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Drop-Off */}
        <div className="flex items-center mt-8">
          <input type="checkbox" id="dropoff" className="w-4 h-4" />
          <label htmlFor="dropoff" className="ms-2 text-base font-semibold">
            Drop - Off
          </label>
        </div>
        <div className="my-4">
          <div className="md:flex">
            <div className="flex-1 md:pe-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Locations
                </label>
                <select className="bg-gray-100 p-2 w-full focus:outline-none text-gray-600 rounded-md my-3">
                  <option value="">Select your city</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Cairo">Cairo</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Time
                </label>
                <select className="bg-gray-100 p-2 w-full focus:outline-none text-gray-600 rounded-md my-3">
                  <option value="">Select your time</option>
                  <option value="9 AM">9 AM</option>
                  <option value="10 AM">10 AM</option>
                  <option value="11 AM">11 AM</option>
                  <option value="12 PM">12 PM</option>
                </select>
              </div>
            </div>
            <div className="flex-1 md:ps-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Date
                </label>
                <select className="bg-gray-100 p-2 w-full focus:outline-none text-gray-600 rounded-md my-3">
                  <option value="">Select your date</option>
                  <option value="1">Today</option>
                  <option value="2">Tomorrow</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentalInfo;
