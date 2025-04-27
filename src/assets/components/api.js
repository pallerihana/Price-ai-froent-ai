const API_BASE_URL = "http://localhost:5000/api"; // Adjust based on your backend URL

// Helper function to handle fetch requests
const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

// Search services (by service name, hospital, city, or pin code)
export const searchServices = async (query) => {
  const url = `${API_BASE_URL}/services/search?query=${encodeURIComponent(query)}`;
  return fetchData(url);
};

// Fetch single service by ID
export const getServiceById = async (id) => {
  const url = `${API_BASE_URL}/services/${id}`;
  return fetchData(url);
};

// Fetch recommended services
export const getRecommendedServices = async () => {
  const url = `${API_BASE_URL}/services/recommended`;
  return fetchData(url);
};

// Book appointment
export const bookAppointment = async (bookingData) => {
  const url = `${API_BASE_URL}/bookings`;
  return fetchData(url, {
    method: "POST",
    body: JSON.stringify(bookingData),
  });
};

// Fetch comparison data (for multiple service IDs)
export const getComparisonData = async (serviceIds) => {
  const url = `${API_BASE_URL}/services/compare`;
  return fetchData(url, {
    method: "POST",
    body: JSON.stringify({ serviceIds }),
  });
};

// Multiple API calls (e.g., search + recommendations)
export const fetchSearchAndRecommendations = async (query) => {
  const searchUrl = `${API_BASE_URL}/services/search?query=${encodeURIComponent(query)}`;
  const recommendedUrl = `${API_BASE_URL}/services/recommended`;

  try {
    const [searchResponse, recommendedResponse] = await Promise.all([
      fetchData(searchUrl),
      fetchData(recommendedUrl),
    ]);
    return {
      searchResults: searchResponse,
      recommendedServices: recommendedResponse,
    };
  } catch (error) {
    console.error("Error fetching search and recommendations:", error);
    throw error;
  }
};