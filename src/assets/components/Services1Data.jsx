// src/ServicesData.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CompareContext } from "./CompareContext";
import { Link } from "react-router-dom";
import { FaHospital, FaUserMd, FaRandom } from "react-icons/fa";
import HeaderPage from "./HeaderPage";
import Footerpage from "./FooterPage";
import { searchServices } from "./api"; // Import fetch-based API function
import "./cssfolder/searchdata.css";

const ServicesData = () => {
  const { query } = useParams();
  const { addToCompare, compareItems } = useContext(CompareContext);
  const [costFilter, setCostFilter] = useState("default");
  const [distanceFilter, setDistanceFilter] = useState("default");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lowerQuery = query?.toLowerCase();

  // Fetch search results from API using fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await searchServices(query);
        setFilteredData(data);
      } catch (err) {
        setError("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  // Apply filters (client-side, as in original code)
  const applyFilters = (data) => {
    let result = [...data].filter((s) => {
      const matchServiceName = s.s_name?.toLowerCase().includes(lowerQuery);
      const matchHospitalName = s.h_name?.toLowerCase().includes(lowerQuery);
      const matchAddress = s.h_address?.toLowerCase().includes(lowerQuery);
      const matchDoctorName = s.d_name?.toLowerCase().includes(lowerQuery);
      const matchDescription = s.s_description?.toLowerCase().includes(lowerQuery);
      const matchCharge = s.s_charge?.toLowerCase().includes(lowerQuery);
      const matchTypes = s.types?.some((typeObj) =>
        Object.values(typeObj)[0]?.toLowerCase().includes(lowerQuery)
      );
      return (
        matchServiceName ||
        matchHospitalName ||
        matchAddress ||
        matchDoctorName ||
        matchDescription ||
        matchCharge ||
        matchTypes
      );
    });

    if (costFilter === "highToLow" || costFilter === "lowToHigh") {
      result.sort((a, b) => {
        const chargeA = parseFloat(a.s_charge?.replace("₹", "") || "0");
        const chargeB = parseFloat(b.s_charge?.replace("₹", "") || "0");
        if (isNaN(chargeA) || isNaN(chargeB)) return 0;
        return costFilter === "highToLow" ? chargeB - chargeA : chargeA - chargeB;
      });
    }

    if (distanceFilter !== "default") {
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    return result;
  };

  // Update filtered data when filters change
  useEffect(() => {
    setFilteredData(applyFilters(filteredData));
  }, [costFilter, distanceFilter]);

  const uniqueServices = [...new Set(filteredData.map(item => item.s_name))];
  const uniqueHospitals = [...new Set(filteredData.map(item => item.h_name))];

  const calculateDiscount = (charge) => {
    const baseCharge = parseFloat(charge?.replace("₹", "") || "0");
    const discount = baseCharge * 0.2;
    return `₹${(baseCharge - discount).toFixed(2)} (Save 20%)`;
  };

  const getRandomDistance = (s_id) => {
    let hash = 0;
    for (let i = 0; i < s_id.length; i++) {
      hash = s_id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const random = Math.abs(hash % 20) + 1;
    return random;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <HeaderPage />
      <div className="colorofsearch">
        <h3 className="result_for">Result For → {query}</h3>
        <div className="filter-boxes">
          <select value={costFilter} onChange={(e) => setCostFilter(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:bg-gray-50">
            <option value="default">Sort by Cost</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
          <select value={distanceFilter} onChange={(e) => setDistanceFilter(e.target.value)} className="w-48 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:bg-gray-50">
            <option value="default">Filter by Distance</option>
            <option value="1km to 5km">1km to 5km</option>
            <option value="5km to 10km">5km to 10km</option>
            <option value="10km to 15km">10km to 15km</option>
            <option value="15km to 20km">15km to 20km</option>
          </select>
        </div>
        <div className="main-all-box-data">
          <div className="service-hospitals">
            <div className="serv-list">
              <b>Services</b>
              <hr />
              {uniqueServices.map((service, index) => (
                <div key={index}>
                  <p>{service}</p>
                </div>
              ))}
            </div>
            <div className="serv-list">
              <b><FaHospital /> Hospitals</b>
              <hr />
              {uniqueHospitals.map((hospital, index) => (
                <div key={index}>
                  <p>{hospital}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="fildataalign">
            {filteredData.length === 0 ? (
              <p>No results found</p>
            ) : (
              filteredData.map((item) => (
                <div key={item.id} className="imgdivion">
                  <div className="imgdivision1">
                    <Link to={`/single/${item.id}`}>
                      <img
                        src={item.s_img}
                        alt={item.s_name || "Service Image"}
                        className="service-image"
                      />
                    </Link>
                  </div>
                  <div className="imgdivision11">
                    <div className="card-data">
                      <div className="s-code">
                        <span className="score">service code</span>
                        <p className="count">{item.s_code}</p>
                      </div>
                      <div className="s-data">
                        <div className="s-left">
                          <strong>{item.s_name}</strong>
                          <p className="h-name1">
                            <FaHospital /> {item.h_name} | <FaUserMd /> {item.d_name}
                          </p>
                        </div>
                        <div className="s-right">
                          <strong>{item.s_charge}</strong>
                          <p className="discount">{calculateDiscount(item.s_charge)}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="s-disci">
                        <p>{item.s_description}</p>
                        <button onClick={() => addToCompare(item)}>
                          <FaRandom color="white" size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Link 
          to="/compare" 
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 70px",
            fontSize: "20px",
            borderRadius: "10px",
            textDecoration: "none",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          Compare
          {compareItems.length > 0 && (
            <span style={{
              marginLeft: "1px",
              marginTop: "-10px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 8px",
              fontSize: "12px"
            }}>
              {compareItems.length}
            </span>
          )}
        </Link>
      </div>
      <Footerpage />
      <style>
        {`
          .filter-boxes {
            display: flex;
            width:97.5%;
            margin:0px auto;
            gap: 1rem;
            padding: 1rem;
            justify-content: center;
            background-color: #f9f9f9;
            border-radius: 0.5rem;
            margin-bottom: 0.2rem;
          }
          select {
            appearance: none;
            cursor: pointer;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border-radius: 0.375rem;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.5rem center;
            background-size: 1.5em 1.5em;
            border: 1px solid #d1d5db;
            width: 12rem;
          }
          select:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
          }
          select:hover {
            background-color: #f3f4f6;
          }
          @media (max-width: 640px) {
            . Star Healthfilter-boxes {
              flex-direction: column;
              align-items: center;
            }
            select {
              width: 100%;
              max-width: 200px;
            }
          }
        `}
      </style>
    </>
  );
};

export default ServicesData;