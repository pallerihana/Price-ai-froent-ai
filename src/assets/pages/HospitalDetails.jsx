import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { maindata } from "../datasets/all_services_list";
import { FaMapMarkerAlt, FaArrowLeft, FaShareAlt, FaPhone, FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const HospitalDetails = () => {
  const { hospitalName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [expandedServices, setExpandedServices] = useState({});
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top when hospitalName changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hospitalName]);

  // Memoize filtered data
  const hospitalData = useMemo(() => {
    const filteredServices = maindata.filter(
      (service) => service.h_name === decodeURIComponent(hospitalName)
    );
    const hospitalInfo = filteredServices[0] || null;
    const doctors = [...new Set(filteredServices.map((service) => service.d_name))];

    // Add random ratings and service code if not present
    const enhancedServices = filteredServices.map((service, index) => ({
      ...service,
      rating: service.rating || (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
      s_code: service.s_code || `SVC${index + 1000}`, // Fallback service code
    }));

    // Sort services
    const sortedServices = [...enhancedServices].sort((a, b) => {
      if (sortBy === "price") {
        const priceA = parseFloat(a.s_charge.replace(/[^0-9.-]+/g, ""));
        const priceB = parseFloat(b.s_charge.replace(/[^0-9.-]+/g, ""));
        return priceA - priceB;
      }
      return a.s_name.localeCompare(b.s_name);
    });

    setLoading(false);
    return { hospitalInfo, doctors, sortedServices };
  }, [hospitalName, sortBy]);

  const { hospitalInfo, doctors, sortedServices } = hospitalData;

  // Navigate to service details
  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  // Truncate description to 5 words
  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 5) {
      return words.slice(0, 5).join(" ") + "...";
    }
    return description;
  };

  // Toggle service types
  const toggleServiceTypes = (index) => {
    setExpandedServices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Share URL
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Hospital details URL copied to clipboard!");
    });
  };

  // Sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!bookingForm.name.trim()) errors.name = "Name is required";
    if (!bookingForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = "Valid email is required";
    if (!bookingForm.phone.match(/^\+?\d{10,15}$/))
      errors.phone = "Valid phone number is required";
    if (!bookingForm.date) errors.date = "Date is required";
    return errors;
  };

  // Open booking modal
  const openBookingModal = (service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  // Close booking modal
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingForm({ name: "", email: "", phone: "", date: "" });
    setFormErrors({});
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Submit booking form
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBookingModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 3000); // Auto-close success modal
    }, 1000);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading hospital details...</p>
      </div>
    );
  }

  if (!hospitalInfo) {
    return (
      <div className="error-message">
        <h2>Hospital Not Found</h2>
        <p>No details available for the selected hospital.</p>
        <button className="back-button" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to Hospitals
        </button>
      </div>
    );
  }

  return (
    <div className="hospital-details-wrapper">
      <div className="hospital-details-container">
        {/* Header with Back and Share Buttons */}
        <div className="header-controls">
          <button
            className="back-button"
            onClick={() => navigate("/")}
            aria-label="Go back to hospitals list"
          >
            <FaArrowLeft /> Back to Hospitals
          </button>
          <button
            className="share-button"
            onClick={handleShare}
            aria-label="Share hospital details"
          >
            <FaShareAlt /> Share
          </button>
        </div>

        {/* Hospital Image and Info */}
        <div className="hospital-image-section">
          <img
            src={hospitalInfo.h_img || "/images/default-hospital.png"}
            alt={hospitalInfo.h_name}
            className="hospital-image"
            onError={(e) => (e.target.src = "/images/default-hospital.png")}
          />
          <div className="hospital-info-overlay">
            <h2 className="hospital-name">{hospitalInfo.h_name}</h2>
            <div className="hospital-address">
              <FaMapMarkerAlt color="red" /> {hospitalInfo.h_address}
            </div>
            <div className="doctors-list">
              <h4>Doctors:</h4>
              <ul>
                {doctors.map((doctor, index) => (
                  <li key={index}>{doctor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="hospital-services-section">
          <div className="services-header">
            <h3 className="services-title">Available Services</h3>
            <div className="sort-controls">
              <label htmlFor="sortBy">Sort by: </label>
              <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                <option value="name">Service Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
          <div className="services-grid">
            {sortedServices.map((service, index) => (
              <div className="service-card" key={index} tabIndex={0}>
                <div
                  className="service-image-container"
                  onClick={() => handleServiceClick(service.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={service.s_img}
                    alt={service.s_name}
                    className="service-image"
                    onError={(e) => (e.target.src = "/images/default-service.png")}
                  />
                  <div className="service-overlay">
                    <h4 className="service-name">{service.s_name}</h4>
                    <p className="service-price">Price: {service.s_charge}</p>
                    <p className="service-description">
                      {truncateDescription(service.s_description)}
                    </p>
                  </div>
                </div>
                <div className="service-info">
                  <div className="service-meta">
                    <p className="service-code">Code: {service.s_code}</p>
                    <div className="service-rating">
                      <FaStar color="#f5b81c" /> {service.rating}
                    </div>
                  </div>
                  <div className="service-types">
                    <button
                      className="toggle-types"
                      onClick={() => toggleServiceTypes(index)}
                      aria-expanded={!!expandedServices[index]}
                      aria-label={`Toggle specializations for ${service.s_name}`}
                    >
                      Specializations
                      {expandedServices[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    {expandedServices[index] && (
                      <ul>
                        {service.types.map((type, i) => (
                          <li key={i}>{type.type}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="service-buttons">
                    <button
                      className="call-button"
                      onClick={() => alert(`Call: +1-800-555-1234`)}
                      aria-label={`Call for ${service.s_name}`}
                    >
                      <FaPhone /> Call
                    </button>
                    <button
                      className="booking-button"
                      onClick={() => openBookingModal(service)}
                      aria-label={`Book ${service.s_name}`}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {isBookingModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeBookingModal}
            >
              <motion.div
                className="booking-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="booking-modal-title"
                aria-modal="true"
              >
                <h3 id="booking-modal-title">Book {selectedService?.s_name}</h3>
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleFormChange}
                      aria-required="true"
                      aria-describedby="name-error"
                    />
                    {formErrors.name && (
                      <span className="error-text" id="name-error">{formErrors.name}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleFormChange}
                      aria-required="true"
                      aria-describedby="email-error"
                    />
                    {formErrors.email && (
                      <span className="error-text" id="email-error">{formErrors.email}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleFormChange}
                      aria-required="true"
                      aria-describedby="phone-error"
                    />
                    {formErrors.phone && (
                      <span className="error-text" id="phone-error">{formErrors.phone}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={bookingForm.date}
                      onChange={handleFormChange}
                      min={new Date().toISOString().split("T")[0]}
                      aria-required="true"
                      aria-describedby="date-error"
                    />
                    {formErrors.date && (
                      <span className="error-text" id="date-error">{formErrors.date}</span>
                    )}
                  </div>
                  <div className="modal-buttons">
                    <button
                      type="button"
                      onClick={closeBookingModal}
                      disabled={isSubmitting}
                      aria-label="Cancel booking"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-label="Submit booking"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {isSuccessModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsSuccessModalOpen(false)}
            >
              <motion.div
                className="success-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="success-modal-title"
                aria-modal="true"
              >
                <h3 id="success-modal-title">Booking Confirmed!</h3>
                <p>Your appointment for {selectedService?.s_name} has been booked successfully.</p>
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  aria-label="Close success message"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .hospital-details-wrapper {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fbff 0%, #e6f0fa 100%);
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .hospital-details-container {
          max-width: 1500px;
          margin: 0 auto;
        }

        .header-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .back-button, .share-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          background: #0d47a1;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .back-button:hover, .share-button:hover {
          background: #1565c0;
        }

        .hospital-image-section {
          position: relative;
          margin-bottom: 2rem;
          border-radius: 12px;
          overflow: hidden;
        }

        .hospital-image {
          width: 100%;
          height: 450px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .hospital-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
          padding: 1.5rem;
          width: 100%;
        }

        .hospital-name {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .hospital-address {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .doctors-list {
          margin-top: 0.75rem;
        }

        .doctors-list h4 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .doctors-list ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .doctors-list li {
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.3rem 0.8rem;
          border-radius: 12px;
        }

        .hospital-services-section {
          margin-top: 2rem;
        }

        .services-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .services-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0d47a1;
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #0d47a1;
          font-size: 0.95rem;
        }

        .sort-controls select {
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .service-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px dotted black;
          cursor: pointer;
        }

        .service-card:hover, .service-card:focus {
          transform: translateY(-6px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .service-image-container {
          position: relative;
        }

        .service-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }

        .service-overlay {
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem;
          border-top: 1px solid #e0e0e0;
        }

        .service-overlay .service-name {
          font-size: 1.3rem;
          font-weight: 600;
          color: #0d47a1;
          margin-bottom: 0.5rem;
        }

        .service-overlay .service-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #10b981;
          margin-bottom: 0.5rem;
        }

        .service-overlay .service-description {
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.1rem;
        }

        .service-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .call-button, .booking-button {
          flex: 1;
          padding: 0.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.3s ease;
        }

        .call-button {
          background: #0288d1;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .call-button:hover {
          background: #0277bd;
        }

        .booking-button {
          background: #10b981;
          color: white;
        }

        .booking-button:hover {
          background: #059669;
        }

        .service-info {
          padding: 1rem;
          margin-top: -10px;
        }

        .service-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.1rem;
        }

        .service-code {
          margin-top: -10px;
          font-size: 0.9rem;
          color: #374151;
        }

        .service-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.9rem;
          color: #f5b81c;
        }

        .service-types {
          margin-top: 0.5rem;
        }

        .toggle-types {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #0d47a1;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .toggle-types:hover {
          color: #1565c0;
        }

        .service-types ul {
          list-style: none;
          padding: 0;
          margin-top: 0.5rem;
        }

        .service-types li {
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.5rem;
          padding-left: 1rem;
          position: relative;
        }

        .service-types li::before {
          content: "★";
          position: absolute;
          left: 0;
          color: #10b981;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .booking-modal, .success-modal {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .booking-modal h3, .success-modal h3 {
          font-size: 1.5rem;
          color: #0d47a1;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.95rem;
          color: #374151;
          margin-bottom: 0.3rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0d47a1;
          box-shadow: 0 0 0 3px rgba(13, 71, 161, 0.15);
        }

        .error-text {
          color: #b71c1c;
          font-size: 0.85rem;
          margin-top: 0.3rem;
          display: block;
        }

        .modal-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .modal-buttons button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .modal-buttons button:first-child {
          background: #e0e0e0;
          color: #374151;
        }

        .modal-buttons button:first-child:hover {
          background: #d0d0d0;
        }

        .modal-buttons button:last-child {
          background: #10b981;
          color: white;
        }

        .modal-buttons button:last-child:hover {
          background: #059669;
        }

        .modal-buttons button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .success-modal {
          text-align: center;
        }

        .success-modal p {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 1.5rem;
        }

        .success-modal button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          background: #0d47a1;
          color: white;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .success-modal button:hover {
          background: #1565c0;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0d47a1;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 12px;
          margin: 2rem auto;
          max-width: 600px;
        }

        .error-message h2 {
          font-size: 1.8rem;
          color: #b71c1c;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .hospital-image {
            height: 350px;
          }

          .hospital-name {
            font-size: 1.6rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .header-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .services-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .booking-modal, .success-modal {
            width: 95%;
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hospital-image {
            height: 250px;
          }

          .hospital-name {
            font-size: 1.4rem;
          }

          .hospital-address {
            font-size: 0.9rem;
          }

          .doctors-list li {
            font-size: 0.85rem;
          }

          .service-overlay .service-name {
            font-size: 1.1rem;
          }

          .service-overlay .service-price {
            font-size: 0.95rem;
          }

          .service-buttons {
            flex-direction: column;
          }

          .modal-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HospitalDetails;