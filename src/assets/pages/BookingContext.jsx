// BookingContext.jsx
import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null); // Initialize with null

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    setBookings(prev => [...prev, {
      ...booking,
      id: Date.now().toString(),
      status: 'Confirmed',
      bookingDate: new Date().toISOString()
    }]);
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking
    ));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

// Create a custom hook that checks for context existence
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};