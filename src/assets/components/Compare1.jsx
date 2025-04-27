// src/Compare.jsx
import React, { useContext, useEffect, useState } from "react";
import { CompareContext } from "./CompareContext";
import HeaderPage from "./HeaderPage";
import Footerpage from "./FooterPage";
import { MdCompareArrows } from "react-icons/md";
import { Link } from "react-router-dom";
import { getComparisonData } from "./api"; // Import fetch-based API function

const styles = `
.compare-wrapper {
  padding: 20px;
  background-color: #e6f0fa;
  min-height: fit-content;
  cursor:pointer;
}

.compare-header {
  display: flex;
  align-items: center;
  color:black;
  border-left: 10px solid #120914;
  padding: 10px 20px;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(to right, #5ed9ef, #c8f0f6, #dfebf8);
}

.compare-box {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow-x: auto;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  color:black;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-family:arial;
}

.compare-table th,
.compare-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: left;
  vertical-align: top;
}

.compare-table th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.service-image {
  width: 70px;
  height: auto;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.service-image:hover {
  transform: scale(1.05);
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c82333;
}

.no-services {
  padding: 20px;
  font-size: 18px;
  color: #888;
  text-align: center;
}

.service-name {
  font-weight: bold;
  font-size: 16px;
}

.service-code {
  font-size: 13px;
  color: #666;
}
`;

const Compare = () => {
  const { compareItems, removeFromCompare } = useContext(CompareContext);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchComparisonData = async () => {
      if (compareItems.length === 0) return;
      setLoading(true);
      try {
        const serviceIds = compareItems.map(item => item.id);
        const data = await getComparisonData(serviceIds);
        setComparisonData(data);
      } catch (err) {
        setError("Failed to fetch comparison data");
      } finally {
        setLoading(false);
      }
    };
    fetchComparisonData();
  }, [compareItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
          {comparisonData.length === 0 ? (
            <p className="no-services">No services added for comparison.</p>
          ) : (
            <>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Remove</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Hospital & Doctor</th>
                    <th>Price</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item) => (
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
                        {item.h_name}
                        <br />
                        {item.d_name}
                      </td>
                      <td><strong>{item.s_charge}</strong></td>
                      <td>{item.s_description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {comparisonData.length > 1 && (
                <div style={{ marginTop: "30px" }}>
                  <h3 style={{ marginBottom: "15px", fontSize: "20px", color: "#333" }}>
                    💡 Suggested Service with Lower Cost
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      border: "1px dashed #ccc",
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#fdfdfd",
                    }}
                  >
                    <Link to={`/single/${
                      comparisonData.reduce((prev, curr) =>
                        parseInt(curr.s_charge.replace(/[^\d]/g, "")) <
                        parseInt(prev.s_charge.replace(/[^\d]/g, ""))
                          ? curr
                          : prev
                      ).id
                    }`}>
                      <img
                        src={
                          comparisonData.reduce((prev, curr) =>
                            parseInt(curr.s_charge.replace(/[^\d]/g, "")) <
                            parseInt(prev.s_charge.replace(/[^\d]/g, ""))
                              ? curr
                              : prev
                          ).s_img
                        }
                        alt="Suggested Service"
                        style={{ width: "80px", borderRadius: "6px", cursor: "pointer" }}
                      />
                    </Link>
                    <div>
                      <Link to={`/single/${
                        comparisonData.reduce((prev, curr) =>
                          parseInt(curr.s_charge.replace(/[^\d]/g, "")) <
                          parseInt(prev.s_charge.replace(/[^\d]/g, ""))
                            ? curr
                            : prev
                        ).id
                      }`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {
                            comparisonData.reduce((prev, curr) =>
                              parseInt(curr.s_charge.replace(/[^\d]/g, "")) <
                              parseInt(prev.s_charge.replace(/[^\d]/g, ""))
                                ? curr
                                : prev
                            ).s_name
                          }
                        </div>
                      </Link>
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        Lowest Price:{" "}
                        {
                          comparisonData.reduce((prev, curr) =>
                            parseInt(curr.s_charge.replace(/[^\d]/g, "")) <
                            parseInt(prev.s_charge.replace(/[^\d]/g, ""))
                              ? curr
                              : prev
                          ).s_charge
                        }
                      </div>
                      <div style={{ fontSize: "13px" }}>
                        {
                          comparisonData.reduce((prev, curr) =>
                            parseInt(curr.s_charge.replace(/[^\d]/g, "")) <
                            parseInt(prev.s_charge.replace(/[^\d]/g, ""))
                              ? curr
                              : prev
                          ).h_name
                        }{" "}
                        -{" "}
 agir                        {
                          comparisonData.reduce((prev, curr) =>
                            parseInt(curr.s_charge.replace(/[^\d]/g, "")) <
                            parseInt(prev.s_charge.replace(/[^\d]/g, ""))
                              ? curr
                              : prev
                          ).d_name
                        }
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