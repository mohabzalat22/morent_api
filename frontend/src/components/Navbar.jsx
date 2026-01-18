import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Navbar() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (search) {
        try {
          const res = await api.get(`/cars?name=${search}`);
          setData(res.data.data);
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setData([]);
      }
    };
    getData();
  }, [search]);

  const handleLinkClick = () => {
    setSearch("");
  };



  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <div className="py-8 px-16 flex items-center justify-between">
          <div className="flex align-items">
            <Link className="text-blue-500 text-2xl font-bold" to="/">
              MORENT
            </Link>
            <div className="ms-16 relative z-10">
              <div className="relative hidden md:block">
                <div className="absolute start-0 inset-y-0 flex items-center ps-3.5 pointer-events-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="#596780"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 22L20 20"
                      stroke="#596780"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  className="ps-12 block md:w-96 h-8 rounded-full outline-0 border text-sm"
                  placeholder="Search something here"
                />
              </div>
              {data.length > 0 && (
                <div className="absolute w-full text-lg border text-gray-700 bg-white p-4 rounded-md m-1 shadow-lg z-50">
                  <ul>
                    {data.map((item, index) => (
                      <li key={index}>
                        <Link
                          onClick={handleLinkClick}
                          to={`/cars/${item.id}`}
                          className="hover:bg-gray-200 block p-2 m-1"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex p-1 items-center">
            <div className="hidden xl:flex">
              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="rounded-full border p-2 mx-2"
                title="Wishlist"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16.44 3.09998C14.63 3.09998 13.01 3.97998 12 5.32998C10.99 3.97998 9.37 3.09998 7.56 3.09998C4.49 3.09998 2 5.59998 2 8.68998C2 9.87998 2.19 10.98 2.52 12C4.1 17 8.97 19.99 11.38 20.81C11.72 20.93 12.28 20.93 12.62 20.81C15.03 19.99 19.9 17 21.48 12C21.81 10.98 22 9.87998 22 8.68998C22 5.59998 19.51 3.09998 16.44 3.09998Z"
                    fill="#596780"
                  />
                </svg>
              </Link>
              <div className="rounded-full border p-2 mx-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z"
                    fill="#596780"
                  />
                  <path
                    d="M14.8299 20.01C14.4099 21.17 13.2999 22 11.9999 22C11.2099 22 10.4299 21.68 9.87993 21.11C9.55993 20.81 9.31993 20.41 9.17993 20C9.30993 20.02 9.43993 20.03 9.57993 20.05C9.80993 20.08 10.0499 20.11 10.2899 20.13C10.8599 20.18 11.4399 20.21 12.0199 20.21C12.5899 20.21 13.1599 20.18 13.7199 20.13C13.9299 20.11 14.1399 20.1 14.3399 20.07C14.4999 20.05 14.6599 20.03 14.8299 20.01Z"
                    fill="#596780"
                  />
                </svg>
              </div>
              <div className="rounded-full border p-2 mx-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.1 9.22006C18.29 9.22006 17.55 7.94006 18.45 6.37006C18.97 5.46006 18.66 4.30006 17.75 3.78006L16.02 2.79006C15.23 2.32006 14.21 2.60006 13.74 3.39006L13.63 3.58006C12.73 5.15006 11.25 5.15006 10.34 3.58006L10.23 3.39006C9.78 2.60006 8.76 2.32006 7.97 2.79006L6.24 3.78006C5.33 4.30006 5.02 5.47006 5.54 6.38006C6.45 7.94006 5.71 9.22006 3.9 9.22006C2.86 9.22006 2 10.0701 2 11.1201V12.8801C2 13.9201 2.85 14.7801 3.9 14.7801C5.71 14.7801 6.45 16.0601 5.54 17.6301C5.02 18.5401 5.33 19.7001 6.24 20.2201L7.97 21.2101C8.76 21.6801 9.78 21.4001 10.25 20.6101L10.36 20.4201C11.26 18.8501 12.74 18.8501 13.65 20.4201L13.76 20.6101C14.23 21.4001 15.25 21.6801 16.04 21.2101L17.77 20.2201C18.68 19.7001 18.99 18.5301 18.47 17.6301C17.56 16.0601 18.3 14.7801 20.11 14.7801C21.15 14.7801 22.01 13.9301 22.01 12.8801V11.1201C22 10.0801 21.15 9.22006 20.1 9.22006ZM12 15.2501C10.21 15.2501 8.75 13.7901 8.75 12.0001C8.75 10.2101 10.21 8.75006 12 8.75006C13.79 8.75006 15.25 10.2101 15.25 12.0001C15.25 13.7901 13.79 15.2501 12 15.2501Z"
                    fill="#596780"
                  />
                </svg>
              </div>
            </div>
            {/* Profile */}
            <Link to="/profile">
              <div className="rounded-full border p-1 mx-2">
                <img
                  src="/src/assets/images/Image.png"
                  alt=""
                  className="w-10 h-10"
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full p-1">
          <div className="relative block md:hidden">
            <div className="absolute start-0 inset-y-0 flex items-center ps-3.5 pointer-events-none">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                  stroke="#596780"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 22L20 20"
                  stroke="#596780"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              className="ps-12 block w-full h-8 rounded-full outline-0 border text-sm"
              placeholder="Search something here"
            />
            {data.length > 0 && (
              <div className="absolute w-full text-lg border text-gray-700 bg-white p-4 rounded-md m-1 shadow-lg z-50">
                <ul>
                  {data.map((item, index) => (
                    <li key={index}>
                      <Link
                        onClick={handleLinkClick}
                        to={`/cars/${item.id}`}
                        className="hover:bg-gray-200 block p-2 m-1"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
