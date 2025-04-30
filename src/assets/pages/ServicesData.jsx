import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { maindata } from "../datasets/all_services_list";
import "./cssfolder/searchdata.css";
import { CompareContext } from "./CompareContext";
import { FaHospital, FaUserMd, FaRandom, FaStar, FaTimes } from "react-icons/fa";
import HeaderPage from "./HeaderPage";
import Footerpage from "./FooterPage";
import debounce from 'lodash/debounce';

const ServicesData = () => {
  const { query } = useParams();
  const { addToCompare, removeFromCompare, compareItems } = useContext(CompareContext);
  const navigate = useNavigate();
  const [costFilter, setCostFilter] = useState("lowToHigh");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [comparedItems, setComparedItems] = useState([]);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const lowerQuery = query?.toLowerCase() || '';

  const serviceTypeOptions = useMemo(() => [
    "Cardiology", "Neurology", "Oncology", "Orthopedics", "Gastroenterology",
    "Nephrology", "Endocrinology", "Urology", "Pulmonology", "Dermatology",
    "Pediatrics", "Obstetrics", "General Surgery", "Ophthalmology",
    "Otolaryngology_ENT", "Infectious_Diseases", "Psychiatry"
  ], []);

  const cityOptions = useMemo(() => [
    "Ongole", "Guntur", "Vijayawada", "Hyderabad", "Secunderabad"
  ], []);

  const priceRangeOptions = useMemo(() => [
    { value: "10000-20000", label: "₹10,000 - ₹20,000" },
    { value: "20000-30000", label: "₹20,000 - ₹30,000" },
    { value: "30000-40000", label: "₹30,000 - ₹40,000" },
    { value: "40000-50000", label: "₹40,000 - ₹50,000" },
    { value: "50000-60000", label: "₹50,000 - ₹60,000" },
    { value: "60000-70000", label: "₹60,000 - ₹70,000" },
    { value: "70000-80000", label: "₹70,000 - ₹80,000" },
    { value: "80000-90000", label: "₹80,000 - ₹90,000" }
  ], []);

  const ratingOptions = useMemo(() => [
    { value: "1", label: "★☆☆☆☆" },
    { value: "2", label: "★★☆☆☆" },
    { value: "3", label: "★★★☆☆" },
    { value: "4", label: "★★★★☆" },
    { value: "5", label: "★★★★★" }
  ], []);

  const toggleSelection = useCallback((value, selectedItems, setSelectedItems) => {
    setSelectedItems(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  }, []);

  const getServiceRating = useCallback((s_id) => {
    try {
      let hash = 0;
      for (let i = 0; i < s_id.length; i++) {
        hash = s_id.charCodeAt(i) + ((hash << 5) - hash);
      }
      return (Math.abs(hash) % 5) + 1;
    } catch (err) {
      console.error('Error calculating rating:', err);
      return 1;
    }
  }, []);

  const handleCompareClick = useCallback((item) => {
    try {
      if (comparedItems.includes(item.id)) {
        removeFromCompare(item.id);
        setComparedItems(prev => prev.filter((id) => id !== item.id));
      } else {
        addToCompare(item);
        setComparedItems(prev => [...prev, item.id]);
      }
    } catch (err) {
      setError('Error handling comparison');
      console.error(err);
    }
  }, [comparedItems, addToCompare, removeFromCompare]);

  const clearFilters = useCallback(() => {
    setCostFilter("lowToHigh");
    setSelectedCities([]);
    setSelectedRatings([]);
    setSelectedServiceTypes([]);
    setSelectedPriceRanges([]);
  }, []);

  const applyFilters = useCallback((data) => {
    try {
      let result = data.filter((s) => {
        const matchServiceName = s.s_name?.toLowerCase().includes(lowerQuery);
        const matchHospitalName = s.h_name?.toLowerCase().includes(lowerQuery);
        const matchAddress = s.h_address?.toLowerCase().includes(lowerQuery);
        const matchDoctorName = s.d_name?.toLowerCase().includes(lowerQuery);
        const matchDescription = s.s_description?.toLowerCase().includes(lowerQuery);
        const matchCharge = s.s_charge?.toLowerCase().includes(lowerQuery);
        const matchTypes = s.types?.some((typeObj) =>
          Object.values(typeObj)[0]?.toLowerCase().includes(lowerQuery)
        );

        if (selectedCities.length > 0) {
          const cityMatch = selectedCities.some(city =>
            s.h_address?.toLowerCase().includes(city.toLowerCase())
          );
          if (!cityMatch) return false;
        }

        if (selectedPriceRanges.length > 0) {
          const charge = parseFloat(s.s_charge?.replace("₹", "").replace(/,/g, "") || "0");
          const inRange = selectedPriceRanges.some(range => {
            const [min, max] = range.split("-").map(Number);
            return charge >= min && charge <= max;
          });
          if (!inRange) return false;
        }

        if (selectedServiceTypes.length > 0) {
          const serviceTypeMatch = selectedServiceTypes.some(type =>
            s.s_name?.toLowerCase().includes(type.toLowerCase()) ||
            s.types?.some((typeObj) =>
              Object.values(typeObj)[0]?.toLowerCase().includes(type.toLowerCase())
            )
          );
          if (!serviceTypeMatch) return false;
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

      result = result.map((service) => ({
        ...service,
        rating: getServiceRating(service.id),
      }));

      if (selectedRatings.length > 0) {
        result = result.filter((service) =>
          selectedRatings.includes(String(Math.floor(service.rating)))
        );
      }

      return result.sort((a, b) => {
        const chargeA = parseFloat(a.s_charge?.replace("₹", "").replace(/,/g, "") || "0");
        const chargeB = parseFloat(b.s_charge?.replace("₹", "").replace(/,/g, "") || "0");
        if (isNaN(chargeA)) return 1;
        if (isNaN(chargeB)) return -1;
        return costFilter === "highToLow" ? chargeB - chargeA : chargeA - chargeB;
      });
    } catch (err) {
      setError('Error applying filters');
      console.error(err);
      return [];
    }
  }, [lowerQuery, selectedCities, selectedPriceRanges, selectedServiceTypes, selectedRatings, costFilter, getServiceRating]);

  const debouncedApplyFilters = useMemo(() =>
    debounce((data) => {
      setFilteredData(applyFilters(data));
    }, 300),
    [applyFilters]
  );

  const uniqueServices = useMemo(() => [...new Set(maindata.map((item) => item.s_name))], []);
  const uniqueHospitals = useMemo(() => [...new Set(maindata.map((item) => item.h_name))], []);

  useEffect(() => {
    debouncedApplyFilters(maindata);
    return () => debouncedApplyFilters.cancel();
  }, [debouncedApplyFilters, query, costFilter, selectedCities, selectedRatings, selectedServiceTypes, selectedPriceRanges]);

  const calculateDiscount = useCallback((charge) => {
    try {
      const baseCharge = parseFloat(charge?.replace("₹", "").replace(/,/g, "") || "0");
      const discount = baseCharge * 0.2;
      return `₹${(baseCharge - discount).toLocaleString("en-IN")} (Save 20%)`;
    } catch (err) {
      console.error('Error calculating discount:', err);
      return charge;
    }
  }, []);

  const renderStars = useCallback((rating) => {
    return (
      <div className="rating-stars" aria-label={`Rating ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} color={i < rating ? "#FFC107" : "#E4E5E9"} size={16} />
        ))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  }, []);

  const handleServiceClick = useCallback((service) => {
    try {
      if (service === "All Services") {
        navigate(`/`);
      } else {
        const encodedService = encodeURIComponent(service.replace(/ /g, "_"));
        navigate(`/results/${encodedService}`);
      }
    } catch (err) {
      setError('Error navigating to service');
      console.error(err);
    }
  }, [navigate]);

  const MultiSelectDropdown = useCallback(({ title, options, selectedItems, toggleSelection, isRating = false }) => {
    const isOpen = openDropdown === title;

    const handleToggle = () => {
      setOpenDropdown(isOpen ? null : title);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleToggle();
        e.preventDefault();
      }
    };

    return (
      <div className="multi-select-dropdown">
        <button
          className="dropdown-toggle"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-label={`${title} filter, ${selectedItems.length} selected`}
        >
          {title} {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
        </button>
        {isOpen && (
          <div className="dropdown-menu" role="menu">
            {options.map((option) => {
              const value = option.value || option;
              const label = option.label || option;
              return (
                <label key={value} className="dropdown-item" role="menuitem">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(value)}
                    onChange={() => toggleSelection(value)}
                    aria-label={`Select ${label}`}
                  />
                  {isRating ? (
                    <div className="rating-option">
                      {[...Array(parseInt(value))].map((_, i) => (
                        <FaStar key={i} color="#FFC107" size={14} />
                      ))}
                      {[...Array(5 - parseInt(value))].map((_, i) => (
                        <FaStar key={i} color="#E4E5E9" size={14} />
                      ))}
                    </div>
                  ) : (
                    label
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  }, [openDropdown]);

  if (error) {
    return (
      <div className="error-message" role="alert">
        An error occurred: {error}. Please try refreshing the page.
      </div>
    );
  }

  return (
    <>
      <HeaderPage />
      <div className="colorofsearch">
        <h3 className="result_for">Recommended Services</h3>
        <div className="filter-boxes">
        <select
  value={costFilter}
  onChange={(e) => setCostFilter(e.target.value)}
  aria-label="Sort by price"
  style={{
    width: '12rem',
    padding: '0.8rem',
    border: '1px solid rgb(35, 89, 169)',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    color: '#374151',
    outline: 'none',
    fontWeight:"bold",
    transition: 'all 0.2s ease',
  }}
  onFocus={(e) => {
    e.target.style.borderColor = 'transparent';
    e.target.style.boxShadow = '0 0 0 2px #3B82F6';
  }}
  onBlur={(e) => {
    e.target.style.borderColor = '#D1D5DB';
    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#F9FAFB';
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'white';
  }}
>
  <option value="lowToHigh">Price: Low to High</option>
  <option value="highToLow">Price: High to Low</option>
</select>

          <div className="multi-select-container">
            <MultiSelectDropdown
              title="Cities"
              options={cityOptions}
              selectedItems={selectedCities}
              toggleSelection={(city) => toggleSelection(city, selectedCities, setSelectedCities)}
            />
          </div>

          <div className="multi-select-container">
            <MultiSelectDropdown
              title="Price Ranges"
              options={priceRangeOptions}
              selectedItems={selectedPriceRanges}
              toggleSelection={(range) => toggleSelection(range, selectedPriceRanges, setSelectedPriceRanges)}
            />
          </div>

          <div className="multi-select-container">
            <MultiSelectDropdown
              title="Ratings"
              options={ratingOptions}
              selectedItems={selectedRatings}
              toggleSelection={(rating) => toggleSelection(rating, selectedRatings, setSelectedRatings)}
              isRating={true}
            />
          </div>

          <div className="multi-select-container">
            <MultiSelectDropdown
              title="Service Types"
              options={serviceTypeOptions}
              selectedItems={selectedServiceTypes}
              toggleSelection={(type) => toggleSelection(type, selectedServiceTypes, setSelectedServiceTypes)}
            />
          </div>

          <button
            onClick={clearFilters}
            className="clear-button"
            aria-label="Clear all filters"
          >
            Clear
          </button>
        </div>

        <div className="main-all-box-data">
          <div className="service-hospitals">
            <div className="serv-list">
              <b>Services</b>
              <hr />
              <div
                onClick={() => handleServiceClick("All Services")}
                onKeyDown={(e) => e.key === 'Enter' && handleServiceClick("All Services")}
                role="button"
                tabIndex={0}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  backgroundColor: !query ? "#e0f7fa" : "transparent",
                  borderRadius: "4px",
                }}
                aria-label="Viewёл

all services"
              >
                <p>All Services</p>
              </div>
              {uniqueServices.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  onKeyDown={(e) => e.key === 'Enter' && handleServiceClick(service)}
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    backgroundColor:
                      query &&
                      decodeURIComponent(query.replace(/_/g, " ")).toLowerCase() ===
                        service.toLowerCase()
                        ? "#e0f7fa"
                        : "transparent",
                    borderRadius: "4px",
                  }}
                  aria-label={`View ${service} services`}
                >
                  <p>{service}</p>
                </div>
              ))}
            </div>
            <div className="serv-list">
              <b>
                <FaHospital /> Hospitals
              </b>
              <hr />
              {uniqueHospitals.map((hospital, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/hospital/${encodeURIComponent(hospital)}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/hospital/${encodeURIComponent(hospital)}`)}
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "4px",
                    transition: "background-color 0.2s ease"
                  }}
                  className="hospital-item"
                  aria-label={`View ${hospital} details`}
                >
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
                  className={`imgdivion ${comparedItems.includes(item.id) ? "compared-item" : ""}`}
                >
                  {comparedItems.includes(item.id) && (
                    <div className="compare-badge">
                      {compareItems.findIndex((i) => i.id === item.id) + 1}
                    </div>
                  )}
                  <div className="imgdivision1">
                    <Link to={`/single/${item.id}`} aria-label={`View details for ${item.s_name}`}>
                      <img
                        src={item.s_img}
                        alt={item.s_name || "Service Image"}
                        className="service-image"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                  <div className="imgdivision11">
                    <div className="card-data">
                      <div className="s-code">
                        <span className="score">service code</span>
                        <p className="count">{item.s_code}</p>
                        <p style={{ margin: "2px 10px" }}>{renderStars(item.rating)}</p>
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
                          className={`compare-btn ${comparedItems.includes(item.id) ? "active" : ""}`}
                          aria-label={comparedItems.includes(item.id) ? `Remove ${item.s_name} from comparison` : `Add ${item.s_name} to comparison`}
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

        <Link to="/compare" className="compare-button" aria-label={`Compare ${compareItems.length} items`}>
          Compare
          {compareItems.length > 0 && (
            <span className="compare-count">{compareItems.length}</span>
          )}
        </Link>
      </div>
      <Footerpage />
      <style>
        {`
          .filter-boxes {
            display: flex;
            width: 97.5%;
            margin: 0 auto;
            gap: 1rem;
            padding: 1rem;
            justify-content: center;
            background-color: rgb(255, 255, 255);
            border-radius: 0.5rem;
            margin-bottom: 0.2rem;
            flex-wrap: wrap;
            align-items: center;
          }

          .clear-button {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            border-radius: 0.375rem;
            border: 1px solid #DC3545;
            background-color: white;
            color: #DC3545;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .clear-button:hover {
            background-color: #DC3545;
            color: white;
          }

          .clear-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.3);
          }

          .multi-select-container {
            position: relative;
          }

          .multi-select-dropdown {
            position: relative;
          }

          .dropdown-toggle {
            width: 12rem;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border-radius: 0.375rem;
            border: 1px solid rgb(29, 96, 196);
            background-color: white;
            color: #374151;
            text-align: left;
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.5rem center;
            background-size: 1.5em 1.5em;
            transition: all 0.2s ease;
          }

          .dropdown-toggle:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
            border-color: #3B82F6;
          }

          .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            min-width: 5rem;
            padding: 0.5rem 0;
            margin: 0.125rem 0 0;
            font-size: 1rem;
            color: #212529;
            background-color: #fff;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: 0.375rem;
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,.175);
            max-height: 300px;
            overflow-y: auto;
            width: 300px;
          }

          .dropdown-item {
            display: flex;
            padding: 0.5rem 1.5rem;
            font-weight: 400;
            color: #212529;
            background-color: transparent;
            border: 0;
            cursor: pointer;
            align-items: center;
            gap: 0.5rem;
            transition: background-color 0.2s ease;
          }

          .dropdown-item:hover, .dropdown-item:focus {
            background-color: rgb(137, 186, 235);
            outline: none;
          }

          .dropdown-item input[type="checkbox"] {
            accent-color: #007bff;
            width: 14px;
            height: 14px;
            cursor: pointer;
            margin: 0;
          }

          .rating-option {
            display: flex;
            gap: 2px;
            align-items: center;
          }

          .rating-stars {
            display: flex;
            align-items: center;
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
            transition: transform 0.2s ease;
          }

          .compare-button:hover {
            transform: scale(1.05);
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
            border-radius: 10px;
            overflow: hidden;
          }

          .compared-item {
            border: 3px solid #09E018;
            box-shadow: 0 0 10px rgba(19, 9, 46, 0.3);
          }

          .compare-badge {
            position: absolute;
            top: -4px;
            right: 3px;
            background-color: #0C07A7;
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

          .compare-btn {
            background-color: #6C757D;
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

          .compare-btn:hover {
            transform: scale(1.1);
          }

          .compare-btn.active {
            background-color: #DC3545;
          }

          .serv-list div {
            transition: background-color 0.2s ease;
          }

          .serv-list div:hover, .serv-list div:focus {
            background-color: #F0F0F0;
            outline: none;
          }

          .hospital-item:hover, .hospital-item:focus {
            background-color: #F0F0F0;
            outline: none;
          }

          .error-message {
            padding: 1rem;
            background-color: #FEE2E2;
            color: #991B1B;
            border-radius: 0.375rem;
            margin: 1rem;
            text-align: center;
          }

          @media (max-width: 768px) {
            .filter-boxes {
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
            }

            select, .dropdown-toggle, .clear-button {
              width: 100%;
              max-width: 300px;
            }

            .main-all-box-data {
              flex-direction: column;
            }

            .service-hospitals {
              width: 100%;
            }

            .fildataalign {
              width: 100%;
            }

            .dropdown-item {
              font-size: 0.8rem;
              padding: 0.25rem 0.6rem;
            }

            .dropdown-item input[type="checkbox"] {
              width: 12px;
              height: 12px;
            }
          }

          @media (max-width: 480px) {
            .compare-button {
              padding: 8px 40px;
              font-size: 16px;
            }

            .dropdown-menu {
              min-width: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

ServicesData.propTypes = {
  query: PropTypes.string,
};

export default ServicesData;