import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { maindata } from "../datasets/all_services_list";
import HeaderPage from "./HeaderPage";
import Footerpage from "./FooterPage";
import { useBooking } from './BookingContext';
import { FaClipboardList } from 'react-icons/fa';
import {
  FaHospital,
  FaUserMd,
  FaInfoCircle,
  FaShieldAlt,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaEnvelope,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import RatingAndReview from "./RatingAndReview";
import Recommended from "./Recommended";
import emailjs from '@emailjs/browser';

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
  { name: "United India", plans: ["General Health", "Special Cover", "Saver Plan", "Quick Shield", "Easy Medi"] },
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
    marginTop: "-10px",
  },
  serviceMeta: {
    marginBottom: "20px",
  },
  serviceCode: {
    fontSize: "14px",
    color: "#7f8c8d",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  providerInfo: {
    display: "flex",
    gap: "15px",
    margin: "12px 0",
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
    padding: "10px",
  },
  serviceTypeTag: {
    backgroundColor: "#e0f7fa",
    color: "#00838f",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
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
  },
  formSelect: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px",
    marginBottom: "20px",
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
    marginBottom: "10px",
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
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
    color: "black",
  },
  doctorHoverContainer: {
    position: "relative",
    display: "inline-block",
  },
  doctorTooltipRight: {
    position: "absolute",
    top: "250%",
    left: "calc(100% + 15px)",
    transform: "translateY(-50%)",
    backgroundColor: "#ffffff",
    padding: "18px",
    borderRadius: "10px",
    width: "280px",
    boxShadow: "1px 10px 20px rgba(2, 2, 2, 0.15)",
    border: "1px solid #e0e0e0",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    opacity: 0,
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    pointerEvents: "none",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  doctorProfileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  doctorImage: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    objectFit: "cover",
    backgroundColor: "#f5f7fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    color: "#64748b",
    border: "2px solid #e2e8f0",
  },
  doctorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  doctorName: {
    fontWeight: "600",
    fontSize: "15px",
    color: "#1e293b",
    letterSpacing: "0.2px",
  },
  doctorMeta: {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.4",
  },
  doctorRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#f59e0b",
    fontWeight: "500",
  },
  doctorDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontSize: "13px",
    color: "#475569",
    padding: "8px 0",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
    margin: "6px 0",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  detailIcon: {
    color: "#94a3b8",
    minWidth: "16px",
    display: "flex",
    justifyContent: "center",
  },
  messageButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginTop: "4px",
    width: "100%",
    transition: "background-color 0.2s ease",
    boxShadow: "0 2px 5px rgba(59, 130, 246, 0.2)",
    '&:hover': {
      backgroundColor: "#2563eb",
    }
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

// Add CSS animation for loading spinner
const spin = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const pulseAnimation = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spin, styleSheet.cssRules.length);
styleSheet.insertRule(pulseAnimation, styleSheet.cssRules.length);

const SingleData = () => {
  const { addBooking } = useBooking();
  const { bookings } = useBooking();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
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

  // Initialize EmailJS with your public key
  useEffect(() => {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS Public Key
  }, []);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Fetch service data
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundService = maindata.find((item) => item.id.toString() === id);
      setService(foundService);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Navigate to hospital details
  const handleHospitalClick = () => {
    if (service) {
      navigate(`/hospital/${encodeURIComponent(service.h_name)}`);
    }
  };

  if (loading)
    return (
      <div style={styles.loadingSpinner}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  if (!service) return <div style={styles.notFound}>Service not found</div>;

  const baseCharge = parseInt(service.s_charge.replace(/[^\d]/g, "")) || 0;
  const discount = network === "in-network" && selectedInsurance && selectedPlan ? 10000 : 0;
  const finalAmount = Math.max(0, baseCharge - discount);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const bookingDetails = {
      serviceName: service.s_name,
      hospitalName: service.h_name,
      doctorName: service.d_name,
      finalAmount: finalAmount,
      serviceType: selectedServiceType || service.types[0]?.type,
      paymentMethod: formData.paymentMethod,
    };
  
    // Add booking to context
    addBooking(bookingDetails);
  
    // Prepare email parameters
    const emailParams = {
      name: formData.name,
      email: formData.email,
      serviceName: bookingDetails.serviceName,
      hospitalName: bookingDetails.hospitalName,
      doctorName: bookingDetails.doctorName,
      finalAmount: bookingDetails.finalAmount.toLocaleString(),
      serviceType: bookingDetails.serviceType,
      paymentMethod: bookingDetails.paymentMethod,
    };
  
    // ✅ Add Public Key here
    emailjs
      .send(
        "service_ow1tk3g",        // Your EmailJS Service ID
        "template_v0l4kbo",       // Your EmailJS Template ID
        emailParams,
        "cvQb1RbiweDo5BR16"    // 🔥 Your Correct EmailJS Public Key here
      )
      .then(
        (response) => {
          console.log("Email sent successfully!", response.status, response.text);
          alert(`Booking confirmed! Confirmation email sent to ${formData.email}`);
        },
        (error) => {
          console.error("Failed to send email:", error);
          alert("Booking confirmed, but failed to send confirmation email. Please contact support.");
        }
      );
  
    // Reset form and close modal
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", paymentMethod: "" });
  };
  
  // --------------------------------------------

  const applyStyles = (...styleObjects) => {
    return Object.assign({}, ...styleObjects, {
      ...(styleObjects[styleObjects.length - 1] || {}),
    });
  };

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
                <span
                  style={{
                    color: "#e74c3c",
                    cursor: "pointer",
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onClick={handleHospitalClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector(".tooltip").style.opacity = "1";
                    e.currentTarget.querySelector(".tooltip").style.transform = "translateY(-10px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector(".tooltip").style.opacity = "0";
                    e.currentTarget.querySelector(".tooltip").style.transform = "translateY(0)";
                  }}
                >
                  <FaHospital />
                  {service.h_name}
                  <span
                    className="tooltip"
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#2c3e50",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      opacity: "0",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                      zIndex: "10",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    Click to open Hospital Details
                  </span>
                </span>

                <div style={styles.doctorHoverContainer}>
                  <span
                    style={{
                      color: "#3498db",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.nextSibling.style.opacity = "1";
                      e.currentTarget.nextSibling.style.transform = "translateY(-50%) translateX(0)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.nextSibling.style.opacity = "0";
                      e.currentTarget.nextSibling.style.transform = "translateY(-50%) translateX(-10px)";
                    }}
                  >
                    <FaUserMd /> Dr. {service.d_name}
                  </span>
                  <div style={styles.doctorTooltipRight}>
                    <div style={styles.doctorProfileHeader}>
                      <div style={styles.doctorImage}>
                        {service.d_img ? (
                          <img
                            src={service.d_img}
                            alt={`Dr. ${service.d_name}`}
                            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                          />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <div style={styles.doctorInfo}>
                        <div style={styles.doctorName}>Dr. {service.d_name}</div>
                        <div style={styles.doctorMeta}>
                          <span style={styles.doctorRating}>
                            ⭐ {service.rating || "4.8"} ({service.reviews || "120"} reviews)
                          </span>
                        </div>
                        <div style={styles.doctorMeta}>
                          {service.experience || "8"} years experience
                        </div>
                      </div>
                    </div>

                    <div style={styles.doctorDetails}>
                      <div style={styles.detailRow}>
                        <FaUserMd size={12} />
                        <span>Specialization: {service.s_name || "multi"}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <FaHospital size={12} />
                        <span>Operations: {service.operations || "1,200+"}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <FaMapMarkerAlt size={12} />
                        <span>{service.h_name || "City General Hospital"}</span>
                      </div>
                    </div>

                    <button style={styles.messageButton}>
                      <FaEnvelope size={12} /> Message
                    </button>
                  </div>
                </div>
              </div>
              <p style={styles.address}>
                <FaMapMarkerAlt color="red" /> {service.h_address}
              </p>
            </div>

            <div style={styles.serviceDescription}>
              <p>
                {expandedInfo
                  ? service.s_description
                  : `${service.s_description.substring(0, 150)}...`}
              </p>
              {service.s_description.length > 150 && (
                <button style={styles.readMoreBtn} onClick={toggleExpandedInfo}>
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
                <span style={styles.price}>₹{baseCharge.toLocaleString()}</span>
                <span style={styles.discountBadge}>20% OFF</span>
              </div>
              <div style={styles.originalPrice}>
                <del>₹77,000</del>
                <span style={styles.savings}>
                  You save ₹{(77000 - baseCharge).toLocaleString()}
                </span>
              </div>
            </div>
            <div style={styles.subservice}>
              <h2>
                <FaInfoCircle /> Select Service
              </h2>
              <div style={styles.serviceTypes}>
                {service.types.map((type, index) => (
                  <div
                    key={index}
                    style={applyStyles(
                      styles.serviceTypeTag,
                      selectedServiceType === type.type && {
                        backgroundColor: "#3498db",
                        color: "white",
                      }
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
                  <label
                    style={applyStyles(
                      styles.radioLabel,
                      network === "in-network" && {
                        borderColor: "#3498db",
                        backgroundColor: "#f0f8ff",
                      }
                    )}
                  >
                    <input
                      type="radio"
                      name="network"
                      value="in-network"
                      checked={network === "in-network"}
                      onChange={(e) => setNetwork(e.target.value)}
                    />
                    <span>In-network</span>
                  </label>
                  <label
                    style={applyStyles(
                      styles.radioLabel,
                      network === "out-network" && {
                        borderColor: "#3498db",
                        backgroundColor: "#f0f8ff",
                      }
                    )}
                  >
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
                          .find((ins) => ins.name === selectedInsurance)
                          ?.plans.map((plan, idx) => (
                            <option key={idx} value={plan}>
                              {plan}
                            </option>
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
                  <div
                    style={applyStyles(styles.breakdownItem, {
                      color: "#27ae60",
                    })}
                  >
                    <span>Insurance Discount:</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div
                  style={applyStyles(styles.breakdownItem, {
                    borderTop: "1px solid #ddd",
                    paddingTop: "10px",
                    marginTop: "10px",
                    fontWeight: "700",
                    fontSize: "17px",
                  })}
                >
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
              <button style={styles.btnSecondary}>
                <FaPhone /> Contact Hospital
              </button>
              <button
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '15px 25px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  zIndex: 100,
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
                  }
                }}
                onClick={() => navigate('/bookings')}
              >
                <FaClipboardList size={18} />
                My Bookings
                {bookings.length > 0 && (
                  <span style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    marginLeft: '8px',
                    animation: 'pulse 1.5s infinite'
                  }}>
                    {bookings.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div
            style={styles.modalOverlay}
            onClick={() => setShowModal(false)}
          ></div>
          <div style={styles.modal}>
            <h2>
              <FaUser /> Book Appointment
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>
                  <FaUser /> Name
                </label>
                <input
                  style={styles.formInput}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>
                  <FaEnvelope /> Email
                </label>
                <input
                  style={styles.formInput}
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>
                  <FaPhone /> Phone
                </label>
                <input
                  style={styles.formInput}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>
                  <FaCreditCard /> Payment Method
                </label>
                <select
                  style={styles.formInput}
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div style={styles.actionButtons}>
                <button type="submit" style={styles.btnPrimary}>
                  Confirm Booking
                </button>
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
      <RatingAndReview />
      <Recommended />
      <Footerpage />
    </>
  );
};

export default SingleData;