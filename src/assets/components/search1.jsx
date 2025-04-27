// src/Search.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaSearch, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { fetchSearchAndRecommendations } from "./api"; // Import fetch-based API function
import "./cssfolder/search.css";

const API_KEY = "8bea09bdb4f249b38e90dbebd60c0e60";

const Search = () => {
  const [input, setInput] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedServices, setRecommendedServices] = useState([]);
  const navigate = useNavigate();

  const placeholders = [
    "Enter Service Name...",
    "Enter City Name...",
    "Enter Hospital Name...",
    "Enter Pin code...."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;
    try {
      const { searchResults, recommendedServices } = await fetchSearchAndRecommendations(trimmedInput);
      setSearchResults(searchResults);
      setRecommendedServices(recommendedServices);
      navigate(`/results/${trimmedInput}`);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event) => {
      const voiceInput = event.results[0][0].transcript;
      setInput(voiceInput);
      setIsListening(false);
      try {
        const { searchResults, recommendedServices } = await fetchSearchAndRecommendations(voiceInput);
        setSearchResults(searchResults);
        setRecommendedServices(recommendedServices);
        navigate(`/results/${voiceInput}`);
      } catch (error) {
        console.error("Voice search failed:", error);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSetLocation = async () => {
    const trimmedLocation = locationInput.trim();
    if (trimmedLocation !== "") {
      try {
        const { searchResults, recommendedServices } = await fetchSearchAndRecommendations(trimmedLocation);
        setSearchResults(searchResults);
        setRecommendedServices(recommendedServices);
        navigate(`/results/${trimmedLocation}`);
        setLocationModalOpen(false);
      } catch (error) {
        console.error("Location search failed:", error);
      }
    }
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const components = data.results[0].components;
            const city =
              components.city ||
              components.town ||
              components.village ||
              components.state ||
              components.country ||
              "Unknown Location";

            if (city === "Unknown Location") {
              alert("Could not determine your city.");
              return;
            }

            const { searchResults, recommendedServices } = await fetchSearchAndRecommendations(city);
            setSearchResults(searchResults);
            setRecommendedServices(recommendedServices);
            navigate(`/results/${encodeURIComponent(city)}`);
            setLocationModalOpen(false);
          } else {
            alert("No results from geocoding API.");
          }
        } catch (error) {
          console.error("Error fetching reverse geolocation:", error);
          alert("Could not fetch current location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Permission denied or unavailable.");
      }
    );
  };

  return (
    <div className="mainsearchbar">
      <input
        type="text"
        placeholder={placeholders[placeholderIndex]}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="search-input"
      />
      <button
        onClick={handleSearch}
        className="search-button"
        aria-label="Search"
      >
        <FaSearch />
      </button>
      <button
        onClick={handleVoiceSearch}
        className={`voice-button ${isListening ? "listening" : ""}`}
        aria-label="Voice search"
      >
        <FaMicrophone size={18} />
      </button>
      <button
        className="location-icon-button"
        onClick={() => setLocationModalOpen(true)}
        aria-label="Set location"
      >
        <FaMapMarkerAlt size={30} color="red" />
      </button>
      {locationModalOpen && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => setLocationModalOpen(false)}
          />
          <div className="location-modal">
            <div className="location-modal-header">
              <h4>
                <FaTimes
                  className="close-icon"
                  size={20}
                  onClick={() => setLocationModalOpen(false)}
                  style={{ cursor: "pointer" }}
                />
              </h4>
            </div>
            <input
              type="text"
              placeholder="Enter your city or location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <div className="location-buttons">
              <button onClick={handleSetLocation} className="set-location-btn">
                Set Location
              </button>
              <button
                onClick={handleGetCurrentLocation}
                className="get-location-btn"
              >
                Get Current Location
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;