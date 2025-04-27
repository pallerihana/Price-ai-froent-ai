import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { maindata } from "../datasets/all_services_list";

const ServiceBoxes = () => {
  const navigate = useNavigate();
  const [loadingServiceId, setLoadingServiceId] = useState(null); // Track which service is loading

  // Group services by category (s_name)
  const groupedByCategory = maindata.reduce((acc, service) => {
    const key = service.s_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(service);
    return acc;
  }, {});

  // Pick the first 4 unique categories
  const categories = Object.keys(groupedByCategory).slice(0, 4);

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
    <div className="outer-wrapper">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .outer-wrapper {
            width: fit-content;
            display: flex;
            justify-content: center;
            margin: 20px auto;
          }

          .service-boxes-container {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            justify-content: space-evenly;
            gap: 10px;
          }

          .service-box {
            display: flex;
            flex-wrap: wrap;
            width: 370px;
            background-color: white;
            justify-content: center;
            padding: 15px;
            border-radius: 10px;
            border: 1px dotted black;
          }

          .service-title {
            width: 100%;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 2px;
            text-align: center;
            color: #222;
            border-bottom: 1px solid #ddd;
            padding-bottom: 2px;
          }

          .service-item {
            width: 150px;
            text-align: left;
            margin: 5px;
            position: relative; /* For positioning the spinner */
          }

          .service-img {
            width: 130px;
            height: 100px;
            border-radius: 2px;
            margin: 1px auto;
            object-fit: cover;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .service-img:hover {
            transform: scale(1.05);
          }

          .service-name {
            font-size: 15px;
            font-weight: 500;
            color: #333;
            font-family: Arial, Helvetica, sans-serif;
          }

          .service-charge {
            font-size: 14px;
            font-weight: 400;
            color: #555;
            font-family: Arial, Helvetica, sans-serif;
            margin-bottom: -10px;
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

      <div className="service-boxes-container">
        {categories.map((category, index) => (
          <div className="service-box" key={index}>
            <div className="service-title">{category}</div>
            {groupedByCategory[category].slice(0, 4).map((service, idx) => (
              <div className="service-item" key={idx}>
                {loadingServiceId === service.id ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <img
                    src={service.s_image || service.s_img || "/default.png"}
                    alt={service.s_name}
                    className="service-img"
                    onClick={() => handleImageClick(service.id)}
                  />
                )}
                <p className="service-name">{service.s_name}</p>
                <p className="service-charge" style={{color:'green' ,  fontWeight: "bold"}}>{service.s_charge}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceBoxes;