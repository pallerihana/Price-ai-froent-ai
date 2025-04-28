import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMicrophone,
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import "./cssfolder/search.css";
import { maindata } from "../datasets/all_services_list";

const API_KEY = "8bea09bdb4f249b38e90dbebd60c0e60"; // OpenCage API Key

const Search = () => {
  const [input, setInput] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
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

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Get unique service names from maindata
    const allServices = [...new Set(maindata.map(item => item.s_name))];
    
    // Filter services that match the input
    const matchedServices = allServices.filter(service =>
      service.toLowerCase().includes(input.toLowerCase())
    );

    // Also suggest the exact input if it's not already in the list
    if (input.trim() && !matchedServices.includes(input.trim())) {
      matchedServices.unshift(input.trim());
    }

    setSuggestions(matchedServices.slice(0, 5)); // Show top 5 suggestions
    setShowSuggestions(matchedServices.length > 0);
  }, [input]);

  const handleSearch = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;
    navigate(`/results/${trimmedInput}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    navigate(`/results/${suggestion}`);
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

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setInput(voiceInput);
      setIsListening(false);
      setTimeout(() => {
        navigate(`/results/${voiceInput}`);
      }, 1000);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handleSetLocation = () => {
    const trimmedLocation = locationInput.trim();
    if (trimmedLocation !== "") {
      navigate(`/results/${trimmedLocation}`);
      setLocationModalOpen(false);
    }
  };

  const handleGetCurrentLocation = () => {
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
    <div className="mainsearchbar" ref={suggestionsRef}>
      <div className="search-container">
        <input
          type="text"
          placeholder={placeholders[placeholderIndex]}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => input.trim() && setShowSuggestions(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="search-input"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
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