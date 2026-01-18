function Hero() {
  return (
    <div className="container mx-auto select-none">
      <div className="px-8 py-4 md:px-16 md:py-8">
        <div className="flex flex-nowrap w-full">
          <div className="relative w-full xl:w-1/2 h-60 md:h-80 bg-blue-400 m-2 -z-10">
            <div className="absolute ps-6 pt-6 w-60 md:w-[320px]">
              <h1 className="text-base md:text-2xl text-white leading-9">
                The Best Platform for Car Rental
              </h1>
              <p className="text-white mt-3 text-justify text-sm">
                Ease of doing a car rental safely and reliably. Of course at a
                low price.
              </p>
              <button className="bg-blue-600 text-white text-lg px-3 py-2 mt-3">
                Rental Car
              </button>
            </div>
            <img
              src="/src/assets/images/BG.png"
              alt=""
              className="mt-6 md:m-0"
            />
          </div>
          <div className="hidden xl:block w-1/2 h-60 md:h-80 bg-blue-700 m-2">
            <div className="absolute ps-6 pt-6 w-60 md:w-[320px]">
              <h1 className="text-base md:text-2xl text-white leading-9">
                Easy way to rent a car at a low price
              </h1>
              <p className="text-white mt-3 text-justify text-sm">
                Providing cheap car rental services and safe and comfortable
                facilities.
              </p>
              <button className="bg-blue-400 text-white text-lg px-3 py-2 mt-3">
                Rental Car
              </button>
            </div>
            <img src="/src/assets/images/BG2.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
