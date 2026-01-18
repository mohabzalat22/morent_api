function Footer() {
  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <div className="px-8 py-4 md:px-30 md:py-20">
          <div className="md:flex justify-between pb-6 border-b">
            <div>
              <h1 className="text-blue-500 text-2xl font-bold">MORENT</h1>
              <p className="text-sm text-gray-700 max-w-xs mt-3">
                Our vision is to provide convenience and help increase your
                sales business.
              </p>
            </div>
            <div className="flex flex-wrap mt-4 md:mt-0 justify-between">
              <div className="md:mx-4">
                <h2 className="font-semibold text-gray-800">About</h2>
                <ul className="mt-4">
                  <li className="text-sm text-gray-700 my-2">How it works</li>
                  <li className="text-sm text-gray-700 my-2">Featured</li>
                  <li className="text-sm text-gray-700 my-2">Partnership</li>
                  <li className="text-sm text-gray-700 my-2">
                    Bussiness Relation
                  </li>
                </ul>
              </div>
              <div className="md:mx-4">
                <h2 className="font-semibold text-gray-800">Community</h2>
                <ul className="mt-4">
                  <li className="text-sm text-gray-700 my-2">Events</li>
                  <li className="text-sm text-gray-700 my-2">Blog</li>
                  <li className="text-sm text-gray-700 my-2">Podcast</li>
                  <li className="text-sm text-gray-700 my-2">
                    Invite a friend
                  </li>
                </ul>
              </div>
              <div className="md:mx-4">
                <h2 className="font-semibold text-gray-800">Socials</h2>
                <ul className="mt-4">
                  <li className="text-sm text-gray-700 my-2">Discord</li>
                  <li className="text-sm text-gray-700 my-2">Instagram</li>
                  <li className="text-sm text-gray-700 my-2">Twitter</li>
                  <li className="text-sm text-gray-700 my-2">Facebook</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Copyright */}
          <div className="mt-6">
            <div className="md:flex justify-between">
              <div className="mt-6 md:mt-0">
                <p className="text-gray-800 text-sm">
                  ©2022 MORENT. All rights reserved
                </p>
              </div>
              <div className="flex">
                <p className="text-gray-800 text-sm font-semibold">
                  Privacy & Policy
                </p>
                <p className="text-gray-800 text-sm font-semibold ms-10">
                  Terms & Condition
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
