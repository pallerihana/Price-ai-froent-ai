import React, { useContext, useEffect, useMemo } from "react";
import { CompareContext } from "./CompareContext";
import HeaderPage from "./HeaderPage";
import Footerpage from "./FooterPage";
import { MdCompareArrows } from "react-icons/md";
import { Link } from "react-router-dom";

const styles = `
.compare-wrapper {
  padding: 20px;
  background-color: #e6f0fa;
  min-height: fit-content;
}

.compare-header {
  display: flex;
  align-items: center;
  color: black;
  border-left: 10px solid #120914;
  padding: 10px 20px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(to right, #5ed9ef, #c8f0f6, #dfebf8);
}

.compare-box {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow-x: auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: black;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

.compare-table th,
.compare-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.compare-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.service-image {
  width: 70px;
  height: auto;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.service-image:hover {
  transform: scale(1.08);
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}

.remove-btn:hover {
  background-color: #c82333;
}

.no-services {
  padding: 20px;
  font-size: 18px;
  color: #666;
  text-align: center;
}

.service-name {
  font-weight: 600;
  font-size: 16px;
}

.service-code {
  font-size: 13px;
  color: #999;
}

.suggested-section {
  margin-top: 30px;
}

.suggested-box {
  display: flex;
  gap: 20px;
  align-items: center;
  border: 1px dashed #ccc;
  padding: 15px;
  border-radius: 8px;
  background-color: #fdfdfd;
}

.suggested-box img {
  width: 80px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.suggested-box img:hover {
  transform: scale(1.05);
}

.suggested-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
`;

const Compare = () => {
  const { compareItems, removeFromCompare } = useContext(CompareContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Compare items updated:", compareItems);
  }, [compareItems]);

  const suggestedService = useMemo(() => {
    if (compareItems.length < 2) return null;
    return compareItems.reduce((prev, curr) => 
      parseInt(curr.s_charge.replace(/[^\d]/g, "")) < 
      parseInt(prev.s_charge.replace(/[^\d]/g, "")) 
        ? curr 
        : prev
    );
  }, [compareItems]);

  return (
    <>
      <style>{styles}</style>
      <HeaderPage />

      <div className="compare-wrapper">
        <div className="compare-header">
          <MdCompareArrows size={28} style={{ marginRight: "10px" }} />
          Compare Services
        </div>

        <div className="compare-box">
          {compareItems.length === 0 ? (
            <p className="no-services">No services added for comparison.</p>
          ) : (
            <>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Remove</th>
                    <th>Image</th>
                    <th>Service</th>
                    <th>Hospital & Doctor</th>
                    <th>Price</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {compareItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCompare(item.id)}
                        >
                          ×
                        </button>
                      </td>
                      <td>
                        <Link to={`/single/${item.id}`}>
                          <img
                            src={item.s_img}
                            alt={item.s_name}
                            className="service-image"
                          />
                        </Link>
                      </td>
                      <td>
                        <div className="service-name">{item.s_name}</div>
                        <div className="service-code">Code: {item.s_code}</div>
                      </td>
                      <td>
                        {item.h_name} <br /> {item.d_name}
                      </td>
                      <td>
                        <strong>{item.s_charge}</strong>
                      </td>
                      <td>{item.s_description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Suggested Service */}
              {suggestedService && (
                <div className="suggested-section">
                  <h3 style={{ marginBottom: "15px", fontSize: "22px", color: "#333" }}>
                    💡 Suggested Service with Lowest Price
                  </h3>

                  <div className="suggested-box">
                    <Link to={`/single/${suggestedService.id}`}>
                      <img
                        src={suggestedService.s_img}
                        alt={suggestedService.s_name}
                      />
                    </Link>

                    <div className="suggested-details">
                      <Link
                        to={`/single/${suggestedService.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                          {suggestedService.s_name}
                        </div>
                      </Link>
                      <div style={{ fontSize: "15px", color: "#666" }}>
                        Lowest Price: {suggestedService.s_charge}
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        {suggestedService.h_name} - {suggestedService.d_name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footerpage />
    </>
  );
};

export default Compare;
