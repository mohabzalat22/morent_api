function PaymentMethod() {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-gray-800 font-semibold text-xl">Payment Method</h3>
      <div className="flex justify-between">
        <h4 className="text-gray-500 text-sm">
          Please enter your payment method
        </h4>
        <h4 className="text-gray-500 text-sm">Step 3 of 4</h4>
      </div>
      <div className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <input type="radio" name="payment" id="creditCard" defaultChecked />
            <label
              htmlFor="creditCard"
              className="ms-2 text-base font-semibold"
            >
              Credit Card
            </label>
          </div>
          <div className="flex">
            {/* Visa Logo */}
            <svg
              className="w-12 h-4"
              viewBox="0 0 48 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_visa)">
                <path
                  d="M20.7995 15.7692H16.9111L19.3432 0.280756H23.2313L20.7995 15.7692Z"
                  fill="#00579F"
                />
                <path
                  d="M34.8949 0.659404C34.1279 0.346018 32.9115 0 31.4074 0C27.5675 0 24.8635 2.10895 24.8469 5.12412C24.815 7.3487 26.7829 8.58429 28.2547 9.32604C29.7591 10.084 30.2704 10.5787 30.2704 11.2543C30.2551 12.2919 29.0548 12.7702 27.9354 12.7702C26.383 12.7702 25.5512 12.5236 24.2871 11.9464L23.7751 11.6989L23.231 15.1757C24.1429 15.6036 25.8231 15.9834 27.5675 16C31.6474 16 34.3036 13.9237 34.335 10.7105C34.3506 8.94739 33.3115 7.59639 31.0712 6.49242C29.7112 5.78374 28.8784 5.30589 28.8784 4.58079C28.8943 3.9216 29.5828 3.24643 31.118 3.24643C32.3821 3.21336 33.3108 3.52631 34.0144 3.83948L34.3661 4.00394L34.8949 0.659404Z"
                  fill="#00579F"
                />
                <path
                  d="M40.0637 10.2822C40.384 9.39239 41.6161 5.94865 41.6161 5.94865C41.6 5.98172 41.9357 5.04243 42.1277 4.46581L42.3995 5.80039C42.3995 5.80039 43.1358 9.5078 43.2957 10.2822C42.688 10.2822 40.8318 10.2822 40.0637 10.2822ZM44.8634 0.280756H41.8558C40.9283 0.280756 40.2236 0.560636 39.8235 1.56584L34.0479 15.769H38.1278C38.1278 15.769 38.7995 13.8573 38.9438 13.4456C39.3914 13.4456 43.3603 13.4456 43.9361 13.4456C44.0478 13.9894 44.4001 15.769 44.4001 15.769H48.0003L44.8634 0.280756Z"
                  fill="#00579F"
                />
                <path
                  d="M13.6634 0.280756L9.85548 10.8424L9.43936 8.70036C8.73535 6.22875 6.52742 3.54339 4.06348 2.20816L7.55143 15.7528H11.6632L17.775 0.280756H13.6634Z"
                  fill="#00579F"
                />
                <path
                  d="M6.31995 0.280756H0.0640009L0 0.593704C4.88003 1.879 8.11199 4.97717 9.43985 8.70101L8.07988 1.5827C7.85598 0.593485 7.16792 0.313387 6.31995 0.280756Z"
                  fill="#F4A622"
                />
              </g>
              <defs>
                <clipPath id="clip0_visa">
                  <rect width="48" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {/* Mastercard Logo */}
            <svg
              className="w-8 h-5 ms-2"
              viewBox="0 0 32 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.3255 2.13892H11.6733V17.8611H20.3255V2.13892Z"
                fill="#FF5F00"
              />
              <path
                d="M12.2229 9.99998C12.2229 6.80554 13.7062 3.9722 15.9859 2.13887C14.3104 0.805537 12.1955 -1.90735e-05 9.88821 -1.90735e-05C4.42223 -1.90735e-05 0 4.4722 0 9.99998C0 15.5278 4.42223 20 9.88821 20C12.1955 20 14.3104 19.1944 15.9859 17.8611C13.7062 16.0555 12.2229 13.1944 12.2229 9.99998Z"
                fill="#EB001B"
              />
              <path
                d="M32.0001 10C32.0001 15.5278 27.5779 20 22.1119 20C19.8046 20 17.6897 19.1944 16.0142 17.8611C18.3214 16.0278 19.7772 13.1944 19.7772 10C19.7772 6.80556 18.2939 3.97222 16.0142 2.13889C17.6897 0.805556 19.8046 0 22.1119 0C27.5779 0 32.0001 4.5 32.0001 10Z"
                fill="#F79E1B"
              />
            </svg>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-md my-4">
          <div className="md:flex">
            <div className="md:pe-2 flex-1">
              <label className="text-sm font-semibold text-gray-800">
                Card Number
              </label>
              <input
                type="text"
                className="w-full bg-white p-2 focus:ring-0 focus:outline-none rounded-md my-3"
                placeholder="Card number"
              />
            </div>
            <div className="md:ps-2 flex-1">
              <label className="text-sm font-semibold text-gray-800">
                Expration Date
              </label>
              <input
                type="text"
                className="w-full bg-white p-2 focus:ring-0 focus:outline-none rounded-md my-3"
                placeholder="DD / MM / YY"
              />
            </div>
          </div>
          <div className="md:flex mt-2">
            <div className="md:pe-2 flex-1">
              <label className="text-sm font-semibold text-gray-800">
                Card Holder
              </label>
              <input
                type="text"
                className="w-full bg-white p-2 focus:ring-0 focus:outline-none rounded-md my-3"
                placeholder="Card holder"
              />
            </div>
            <div className="md:ps-2 flex-1">
              <label className="text-sm font-semibold text-gray-800">CVC</label>
              <input
                type="text"
                className="w-full bg-white p-2 focus:ring-0 focus:outline-none rounded-md my-3"
                placeholder="CVC"
              />
            </div>
          </div>
        </div>

        {/* PayPal */}
        <div className="bg-gray-100 p-4 rounded-md my-4 flex justify-between">
          <div>
            <input type="radio" name="payment" id="paypal" />
            <label htmlFor="paypal" className="font-semibold ms-4">
              PayPal
            </label>
          </div>
          <div>
            <span className="text-blue-600 font-bold text-lg">PayPal</span>
          </div>
        </div>

        {/* Bitcoin */}
        <div className="bg-gray-100 p-4 rounded-md my-4 flex justify-between">
          <div>
            <input type="radio" name="payment" id="bitcoin" />
            <label htmlFor="bitcoin" className="font-semibold ms-4">
              Bitcoin
            </label>
          </div>
          <div>
            <span className="text-orange-500 font-bold text-lg">₿itcoin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;
