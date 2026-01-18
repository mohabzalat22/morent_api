import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import api from "../api/api";
import CarCard from "../components/CarCard";
import PickDrop from "../components/PickDrop";

function CategoryPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [searchName, setSearchName] = useState("");

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

  const [pick, setPick] = useState({
    selected: false,
    location: "",
    date: "",
    time: "",
  });

  const [drop, setDrop] = useState({
    selected: false,
    location: "",
    date: "",
    time: "",
  });

  // Initialize type, capacity, and name from URL
  useEffect(() => {
    const initType = searchParams.get("type");
    const initCapacity = searchParams.get("capacity");
    const initName = searchParams.get("name");

    if (initType) {
      setType((prev) => ({ ...prev, [initType]: true }));
    }
    if (initCapacity) {
      setCapacity((prev) => ({ ...prev, [`x${initCapacity}`]: true }));
    }
    if (initName) {
      setSearchName(initName);
    } else {
      setSearchName("");
    }
  }, [searchParams]);

  // Sync drop date with pick date
  useEffect(() => {
    if (pick.date) {
      setDrop((prev) => ({ ...prev, date: pick.date }));
    }
  }, [pick.date]);

  // Fetch initial data
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get("/cars/meta");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  // Filter data when filters change
  useEffect(() => {
    const filter = async () => {
      const dataPayload = {};
      if (pick.selected) {
        dataPayload.pick = {
          location: pick.location,
          datetime: formatDateTime(pick.date, pick.time),
        };
      }
      if (drop.selected) {
        dataPayload.drop = {
          location: drop.location,
          datetime: formatDateTime(drop.date, drop.time),
        };
      }

      const filteredType = Object.entries(type)
        .filter(([, value]) => value)
        .map(([key]) => key);

      const filteredCapacity = Object.entries(capacity)
        .filter(([, value]) => value)
        .map(([key]) => key.replace("x", ""));

      try {
        const res = await api.post("/cars/filter", {
          type: filteredType,
          capacity: filteredCapacity,
          price: priceFilter,
          name: searchName,
          data: dataPayload,
        });
        if (res.data.success) {
          setDataFilter(res.data.data);
        }
      } catch (error) {
        console.error("Error filtering:", error);
      }
    };

    filter();
  }, [type, capacity, priceFilter, pick, drop, searchName]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return `${year}-${month}-${day}`;
  };

  const getDropDate = () => {
    return pick.date !== "" ? pick.date : getCurrentDate();
  };

  const getTimeList = (startHour = 0) => {
    const timeList = [];
    for (let i = startHour; i < 24; i++) {
      if (i >= 12) {
        timeList.push(i === 12 ? "12 PM" : `${i - 12} PM`);
      } else {
        timeList.push(i === 0 ? "12 AM" : `${i} AM`);
      }
    }
    return timeList;
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const [hStr, ampm] = time.split(" ");
    let h = parseInt(hStr);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const formattedHour = h.toString().padStart(2, "0");
    return `${date} ${formattedHour}:00`;
  };

  const pickTimeOptions = useMemo(() => {
    const date = new Date();
    const currentHour = date.getHours();
    if (pick.date === getCurrentDate()) {
      return getTimeList(currentHour);
    }
    return getTimeList(0);
  }, [pick.date]);

  const dropTimeOptions = useMemo(() => {
    if (pick.date === drop.date && pick.time) {
      const timeParts = pick.time.split(" ");
      let hour = parseInt(timeParts[0]);
      if (timeParts[1] === "PM" && hour !== 12) hour += 12;
      if (timeParts[1] === "AM" && hour === 12) hour = 0;
      return getTimeList(hour + 1);
    }
    return getTimeList(0);
  }, [pick.date, pick.time, drop.date]);

  const handleTypeChange = (key) => {
    setType((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCapacityChange = (key) => {
    setCapacity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white">
      <div className="xl:container mx-auto relative">
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
                )
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
            <PickDrop
              pick={pick}
              setPick={setPick}
              drop={drop}
              setDrop={setDrop}
              getCurrentDate={getCurrentDate}
              getDropDate={getDropDate}
              pickTimeOptions={pickTimeOptions}
              dropTimeOptions={dropTimeOptions}
            />

            {/* Cars Grid */}
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
                {dataFilter.map((item) => (
                  <SwiperSlide key={item.id}>
                    <CarCard
                      className="m-1"
                      {...item}
                      to={`/cars/${item.id}`}
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

export default CategoryPage;
