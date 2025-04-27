import React from "react";
   import { maindata } from "../datasets/all_services_list";
   import { FaMapMarkerAlt } from "react-icons/fa";
   import { Link } from "react-router-dom"; // Add this import

   const Hospitalslist = () => {
     // Group services by hospital name
     const groupedHospitals = {};
     maindata.forEach((service) => {
       const hospitalName = service.h_name;
       if (!groupedHospitals[hospitalName]) {
         groupedHospitals[hospitalName] = {
           image: service.h_img,
           address: service.h_address,
           services: [],
         };
       }
       groupedHospitals[hospitalName].services.push({
         name: service.s_name,
         price: service.s_charge,
       });
     });

     const hospitalList = Object.entries(groupedHospitals).map(([name, data]) => ({
       name,
       ...data,
     }));

     return (
       <div className="popular-hospitals-wrapper">
         <h2 className="popular-hospitals-title">Most Popular Hospitals</h2>

         <div className="hospital-cards-scroll">
           {hospitalList.map((hospital, index) => (
             <div className="hospital-card" key={index}>
               <div className="hospital-card-header">
                 <Link to={`/hospital/${encodeURIComponent(hospital.name)}`}>
                   <img
                     src={hospital.image}
                     alt={hospital.name}
                     className="hospital-logo"
                     onError={(e) => (e.target.src = "/images/default-hospital.png")}
                   />
                 </Link>
                 <h3 className="hospital-name">{hospital.name}</h3>
               </div>

               <div className="hospital-services-list">
                 {hospital.services.slice(0, 6).map((s, i) => (
                   <div className="hospital-service" key={i}>
                     <span className="service-name">{s.name}</span>
                     <span className="service-price">{s.price}</span>
                   </div>
                 ))}
               </div>

               <div className="hospital-address">
                 <FaMapMarkerAlt color="red" /> {hospital.address}
               </div>
             </div>
           ))}
         </div>

         {/* Embedded CSS (unchanged) */}
         <style>{`
           .popular-hospitals-wrapper {
             padding: 2rem;
             background-color: #f8fbff;
             margin: 10px;
             width: 99%;
             padding: 15px;
             border-radius: 10px;
             border: 1px dotted black;
             cursor: pointer;
           }

           .popular-hospitals-title {
             font-size: 1.8rem;
             font-weight: bold;
             margin-bottom: 1rem;
             color: #222;
           }

           .hospital-cards-scroll {
             display: flex;
             overflow-x: auto;
             gap: 1.5rem;
             padding-bottom: 1rem;
             scroll-snap-type: x mandatory;
           }

           .hospital-cards-scroll::-webkit-scrollbar {
             height: 6px;
             display: none;
           }

           .hospital-cards-scroll::-webkit-scrollbar-thumb {
             background: #ccc;
             border-radius: 5px;
           }

           .hospital-card {
             background-color: #ffffff;
             min-width: 280px;
             max-width: 300px;
             flex-shrink: 0;
             border-radius: 16px;
             padding: 1.5rem;
             box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
             display: flex;
             flex-direction: column;
             scroll-snap-align: start;
             transition: transform 0.3s ease;
             border: 1px dotted black;
           }

           .hospital-card:hover {
             transform: translateY(-6px);
           }

           .hospital-card-header {
             display: flex;
             align-items: center;
             gap: 0.75rem;
             margin-bottom: 1rem;
           }

           .hospital-logo {
             width: 50px;
             height: 50px;
             object-fit: cover;
             border-radius: 10%;
             background-color: #e0e0e0;
           }

           .hospital-name {
             font-size: 1.1rem;
             font-weight: 600;
             color: #0d47a1;
           }

           .hospital-services-list {
             display: flex;
             flex-direction: column;
             gap: 0.5rem;
             margin-bottom: 1rem;
           }

           .hospital-service {
             display: flex;
             justify-content: space-between;
             border-bottom: 1px dashed #d6d6d6;
             font-size: 0.95rem;
             padding-bottom: 4px;
             color: #374151;
           }

           .service-price {
             font-weight: 600;
             color: #10b981;
           }

           .hospital-address {
             font-size: 0.8rem;
             color: #6b7280;
             text-align: right;
             margin-top: auto;
             font-family: Arial, Helvetica, sans-serif;
           }

           @media (max-width: 768px) {
             .hospital-card {
               min-width: 90%;
             }

             .popular-hospitals-title {
               font-size: 1.5rem;
             }
           }
         `}</style>
       </div>
     );
   };

   export default Hospitalslist;