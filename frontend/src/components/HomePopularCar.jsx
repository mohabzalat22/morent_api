import { useState, useEffect, useMemo } from "react";
import api from "../api/api";
import CarCard from "./CarCard";

function HomePopularCar() {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

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

  // Sync drop date with pick date
  useEffect(() => {
    if (pick.date) {
      setDrop((prev) => ({ ...prev, date: pick.date }));
    }
  }, [pick.date]);

  // Fetch data based on filters
  useEffect(() => {
    const fetchData = async () => {
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

      try {
        let res;
        if (Object.keys(dataPayload).length === 0) {
          // Fetch all cars when no filters are applied
          res = await api.get("/cars");
        } else {
          // Use /cars/filter route with the new structure
          res = await api.post("/cars/filter", { data: dataPayload });
        }
        
        if (res.data.success) {
          setData(res.data.data);
          setVisibleCount(8); // Reset visible count on new search
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchData();
  }, [pick, drop]);

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

  const visibleCars = useMemo(() => {
    return data.slice(0, visibleCount);
  }, [data, visibleCount]);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <div className="container mx-auto">
      <div className="px-8 py-0.5 md:px-16 md:py-1">
        <div className="flex flex-wrap select-none">
          {/* Pick-Up */}
          <div className="w-full xl:w-5/12 bg-white rounded-2xl py-4 px-4">
            <div
              className="flex items-center py-1 cursor-pointer"
              onClick={() => setPick((p) => ({ ...p, selected: !p.selected }))}
            >
              <input
                type="checkbox"
                checked={pick.selected}
                readOnly
                className="w-4 h-4"
              />
              <label className="ms-2 text-sm">Pick-Up</label>
            </div>
            <div className="flex justify-between mt-3 divide-x">
              <div className="px-2">
                <strong className="text-gray-800 text-lg block">
                  Locations
                </strong>
                <select
                  value={pick.location}
                  onChange={(e) =>
                    setPick((p) => ({ ...p, location: e.target.value }))
                  }
                  className="w-full text-gray-600 outline-none"
                >
                  <option disabled value="">
                    select your city
                  </option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Cairo">Cairo</option>
                </select>
              </div>
              <div className="px-2">
                <strong className="text-gray-800 text-lg block">Date</strong>
                <input
                  type="date"
                  value={pick.date}
                  onChange={(e) =>
                    setPick((p) => ({ ...p, date: e.target.value }))
                  }
                  min={getCurrentDate()}
                  className="text-gray-600 outline-none"
                />
              </div>
              <div className="px-2">
                <strong className="text-gray-800 text-lg block">Time</strong>
                <select
                  value={pick.time}
                  onChange={(e) =>
                    setPick((p) => ({ ...p, time: e.target.value }))
                  }
                  className="text-gray-600 outline-none"
                >
                  <option disabled value="">
                    select your time
                  </option>
                  {pickTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex items-center justify-center w-full xl:w-2/12">
            <button className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-600">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7.16017 3.83998L7.16017 17.16L3.50018 13.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.8398 20.16V6.83997L20.4998 10.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Drop-Off */}
          <div className="w-full xl:w-5/12 bg-white rounded-2xl py-4 px-4">
            <div
              className="flex items-center py-1 cursor-pointer"
              onClick={() => setDrop((d) => ({ ...d, selected: !d.selected }))}
            >
              <input
                type="checkbox"
                checked={drop.selected}
                readOnly
                className="w-4 h-4"
              />
              <label className="ms-2 text-sm">Drop-Off</label>
            </div>
            <div className="flex justify-between mt-3 divide-x">
              <div className="px-2">
                <strong className="text-gray-800 text-lg block">
                  Locations
                </strong>
                <select
                  value={drop.location}
                  onChange={(e) =>
                    setDrop((d) => ({ ...d, location: e.target.value }))
                  }
                  className="w-full text-gray-600 outline-none"
                >
                  <option disabled value="">
                    select your city
                  </option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Cairo">Cairo</option>
                </select>
              </div>
              <div className="px-2">
                <strong className="text-gray-800 text-lg block">Date</strong>
                <input
                  type="date"
                  value={drop.date}
                  onChange={(e) =>
                    setDrop((d) => ({ ...d, date: e.target.value }))
                  }
                  min={getDropDate()}
                  className="text-gray-600 outline-none"
                />
              </div>
              <div className="px-2">
                <strong className="text-gray-800 text-lg block">Time</strong>
                <select
                  value={drop.time}
                  onChange={(e) =>
                    setDrop((d) => ({ ...d, time: e.target.value }))
                  }
                  className="text-gray-600 outline-none"
                >
                  <option disabled value="">
                    select your time
                  </option>
                  {dropTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Cars Grid */}
        <div className="py-4 md:py-8">
          <div className="flex justify-between px-6 mb-6">
            <h4 className="text-base text-gray-400">Popular Cars</h4>
            <a className="text-blue-700 font-bold text-base cursor-pointer">
              View All
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCars.map((item) => (
              <CarCard
                key={item.id}
                {...item}
                to={`/cars/${item.id}`}
              />
            ))}
          </div>

          {data.length > visibleCount && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleShowMore}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Show More Cars
              </button>
            </div>
          )}
          
          {visibleCount > 8 && data.length <= visibleCount && (
             <div className="flex justify-center mt-12">
                <p className="text-gray-400">No more cars to show</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePopularCar;
