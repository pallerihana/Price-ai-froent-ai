// src/SingleData.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderPage from "./HeaderPage";
import Footerpage from "./FooterPage";
import { FaHospital, FaUserMd, FaInfoCircle, FaShieldAlt, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaMoneyBillWave, FaCreditCard, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import RatingAndReview from "./RatingAndReview";
import Recommended from "./Recommended";
import { getServiceById, bookAppointment } from "./api"; // Import fetch-based API functions

const insuranceData = [
  { name: "TATA AIG", plans: ["Gold", "Silver", "Platinum", "Basic", "Plus"] },
  { name: "HDFC Ergo", plans: ["Smart", "Elite", "Health First", "Premium", "Essential"] },
  { name: "ICICI Lombard", plans: ["Health Protect", "Complete Shield", "Care Plus", "Secure", "Advanced"] },
  { name: "Star Health", plans: ["Red", "Green", "Blue", "Family Care", "Flexi"] },
  { name: "Bajaj Allianz", plans: ["Easy Health", "Total Protect", "Family First", "Comprehensive", "Secure Plan"] },
  { name: "Niva Bupa", plans: ["Health Recharge", "Go Active", "Health Companion", "ReAssure", "Smart Health"] },
  { name: "Reliance Health", plans: ["Standard", "Pro", "Elite", "Classic", "Wellness"] },
  { name: "Oriental Insurance", plans: ["Gold Shield", "MediCare", "Secure Plus", "Well Plan", "Health Value"] },
  { name: "New India Assurance", plans: ["Freedom", "Family Floater", "Arogya", "Silver Health", "Mega Care"] },
  { name: "United India", plans: ["General Health", "Special Cover", "Saver Plan", "Quick Shield", "Easy Medi"] }
];

const styles = {
  container: {
    width: "99%",
    margin: "3px auto",
    padding: "5px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    border: "1px dotted black",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "row",
  },
  serviceGrid: {
    display: "flex",
    width: "100%",
    gap: "40px",
    marginTop: "30px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    }
  },
  imageContainer: {
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    height: "fit-content",
    top: "80px",
    left: "20px",
    width: "500px",
  },
  serviceImage: {
    width: "500px",
    height: "400px",
    display: "block",
    borderRadius: "10px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    }
  },
  serviceDetails: {
    padding: "10px",
    width: "100%",
    maxHeight: "100vh",
    overflowY: "auto",
    paddingRight: "20px",
  },
  serviceTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "2px",
    color: "#2c3e50",
    marginTop: "-10px"
  },
  serviceMeta: {
    marginBottom: "20px",
    "& > *": {
      display: "block",
      marginBottom: "8px",
    }
  },
  serviceCode: {
    fontSize: "14px",
    color: "#7f8c8d",
    fontFamily: "Arial, Helvetica, sans-serif"
  },
  providerInfo: {
    display: "flex",
    gap: "15px",
    margin: "12px 0",
    "& > span": {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "15px",
    }
  },
  address: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
  },
  serviceDescription: {
    lineHeight: "1.6",
    marginBottom: "25px",
    position: "relative",
  },
  readMoreBtn: {
    background: "none",
    border: "none",
    color: "#3498db",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "10px",
    fontWeight: "600",
    "&:hover": {
      textDecoration: "underline",
    }
  },
  priceSection: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px",
  },
  currentPrice: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "5px",
  },
  price: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2c3e50",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  discountBadge: {
    backgroundColor: "#27ae60",
    color: "white",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
  },
  originalPrice: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    "& del": {
      color: "#95a5a6",
      fontSize: "16px",
    }
  },
  savings: {
    fontSize: "14px",
    color: "#27ae60",
    fontWeight: "600",
  },
  serviceTypes: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "25px",
    padding: "10px"
  },
  serviceTypeTag: {
    backgroundColor: "#e0f7fa",
    color: "#00838f",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    "&.selected": {
      backgroundColor: "#3498db",
      color: "white",
    }
  },
  insuranceSection: {
    border: "1px solid #3498db",
    borderRadius: "8px",
    padding: "25px",
    marginBottom: "30px",
    backgroundColor: "#f0f8ff",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "20px",
    marginBottom: "20px",
    color: "#2c3e50",
  },
  networkSelection: {
    marginBottom: "20px",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    padding: "10px 15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    transition: "all 0.2s ease",
    "&.active": {
      borderColor: "#3498db",
      backgroundColor: "#f0f8ff",
    },
    "& input": {
      margin: "0",
    }
  },
  formSelect: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px",
    marginBottom: "20px",
    "&:focus": {
      outline: "none",
      borderColor: "#3498db",
      boxShadow: "0 0 0 2px rgba(52,152,219,0.2)",
    }
  },
  priceBreakdown: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "20px",
  },
  breakdownItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    "&.discount": {
      color: "#27ae60",
    },
    "&.total": {
      borderTop: "1px solid #ddd",
      paddingTop: "10px",
      marginTop: "10px",
      fontWeight: "700",
      fontSize: "17px",
    }
  },
  actionButtons: {
    width: "100%",
    height: "50px",
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },
  btnPrimary: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#2980b9",
      transform: "translateY(-2px)",
    }
  },
  btnSecondary: {
    backgroundColor: "white",
    color: "#3498db",
    border: "1px solid #3498db",
    padding: "12px 25px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f0f8ff",
      transform: "translateY(-2px)",
    }
  },
  notFound: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#e74c3c",
  },
  subservice: {
    border: "1px solid lightgray",
    padding: "10px 10px 0px",
    borderRadius: "10px",
    marginBottom: "10px"
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    "&:after": {
      content: '""',
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    zIndex: 1000,
    width: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    color: "black"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  formInput: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

const spin = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spin, styleSheet.cssRules.length);

const SingleData = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchService = async () => {
      setLoading(true);
      try {
        const data = await getServiceById(id);
        setService(data);
      } catch (err) {
        setError("Failed to fetch service details");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleInsuranceChange = (e) => {
    setSelectedInsurance(e.target.value);
    setSelectedPlan("");
  };

  const toggleExpandedInfo = () => {
    setExpandedInfo(!expandedInfo);
  };

  const handleServiceTypeClick = (type) => {
    setSelectedServiceType(type);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...formData,
        serviceId: id,
        serviceName: service?.s_name,
        hospitalName: service?.h_name,
      };
      await bookAppointment(bookingData);
      alert(`Booking confirmed! Confirmation email sent to ${formData.email}`);
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", paymentMethod: "" });
    } catch (error) {
      alert("Failed to book appointment");
    }
  };

  const applyStyles = (...styleObjects) => {
    return Object.assign({}, ...styleObjects);
  };

  if (loading) return <div style={styles.loadingSpinner}></div>;
  if (error) return <div style={styles.notFound}>{error}</div>;
  if (!service) return <div style={styles.notFound}>Service not found</div>;

  const baseCharge = parseInt(service.s_charge.replace(/[^\d]/g, "")) || 0;
  const discount = network === "in-network" && selectedInsurance && selectedPlan ? 10000 : 0;
  const finalAmount = Math.max(0, baseCharge - discount);

  return (
    <>
      <HeaderPage />
      <div style={styles.container}>
        <div style={styles.serviceGrid}>
          <div style={styles.imageContainer}>
            <img 
              src={service.s_img} 
              alt={service.s_name} 
              style={styles.serviceImage}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "/images/default-service.jpg";
              }}
            />
          </div>
          <div style={styles.serviceDetails}>
            <h1 style={styles.serviceTitle}>{service.s_name}</h1>
            <div style={styles.serviceMeta}>
              <span style={styles.serviceCode}>Code: {service.s_code}</span>
              <div style={styles.providerInfo}>
                <span style={{ color: "#e74c3c" }}><FaHospital /> {service.h_name}</span>
                <span style={{ color: "#3498db" }}><FaUserMd /> Dr. {service.d_name}</span>
              </div>
              <p style={styles.address}><FaMapMarkerAlt color="red"/> {service.h_address}</p>
            </div>
            <div style={styles.serviceDescription}>
              <p>{expandedInfo ? service.s_description : `${service.s_description.substring(0, 150)}...`}</p>
              {service.s_description.length > 150 && (
                <button 
                  style={styles.readMoreBtn} 
                  onClick={toggleExpandedInfo}
                >
                  {expandedInfo ? (
                    <>
                      <FaChevronUp size={12} /> Show less
                    </>
                  ) : (
                    <>
                      <FaChevronDown size={12} /> Read more
                    </>
                  )}
                </button>
              )}
            </div>
            <hr />
            <div style={styles.priceSection}>
              <div style={styles.currentPrice}>
                <span style={styles.price}> ₹{baseCharge.toLocaleString()}</span>
                <span style={styles.discountBadge}>20% OFF</span>
              </div>
              <div style={styles.originalPrice}>
                <del>₹77,000</del>
                <span style={styles.savings}>You save ₹{(77000 - baseCharge).toLocaleString()}</span>
              </div>
            </div>
            <div style={styles.subservice}>
              <h2><FaInfoCircle /> Select Service</h2>
              <div style={styles.serviceTypes}>
                {service.types.map((type, index) => (
                  <div 
                    key={index} 
                    style={applyStyles(
                      styles.serviceTypeTag,
                      selectedServiceType === type.type && styles.serviceTypeTag["&.selected"]
                    )}
                    onClick={() => handleServiceTypeClick(type.type)}
                  >
                    {type.type}
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.insuranceSection}>
              <h3 style={styles.sectionTitle}>
                <FaShieldAlt /> Insurance Options
              </h3>
              <div style={styles.networkSelection}>
                <div style={styles.radioGroup}>
                  <label style={applyStyles(
                    styles.radioLabel,
                    network === "in-network" && styles.radioLabel["&.active"]
                  )}>
                    <input
                      type="radio"
                      name="network"
                      value="in-network"
                      checked={network === "in-network"}
                      onChange={(e) => setNetwork(e.target.value)}
                    />
                    <span>In-network</span>
                  </label>
                  <label style={applyStyles(
                    styles.radioLabel,
                    network === "out-network" && styles.radioLabel["&.active"]
                  )}>
                    <input
                      type="radio"
                      name="network"
                      value="out-network"
                      checked={network === "out-network"}
                      onChange={(e) => setNetwork(e.target.value)}
                    />
                    <span>Out-network</span>
                  </label>
                </div>
              </div>
              {network === "in-network" && (
                <>
                  <div>
                    <label>Insurance Provider</label>
                    <select
                      value={selectedInsurance}
                      onChange={handleInsuranceChange}
                      style={styles.formSelect}
                    >
                      <option value="">Select your insurance</option>
                      {insuranceData.map((ins) => (
                        <option key={ins.name} value={ins.name}>
                          {ins.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedInsurance && (
                    <div>
                      <label>Insurance Plan</label>
                      <select
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        style={styles.formSelect}
                      >
                        <option value="">Select your plan</option>
                        {insuranceData
                          .find(ins => ins.name === selectedInsurance)
                          ?.plans.map((plan, idx) => (
                            <option key={idx} value={plan}>{plan}</option>
                          ))}
                      </select>
                    </div>
                  )}
                </>
              )}
              <div style={styles.priceBreakdown}>
                <h4>Price Breakdown</h4>
                <div style={styles.breakdownItem}>
                  <span>Standard Charge:</span>
                  <span>₹{baseCharge.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div style={applyStyles(styles.breakdownItem, styles.breakdownItem["&.discount"])}>
                    <span>Insurance Discount:</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={applyStyles(styles.breakdownItem, styles.breakdownItem["&.total"])}>
                  <span>Final Amount:</span>
                  <span>₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={styles.actionButtons}>
              <button 
                style={styles.btnPrimary}
                onClick={() => setShowModal(true)}
              >
                Book Appointment
              </button>
              <button style={styles.btnSecondary}><FaPhone /> Contact Hospital</button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowModal(false)}></div>
          <div style={styles.modal}>
            <h2><FaUser /> Book Appointment</h2>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label><FaUser /> Name</label>
                <input
                  style={styles.formInput}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label><FaEnvelope /> Email</label>
                <input
                  style={styles.formInput}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label><FaPhone /> Phone</label>
                <input
                  style={styles.formInput}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <label><FaCreditCard /> Payment Method</label>
                <select
                  style={styles.formInput}
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div style={styles.actionButtons}>
                <button type="submit" style={styles.btnPrimary}>Confirm Booking</button>
                <button 
                  type="button" 
                  style={styles.btnSecondary} 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      <RatingAndReview/>
      <Recommended/>
      <Footerpage />
    </>
  );
};

export default SingleData;