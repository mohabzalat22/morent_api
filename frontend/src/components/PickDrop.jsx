import { useMemo } from "react";

function PickDrop({
  pick,
  setPick,
  drop,
  setDrop,
  getCurrentDate,
  getDropDate,
  pickTimeOptions,
  dropTimeOptions,
}) {
  return (
    // Example usage of PickDrop component

    // <PickDrop
    //   pick={{
    //     selected: true,
    //     location: "Cairo",
    //     date: "2026-01-18",
    //     time: "10:00",
    //   }}
    //   setPick={setPick} // a state setter function from useState
    //   drop={{
    //     selected: false,
    //     location: "Alexandria",
    //     date: "2026-01-20",
    //     time: "14:00",
    //   }}
    //   setDrop={setDrop} // a state setter function from useState
    //   getCurrentDate={() => "2026-01-17"}
    //   getDropDate={() => "2026-01-18"}
    //   pickTimeOptions={["09:00", "10:00", "11:00"]}
    //   dropTimeOptions={["13:00", "14:00", "15:00"]}
    // />

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
                onChange={() => {}}
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
                  className="w-full text-gray-600 outline-none bg-white"
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
                  className="text-gray-600 outline-none bg-white"
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
                onChange={() => {}}
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
                  className="w-full text-gray-600 outline-none bg-white"
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
                  className="text-gray-600 outline-none bg-white"
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
      </div>
    </div>
  );
}

export default PickDrop;
