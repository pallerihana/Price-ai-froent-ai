import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./assets/pages/LandingPage";
import ServicesData from "./assets/pages/ServicesData";
import Compare from "./assets/pages/Compare";
import SingleData from "./assets/pages/SingleData";
import SignUpLogin from "./assets/pages/SignUpLogin"; // Import the SignUpLogin component
import HospitalDetails from "./assets/pages/HospitalDetails";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results/:query" element={<ServicesData />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/single/:id" element={<SingleData />} />
        <Route path="/service/:id" element={<SingleData />} />
        <Route path="/hospital/:hospitalName" element={<HospitalDetails />} />
        <Route path="/auth" element={<SignUpLogin />} /> {/* Add route for SignUpLogin */}
      </Routes>
    </div>
  );
};

export default App;