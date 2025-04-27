import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { maindata } from "../datasets/all_services_list";

const Recommended = () => {
  const navigate = useNavigate();
  const [loadingServiceId, setLoadingServiceId] = useState(null); // Track which service is loading

  // Get unique services based on s_name
  const uniqueServices = Array.from(
    new Map(maindata.map(item => [item.s_name, item])).values()
  );

  // Handle image click with loading
  const handleImageClick = (serviceId) => {
    if (!serviceId) {
      console.error("Service ID is undefined");
      return;
    }

    // Set loading state for the clicked service
    setLoadingServiceId(serviceId);

    // Simulate a delay before navigation (replace with actual async logic if needed)
    setTimeout(() => {
      navigate(`/service/${serviceId}`);
      setLoadingServiceId(null); // Reset loading state after navigation
    }, 100); // 1-second delay for visibility
  };

  return (
    <div className="recommended-container">
      <style>
        {`
          .recommended-container {
            width: 99%;
            padding: 2rem 0;
            margin: 10px;
            padding: 15px;
            border-radius: 10px;
            border: 1px dotted black;
            background-color: #fff;
            overflow-x: hidden;
            font-family: Arial, Helvetica, sans-serif;
          }

          .recommended-title {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #222;
          }

          .horizontal-scroll-wrapper {
            display: flex;
            gap: 1rem;
            overflow-x: auto;
            padding-bottom: 1rem;
            scroll-behavior: smooth;
          }

          .horizontal-scroll-wrapper::-webkit-scrollbar {
            display: none;
          }

          .horizontal-scroll-wrapper::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 10px;
          }

          .service-card {
            min-width: 180px;
            border: 1px solid #e0e0e0;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            text-align: center;
            background-color: #fff;
            flex-shrink: 0;
            transition: transform 0.3s ease;
            position: relative; /* For positioning the spinner */
          }

          .service-card:hover {
            transform: translateY(-5px);
          }

          .service-card img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .service-card img:hover {
            transform: scale(1.05);
          }

          .service-card h3 {
            font-size: 1rem;
            margin-bottom: 0.3rem;
            color: #333;
          }

          .service-code {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 0.3rem;
            font-family: Arial, Helvetica, sans-serif;
          }

          .service-price {
            font-size: 1rem;
            font-weight: bold;
            color: rgb(6, 6, 6);
            font-family: Arial, Helvetica, sans-serif;
          }

          .loading-spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}
      </style>

      <h2 className="recommended-title">Recommended Services</h2>
      <div className="horizontal-scroll-wrapper">
        {uniqueServices.map((item) => (
          <div className="service-card" key={item.id || item.s_name}>
            {loadingServiceId === item.id ? (
              <div className="loading-spinner"></div>
            ) : (
              <img
                src={item.s_img || "/default.png"}
                alt={`${item.s_name} preview`}
                onClick={() => handleImageClick(item.id)}
              />
            )}
            <h3>{item.s_name}</h3>
            <p className="service-code">Code: {item.s_code || "N/A"}</p>
            <p className="service-price">{item.s_charge}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommended;