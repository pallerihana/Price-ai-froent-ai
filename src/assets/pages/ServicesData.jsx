import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { maindata } from "../datasets/all_services_list";
import "./cssfolder/searchdata.css";
import { CompareContext } from "./CompareContext";
import { Link } from "react-router-dom";
import { FaHospital, FaUserMd, FaRandom, FaStar, FaTimes } from "react-icons/fa";
import HeaderPage from "./HeaderPage";
import Footerpage from "./FooterPage";

const ServicesData = () => {
  const { query } = useParams();
  const { addToCompare, removeFromCompare, compareItems } = useContext(CompareContext);
  const [costFilter, setCostFilter] = useState("lowToHigh");
  const [costRangeFilter, setCostRangeFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("default");
  const [ratingFilter, setRatingFilter] = useState("all"); // New rating filter state
  const [filteredData, setFilteredData] = useState([]);
  const [comparedItems, setComparedItems] = useState([]);

  const lowerQuery = query?.toLowerCase();

  // Generate consistent random rating (1-5) based on service ID
  const getServiceRating = (s_id) => {
    let hash = 0;
    for (let i = 0; i < s_id.length; i++) {
      hash = s_id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % 5) + 1;
  };

  // Handle compare button click
  const handleCompareClick = (item) => {
    if (comparedItems.includes(item.id)) {
      removeFromCompare(item.id);
      setComparedItems(comparedItems.filter(id => id !== item.id));
    } else {
      addToCompare(item);
      setComparedItems([...comparedItems, item.id]);
    }
  };

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

      // Cost range filtering
      if (costRangeFilter !== "all") {
        const [min, max] = costRangeFilter.split("-").map(Number);
        const charge = parseFloat(s.s_charge?.replace("₹", "").replace(/,/g, "") || "0");
        if (charge < min || charge > max) return false;
      }

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

    // Add ratings to each service
    result = result.map(service => ({
      ...service,
      rating: getServiceRating(service.id)
    }));

    // Rating filtering
    if (ratingFilter !== "all") {
      const selectedRating = parseInt(ratingFilter);
      result = result.filter(service => 
        Math.floor(service.rating) === selectedRating
      );
    }

    // Cost sorting
    result.sort((a, b) => {
      const chargeA = parseFloat(a.s_charge?.replace("₹", "").replace(/,/g, "") || "0");
      const chargeB = parseFloat(b.s_charge?.replace("₹", "").replace(/,/g, "") || "0");
      if (isNaN(chargeA)) return 1;
      if (isNaN(chargeB)) return -1;
      return costFilter === "highToLow" ? chargeB - chargeA : chargeA - chargeB;
    });

    // Randomize when distance filter is selected
    if (distanceFilter !== "default") {
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    return result;
  };

  const uniqueServices = [...new Set(maindata.map(item => item.s_name))];
  const uniqueHospitals = [...new Set(maindata.map(item => item.h_name))];

  useEffect(() => {
    setFilteredData(applyFilters(maindata));
  }, [query, costFilter, costRangeFilter, distanceFilter, ratingFilter]);

  const calculateDiscount = (charge) => {
    const baseCharge = parseFloat(charge?.replace("₹", "").replace(/,/g, "") || "0");
    const discount = baseCharge * 0.2;
    return `₹${(baseCharge - discount).toLocaleString('en-IN')} (Save 20%)`;
  };

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            color={i < rating ? "#ffc107" : "#e4e5e9"} 
            size={16} 
          />
        ))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Cost range options
  const costRangeOptions = [
    { value: "all", label: "All Prices" },
    { value: "10000-20000", label: "₹10,000 - ₹20,000" },
    { value: "20000-30000", label: "₹20,000 - ₹30,000" },
    { value: "30000-40000", label: "₹30,000 - ₹40,000" },
    { value: "40000-50000", label: "₹40,000 - ₹50,000" },
    { value: "50000-60000", label: "₹50,000 - ₹60,000" },
    { value: "60000-70000", label: "₹60,000 - ₹70,000" },
    { value: "70000-80000", label: "₹70,000 - ₹80,000" },
    { value: "80000-90000", label: "₹80,000 - ₹90,000" }
  ];

  // Rating filter options
  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "★★★★★" },
    { value: "4", label: "★★★★☆" },
    { value: "3", label: "★★★☆☆" },
    { value: "2", label: "★★☆☆☆" },
    { value: "1", label: "★☆☆☆☆" }
  ];

  return (
    <>
      <HeaderPage />
      <div className="colorofsearch">
        <h3 className="result_for">Recommended Services</h3>
        <div className="filter-boxes">
          <select 
            value={costFilter} 
            onChange={(e) => setCostFilter(e.target.value)}
            className="w-48 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:bg-gray-50"
          >
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
          
          <select 
            value={costRangeFilter} 
            onChange={(e) => setCostRangeFilter(e.target.value)}
            className="w-48 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:bg-gray-50"
          >
            {costRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select 
            value={distanceFilter} 
            onChange={(e) => setDistanceFilter(e.target.value)}
            className="w-48 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:bg-gray-50"
          >
            <option value="default">Filter by Distance</option>
            <option value="1km to 5km">1km to 5km</option>
            <option value="5km to 10km">5km to 10km</option>
            <option value="10km to 15km">10km to 15km</option>
            <option value="15km to 20km">15km to 20km</option>
          </select>

          {/* New Rating Filter */}
          <select 
            value={ratingFilter} 
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-48 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:bg-gray-50"
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
                <div 
                  key={item.id} 
                  className={`imgdivion ${comparedItems.includes(item.id) ? 'compared-item' : ''}`}
                >
                  {comparedItems.includes(item.id) && (
                    <div className="compare-badge">
                      {compareItems.findIndex(i => i.id === item.id) + 1}
                      {/* <button 
                        className="remove-compare"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompareClick(item);
                        }}
                      >
                        <FaTimes size={10} />
                      </button> */}
                    </div>
                  )}
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
                        <p style={{ margin: '2px 10px' }}>{renderStars(item.rating)}</p>
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
                        <button 
                          onClick={() => handleCompareClick(item)}
                          className={`compare-btn ${comparedItems.includes(item.id) ? 'active' : ''}`}
                        >
                          {comparedItems.includes(item.id) ? (
                            <FaTimes color="white" size={20} />
                          ) : (
                            <FaRandom color="white" size={20} />
                          )}
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
          className="compare-button"
        >
          Compare
          {compareItems.length > 0 && (
            <span className="compare-count">
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
            flex-wrap: wrap;
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
          .rating-stars {
            display: flex;
            align-items: center;
            margin-top: 5px;
            gap: 3px;
          }
          .rating-text {
            margin-left: 5px;
            font-size: 14px;
            color: #666;
          }
          .compare-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #007bff;
            color: white;
            padding: 10px 70px;
            font-size: 20px;
            border-radius: 10px;
            text-decoration: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            z-index: 1000;
          }
          .compare-count {
            margin-left: 1px;
            margin-top: -10px;
            background-color: red;
            color: white;
            border-radius: 50%;
            padding: 2px 8px;
            font-size: 12px;
          }
          .imgdivion {
            position: relative;
            transition: all 0.3s ease;
          }
          .compared-item {
            border: 3px solid rgb(9, 224, 24);
            border-radius: 10px;
            box-shadow: 0 0 10px rgb(19, 9, 46);
          }
          .compare-badge {
            position: absolute;
            top: -4px;
            right: 3px;
            background-color: rgb(12, 7, 167);
            color: white;
            border-radius: 2px;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            z-index: 10;
          }
          // .remove-compare {
            
          // }
          .compare-btn {
            background-color: #6c757d;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .compare-btn.active {
            background-color:red;
            transform: scale(1);
          }
          @media (max-width: 640px) {
            .filter-boxes {
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