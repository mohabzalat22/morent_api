import { useState, useEffect, useMemo } from "react";
import Avatar from "../components/Avatar";
import { Toaster } from "sonner";
import { showToast } from "../utils/toast";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import api from "../api/api";
import CarCard from "../components/CarCard";
import StarIcon from "../components/icons/StarIcon";
import StarOutlineIcon from "../components/icons/StarOutlineIcon";

function DetailPage() {
  const { id } = useParams();

  // Loading states
  const [reviewLoad, setReviewLoad] = useState(true);
  const [dataDetailLoad, setDataDetailLoad] = useState(true);

  // Error handling removed (using Sonner)

  // Filter states
  const [type, setType] = useState({
    sport: false,
    suv: false,
    mpv: false,
    sedan: false,
    coupe: false,
    hatchback: false,
  });

  const [capacity, setCapacity] = useState({
    x2: false,
    x4: false,
    x6: false,
    x8: false,
  });

  const [priceFilter, setPriceFilter] = useState(50);

  // Data states
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [dataFilter, setDataFilter] = useState([]);

  // Review modal states
  // All cars for fallback in Popular Cars
  const [allCars, setAllCars] = useState([]);
  // Fetch all cars for fallback
  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        const res = await api.get("/cars");
        if (res.data.success) {
          setAllCars(res.data.data);
        }
      } catch (e) {
        // Optionally show toast
      }
    };
    fetchAllCars();
  }, []);
  const [stars, setStars] = useState([]);
  const [review, setReview] = useState("");
  const [user, setUser] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [modal, setModal] = useState(false);
  const [descriptionClick, setDescriptionClick] = useState(false);

  const addStar = (n) => {
    const newStars = [];
    for (let i = 1; i <= n; i++) {
      newStars.push(i);
    }
    setStars(newStars);
  };

  // Fetch side data
  useEffect(() => {
    const getSideData = async () => {
      try {
        const res = await api.get("/cars/meta");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (e) {
        showToast(e, true);
      }
    };
    getSideData();
  }, []);

  // Fetch detail data
  useEffect(() => {
    const getDetailData = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        if (res.data.success) {
          setDataDetail(res.data.data);
        }
      } catch (e) {
        showToast(e, true);
      } finally {
        setDataDetailLoad(false);
      }
    };
    getDetailData();
  }, [id]);

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          setUser(userData.name);
          setProfileImage(userData.profile_image);
        }
      } catch (e) {
        showToast(e, true);
      }
    };
    getUser();
  }, []);

  // Fetch reviews
  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await api.get(`/cars/${id}/reviews`);
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (e) {
        showToast(e, true);
      } finally {
        setReviewLoad(false);
      }
    };
    getReviews();
  }, [id]);

  // Filter cars
  useEffect(() => {
    const filter = async () => {
      try {
        // Get selected types as array of strings
        const filteredType = Object.entries(type)
          .filter(([, value]) => value)
          .map(([key]) => key);

        // Get selected capacities as array of numbers
        const filteredCapacity = Object.entries(capacity)
          .filter(([, value]) => value)
          .map(([key]) => Number(key.replace("x", "")));

        const res = await api.post("/cars/simple-filter", {
          type: filteredType,
          capacity: filteredCapacity,
          price: priceFilter,
        });
        if (res.data.success) {
          setDataFilter(res.data.data);
        }
      } catch (e) {
        showToast(e, true);
      }
    };
    filter();
  }, [type, capacity, priceFilter]);

  const sendReview = async () => {
    try {
      const starsCount = stars.length ? stars[stars.length - 1] : 0;
      const res = await api.post(`/cars/${id}/reviews`, {
        review,
        stars: starsCount,
      });
      showToast({ message: "Review Sent", success: true });
    } catch (e) {
      showToast(e, true);
    }
  };

  const handleTypeChange = (key) => {
    setType((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCapacityChange = (key) => {
    setCapacity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white">
      <div className="xl:container mx-auto relative">
        {/* Sonner Toast container */}
        <Toaster position="top-right" richColors />

        {/* Modern Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn"
              onClick={() => setModal(false)}
            ></div>
            {/* Modal Content */}
            <div className="relative w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 z-10 animate-modalPop">
              {/* Close Button */}
              <button
                onClick={() => setModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                      <Avatar />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="text-gray-700 text-base font-semibold">
                    {user}
                  </h4>
                </div>
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className="block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-gray-800 bg-gray-50 resize-none transition"
                placeholder="Write your review..."
              />
              <div className="flex justify-between items-end mt-6">
                <div>
                  <h5 className="text-base text-gray-700 font-bold mb-2">
                    Rate
                  </h5>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={`mx-1 cursor-pointer transition-transform hover:scale-125 ${
                            stars.includes(n)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => addStar(n)}
                        >
                          {stars.includes(n) ? (
                            <StarIcon />
                          ) : (
                            <StarOutlineIcon />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={sendReview}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg py-2 px-6 shadow-md transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            {/* Animations */}
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .animate-fadeIn { animation: fadeIn 0.2s ease; }
              @keyframes modalPop { 0% { transform: scale(0.95) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
              .animate-modalPop { animation: modalPop 0.25s cubic-bezier(.4,2,.6,1) forwards; }
            `}</style>
          </div>
        )}

        <div className="xl:grid grid-cols-12">
          {/* Sidebar */}
          <div className="hidden xl:block col-start-1 col-span-3 bg-white py-6 px-10">
            <h3 className="text-sm text-gray-400">TYPE</h3>
            <ul className="p-3">
              {["sport", "suv", "mpv", "sedan", "coupe", "hatchback"].map(
                (typeKey, idx) => (
                  <li key={typeKey}>
                    <div className="flex items-center my-4">
                      <input
                        type="checkbox"
                        checked={type[typeKey]}
                        onChange={() => handleTypeChange(typeKey)}
                        className="w-4 h-4 text-blue-600 rounded ring-offset-2 focus:ring-2 focus:ring-blue-500"
                      />
                      <label className="ms-2 text-gray-600 font-semibold capitalize">
                        {typeKey}
                      </label>
                      {data.length > 0 && (
                        <p className="ms-1 text-sm text-gray-400">
                          ({data[0]?.[idx] || 0})
                        </p>
                      )}
                    </div>
                  </li>
                ),
              )}
            </ul>

            <h3 className="text-sm text-gray-400 mt-2">CAPACITY</h3>
            <ul className="p-3">
              {[
                { key: "x2", label: "2 Person", idx: 0 },
                { key: "x4", label: "4 Person", idx: 1 },
                { key: "x6", label: "6 Person", idx: 2 },
                { key: "x8", label: "8 or More", idx: 3 },
              ].map(({ key, label, idx }) => (
                <li key={key}>
                  <div className="flex items-center my-4">
                    <input
                      type="checkbox"
                      checked={capacity[key]}
                      onChange={() => handleCapacityChange(key)}
                      className="w-4 h-4 text-blue-600 rounded ring-offset-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="ms-2 text-gray-600 font-semibold">
                      {label}
                    </label>
                    {data.length > 0 && (
                      <p className="ms-1 text-sm text-gray-400">
                        ({data[1]?.[idx] || 0})
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="text-sm text-gray-400 mt-2">PRICE</h3>
            <div>
              <input
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                type="range"
                className="w-full my-4"
                min="0"
                max="100"
              />
              <h3 className="text-xl font-semibold text-gray-600">
                Max <span className="ms-2">${priceFilter}</span>
              </h3>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-start-4 col-span-9 bg-gray-100">
            <div className="xl:grid grid-cols-2 px-4 py-4 md:px-auto md:py-8">
              {/* Left - Car Images */}
              <div className="flex justify-center">
                <div className="flex flex-col">
                  {dataDetailLoad ? (
                    <div className="flex justify-center items-center rounded bg-gray-200 h-[300px]">
                      <div role="status">
                        <svg
                          className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex mt-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-[150px] h-[90px] bg-blue-500 rounded-lg m-1 flex items-center"
                        >
                          <img src={dataDetail.image} alt="" />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="w-full xl:w-[480px] xl:h-[360px] bg-gray-200 rounded-lg mt-6">
                    <div className="flex flex-1 flex-col justify-end h-full">
                      <img
                        src={dataDetail.background}
                        alt=""
                        className="block"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Car Details */}
              {dataDetailLoad ? (
                <div className="flex justify-center items-center">
                  <div role="status">
                    <svg
                      className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-white flex flex-col justify-center rounded-lg p-6 xl:mx-6">
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-2xl">
                          {dataDetail.name}
                        </h3>
                        <div className="flex items-center">
                          <div className="flex py-2">
                            {(() => {
                              const totalReviews = reviews.length;
                              const avgRating =
                                totalReviews > 0
                                  ? reviews.reduce(
                                      (sum, r) => sum + r.stars,
                                      0,
                                    ) / totalReviews
                                  : 0;
                              const filledStars = Math.round(avgRating);
                              return (
                                <>
                                  {Array.from({ length: filledStars }).map(
                                    (_, i) => (
                                      <div key={i} className="m-1">
                                        <StarIcon className="w-4 h-4 text-yellow-400" />
                                      </div>
                                    ),
                                  )}
                                  {Array.from({ length: 5 - filledStars }).map(
                                    (_, i) => (
                                      <div key={i} className="m-1">
                                        <StarOutlineIcon className="w-4 h-4 text-gray-300" />
                                      </div>
                                    ),
                                  )}
                                </>
                              );
                            })()}
                          </div>
                          <h4 className="ms-2 text-gray-600 font-semibold text-sm">
                            {reviews.length} Reviewer
                            {reviews.length !== 1 ? "s" : ""}
                          </h4>
                        </div>
                      </div>
                      <div>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="red">
                          <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`mt-4 cursor-pointer ${
                        descriptionClick ? "line-clamp-none" : "line-clamp-3"
                      }`}
                      onClick={() => setDescriptionClick(!descriptionClick)}
                    >
                      <p className="leading-7 text-gray-600 text-balance">
                        {dataDetail.description}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap justify-between p-1">
                      <div>
                        <div className="flex">
                          <h3 className="text-lg text-gray-500">Type Car</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.model}
                          </h3>
                        </div>
                        <div className="flex mt-2">
                          <h3 className="text-lg text-gray-500">Steering</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.type}
                          </h3>
                        </div>
                      </div>
                      <div>
                        <div className="flex">
                          <h3 className="text-lg text-gray-500">Capacity</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.capacity} Person
                          </h3>
                        </div>
                        <div className="flex mt-2">
                          <h3 className="text-lg text-gray-500">Gasoline</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.tank}L
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex justify-between items-center">
                      <div className="flex items-end">
                        {dataDetail.dailyPrice && (
                          <h1 className="text-gray-800 font-bold text-2xl">
                            ${dataDetail.dailyPrice.toFixed(2)}/
                          </h1>
                        )}
                        <span className="text-sm text-gray-500">day</span>
                      </div>
                      <Link
                        className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-white"
                        to={`/payment/${dataDetail.id}`}
                      >
                        Rent Now
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="px-4 py-4 md:px-auto md:py-8">
              <div className="bg-white p-4 rounded-xl">
                <div className="flex justify-between">
                  <div className="flex">
                    <h2 className="text-gray-900 font-semibold text-xl">
                      Reviews
                    </h2>
                    <div className="ms-4 bg-blue px-4 py-1 bg-blue-500 text-white rounded">
                      {reviews.length}
                    </div>
                  </div>
                  <button
                    onClick={() => setModal(!modal)}
                    className="bg-blue px-4 py-1 bg-blue-500 text-white rounded-lg"
                  >
                    Add Review
                  </button>
                </div>

                {reviewLoad ? (
                  <div className="flex justify-center">
                    <div className="m-2" role="status">
                      <svg
                        className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    <div className="my-6">
                      {reviews.map((item, index) => (
                        <div key={index} className="flex items-center mt-6">
                          <div className="flex-shrink-0">
                            {profileImage ? (
                              <img
                                src={profileImage}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12">
                                <Avatar />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow px-4">
                            <div className="flex justify-end">
                              <p className="text-sm text-gray-400">
                                {item.created_at}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <h4 className="text-gray-400 text-sm">
                                {item.user.name}
                              </h4>
                              <div className="flex items-center">
                                <div className="flex">
                                  {Array.from({ length: item.stars }).map(
                                    (_, i) => (
                                      <div key={i} className="m-1">
                                        <StarIcon className="w-4 h-4" />
                                      </div>
                                    ),
                                  )}
                                  {Array.from({ length: 5 - item.stars }).map(
                                    (_, i) => (
                                      <div key={i} className="m-1">
                                        <StarOutlineIcon className="w-4 h-4" />
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-600 leading-6">
                              {item.review}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button className="text-gray-400 flex items-center">
                    <span>Show All</span>
                    <svg
                      className="h-4 w-4 ms-2"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8.00026 11.1996C7.53359 11.1996 7.06692 11.0196 6.71359 10.6663L2.36692 6.31964C2.17359 6.1263 2.17359 5.80631 2.36692 5.61297C2.56026 5.41964 2.88026 5.41964 3.07359 5.61297L7.42026 9.95964C7.74026 10.2796 8.26026 10.2796 8.58026 9.95964L12.9269 5.61297C13.1203 5.41964 13.4403 5.41964 13.6336 5.61297C13.8269 5.80631 13.8269 6.1263 13.6336 6.31964L9.28692 10.6663C8.93359 11.0196 8.46692 11.1996 8.00026 11.1996Z"
                        fill="#90A3BF"
                        stroke="#90A3BF"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Cars */}
            <div className="px-8 py-4 md:px-6 md:py-8">
              <div className="flex justify-between px-6">
                <h4 className="text-base text-gray-600">Popular Cars</h4>
                <a className="text-blue-700 font-bold text-base cursor-pointer">
                  View All
                </a>
              </div>
              <Swiper
                className="mt-6"
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                breakpoints={{
                  768: { slidesPerView: 3 },
                }}
              >
                {(dataFilter.length > 0 ? dataFilter : allCars).map((item) => (
                  <SwiperSlide key={item.id}>
                    <CarCard
                      className="m-1"
                      {...item}
                      to={`/detail/${item.id}?name=${item.name}&type=${item.model}&capacity=${item.capacity}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
