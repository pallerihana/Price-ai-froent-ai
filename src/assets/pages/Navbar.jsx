import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import "./cssfolder/index.css";
import { Link } from "react-router-dom";
import { CompareContext } from "./CompareContext";

const servicesList = [
  "❤ Cardiology",
  "🧠 Neurology",
  "🎗 Oncology",
  "🦴 Orthopedics",
  "🌮 Gastroenterology",
  "🫘 Nephrology",
  "🚽 Urology",
  "🌬 Pulmonology",
  "🧬 Endocrinology",
  "🌞 Dermatology",
  "🧸 Pediatrics",
  "🤰 Obstetrics",
  "🔪 General Surgery",
  "👁 Ophthalmology",
  "👂👃🗣 Otolaryngology (ENT)",
  "🦠 Infectious Diseases",
  "🧘 Psychiatry",
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationName, setLocationName] = useState("Get Location");

  const filteredServices = servicesList.filter((service) =>
    service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { compareItems } = useContext(CompareContext);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding API to get location name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocationName(data.city || data.locality || "Unknown Location");
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocationName("Location Error");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationName("Permission Denied");
        }
      );
    } else {
      setLocationName("Geolocation Not Supported");
    }
  };

  return (
    <header className="top1">
      <div className="top">
        <div className="topright">
          <Link to="/" className="maintitle">
            <h1>Price AI Vision</h1>
          </Link>
        </div>
        <nav className="topleft">
          <ul>
            <a href=" http://localhost:3000/">
              <li>Become a vendor</li>
            </a>

            <Link to="/compare">
              <li style={{ position: "relative" }}>
                Compare
                {compareItems.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-14px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {compareItems.length}
                  </span>
                )}
              </li>
            </Link>

            {/* Services Dropdown */}
            <li
              className="dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              Services
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {/* Search Bar */}
                  <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {/* Services Grid */}
                  <div className="services-grid">
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service, index) => (
                        <div key={index} className="service-item">
                          {service}
                        </div>
                      ))
                    ) : (
                      <div className="service-item">No results found</div>
                    )}
                  </div>
                </div>
              )}
            </li>

            {/* Location Button */}
            <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", cursor: "pointer" }}>
              <button
                onClick={handleGetLocation}
                style={{
                  backgroundColor: "black",
                  border: "none",
                  borderRadius: "5px",
                  padding: "7px 10px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FontAwesomeIcon icon={faLocationArrow} />
                {locationName}
              </button>
            </li>

            {/* Login / Signup Link */}
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <li
                style={{
                  color: "white",
                  cursor: "pointer",
                  padding: "5px 15px",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#0099cc")}
                onMouseLeave={(e) => (e.target.style.color = "#00b7eb")}
              >
                Login / Signup
                
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
