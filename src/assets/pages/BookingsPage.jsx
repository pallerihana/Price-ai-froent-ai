import React, { useState, useMemo, useCallback } from 'react';
import { useBooking } from './BookingContext';
import { 
  FaCalendarAlt, 
  FaHospital, 
  FaUserMd, 
  FaTimes, 
  FaPrint, 
  FaFileDownload,
  FaArrowLeft,
  FaSearch,
  FaSort,
  FaInfoCircle,
  FaEnvelope,
  FaRedo
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const BookingsPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52,152,219,0.1);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const EmptyText = styled.p`
  color: #7f8c8d;
  margin-bottom: 20px;
  font-size: 16px;
`;

const PrimaryButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #2980b9;
  }
`;

const BookingsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 5px solid ${props => props.statusColor};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
`;

const ServiceName = styled.h3`
  color: #2c3e50;
  margin: 0;
  font-size: 18px;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const StatusBadge = styled.span`
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  background-color: ${props => 
    props.status === 'Cancelled' ? '#e74c3c' : 
    props.status === 'Completed' ? '#2ecc71' : '#3498db'};
`;

const BookingDetails = styled.div`
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #34495e;
  font-size: 14px;
`;

const Icon = styled.span`
  color: #7f8c8d;
  width: 16px;
  display: flex;
  justify-content: center;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ecf0f1;
  align-items: center;
`;

const Price = styled.span`
  font-weight: bold;
  color: #27ae60;
  font-size: 16px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #3498db;
  border: 1px solid #3498db;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #2980b9;
    color: #2980b9;
  }
`;

const CancelButton = styled.button`
  background: white;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #fdedec;
    border-color: #c0392b;
    color: #c0392b;
  }
`;

const DetailsButton = styled.button`
  background: #f1c40f;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #e1b307;
  }
`;

const StatusButton = styled.button`
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #27ae60;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const RescheduleButton = styled.button`
  background: #9b59b6;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #8e44ad;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const ModalTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const ModalDetails = styled.div`
  margin-bottom: 20px;
`;

const ModalCloseButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: #2980b9;
  }
`;

const ErrorMessage = styled.div`
  background: #fdedec;
  color: #c0392b;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #3498db;
  font-size: 16px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: #34495e;
`;

// Helper component for booking details
const BookingDetail = React.memo(({ icon, text }) => (
  <DetailRow>
    <Icon>{icon}</Icon>
    <span>{text}</span>
  </DetailRow>
));

// Helper function for status colors
const getStatusColor = (status) => {
  switch(status) {
    case 'Cancelled': return '#e74c3c';
    case 'Completed': return '#2ecc71';
    default: return '#3498db';
  }
};

const BookingsPage = () => {
  const { bookings, cancelBooking, updateBookingStatus } = useBooking();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  // Format date
  const formatDate = useCallback((dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.serviceName.toLowerCase().includes(query) ||
          booking.hospitalName.toLowerCase().includes(query) ||
          booking.doctorName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      } else if (sortBy === 'amount') {
        return b.finalAmount - a.finalAmount;
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [bookings, searchQuery, sortBy, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * bookingsPerPage;
    return filteredBookings.slice(startIndex, startIndex + bookingsPerPage);
  }, [filteredBookings, currentPage]);

  // Handle actions
  const handleCancel = useCallback((bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setIsLoading(true);
      try {
        cancelBooking(bookingId);
      } catch (err) {
        setError('Failed to cancel booking');
      } finally {
        setIsLoading(false);
      }
    }
  }, [cancelBooking]);

  const handleStatusUpdate = useCallback((bookingId, newStatus) => {
    setIsLoading(true);
    try {
      updateBookingStatus(bookingId, newStatus);
    } catch (err) {
      setError('Failed to update booking status');
    } finally {
      setIsLoading(false);
    }
  }, [updateBookingStatus]);

  const handleReschedule = useCallback((bookingId) => {
    alert(`Rescheduling booking ${bookingId}. Please contact support to choose a new date.`);
  }, []);

  const handleSendConfirmation = useCallback((booking) => {
    alert(`Confirmation email for booking ${booking.id} sent to your registered email.`);
  }, []);

  const handlePrint = useCallback((booking) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Booking ${booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2c3e50; }
            .detail { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>Booking Details</h1>
          <div class="detail"><strong>Service:</strong> ${booking.serviceName}</div>
          <div class="detail"><strong>Hospital:</strong> ${booking.hospitalName}</div>
          <div class="detail"><strong>Doctor:</strong> ${booking.doctorName}</div>
          <div class="detail"><strong>Date:</strong> ${formatDate(booking.bookingDate)}</div>
          <div class="detail"><strong>Amount:</strong> ₹${booking.finalAmount.toLocaleString()}</div>
          <div class="detail"><strong>Status:</strong> ${booking.status}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [formatDate]);

  const handleDownload = useCallback((booking) => {
    const content = `
Booking ID: ${booking.id}
Service: ${booking.serviceName}
Hospital: ${booking.hospitalName}
Doctor: ${booking.doctorName}
Date: ${formatDate(booking.bookingDate)}
Amount: ₹${booking.finalAmount.toLocaleString()}
Status: ${booking.status}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking_${booking.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [formatDate]);

  const openDetailsModal = useCallback((booking) => {
    setSelectedBooking(booking);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setSelectedBooking(null);
  }, []);

  return (
    <BookingsPageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)} aria-label="Go back">
          <FaArrowLeft size={18} />
        </BackButton>
        <Title>My Bookings</Title>
      </Header>

      {/* Filters and Search */}
      <Controls>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search by service, hospital, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search bookings"
          />
        </SearchContainer>
        <FilterContainer>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </FilterSelect>
          <FilterSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort bookings"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </FilterSelect>
        </FilterContainer>
      </Controls>

      {/* Error and Loading States */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoading && <LoadingSpinner>Loading...</LoadingSpinner>}

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState>
          <EmptyText>
            {bookings.length === 0 
              ? "You don't have any bookings yet." 
              : "No bookings match your search criteria."}
          </EmptyText>
          <PrimaryButton onClick={() => navigate('/')}>
            Book a Service
          </PrimaryButton>
        </EmptyState>
      ) : (
        <>
          <BookingsContainer>
            {paginatedBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                statusColor={getStatusColor(booking.status)}
              >
                <BookingHeader>
                  <div>
                    <ServiceName>{booking.serviceName}</ServiceName>
                    <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '2px' }}>
                      Booking ID: {booking.id}
                    </p>
                  </div>
                  <StatusBadge status={booking.status}>
                    {booking.status}
                  </StatusBadge>
                </BookingHeader>
                
                <BookingDetails>
                  <BookingDetail 
                    icon={<FaCalendarAlt />}
                    text={`Booked on: ${formatDate(booking.bookingDate)}`}
                  />
                  <BookingDetail 
                    icon={<FaHospital />}
                    text={booking.hospitalName}
                  />
                  <BookingDetail 
                    icon={<FaUserMd />}
                    text={`Dr. ${booking.doctorName}`}
                  />
                  <PriceRow>
                    <span>Amount Paid:</span>
                    <Price>₹{booking.finalAmount.toLocaleString()}</Price>
                  </PriceRow>
                </BookingDetails>
                
                <Actions>
                  <DetailsButton
                    onClick={() => openDetailsModal(booking)}
                    aria-label={`View details for ${booking.serviceName}`}
                  >
                    <FaInfoCircle /> Details
                  </DetailsButton>
                  {booking.status !== 'Cancelled' && (
                    <>
                      <StatusButton
                        onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                        disabled={booking.status === 'Completed'}
                        aria-label={`Mark ${booking.serviceName} as completed`}
                      >
                        Mark Completed
                      </StatusButton>
                      <RescheduleButton
                        onClick={() => handleReschedule(booking.id)}
                        aria-label={`Reschedule ${booking.serviceName}`}
                      >
                        <FaRedo /> Reschedule
                      </RescheduleButton>
                      <CancelButton
                        onClick={() => handleCancel(booking.id)}
                        aria-label={`Cancel ${booking.serviceName}`}
                      >
                        <FaTimes /> Cancel
                      </CancelButton>
                    </>
                  )}
                  <SecondaryButton
                    onClick={() => handlePrint(booking)}
                    aria-label={`Print ${booking.serviceName}`}
                  >
                    <FaPrint /> Print
                  </SecondaryButton>
                  <SecondaryButton
                    onClick={() => handleDownload(booking)}
                    aria-label={`Download ${booking.serviceName}`}
                  >
                    <FaFileDownload /> Download
                  </SecondaryButton>
                  <SecondaryButton
                    onClick={() => handleSendConfirmation(booking)}
                    aria-label={`Send confirmation for ${booking.serviceName}`}
                  >
                    <FaEnvelope /> Send Confirmation
                  </SecondaryButton>
                </Actions>
              </BookingCard>
            ))}
          </BookingsContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </PaginationButton>
              <PaginationInfo>
                Page {currentPage} of {totalPages}
              </PaginationInfo>
              <PaginationButton
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <ModalOverlay onClick={closeDetailsModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Booking Details</ModalTitle>
            <ModalDetails>
              <BookingDetail 
                icon={<FaCalendarAlt />}
                text={`Booked on: ${formatDate(selectedBooking.bookingDate)}`}
              />
              <BookingDetail 
                icon={<FaHospital />}
                text={selectedBooking.hospitalName}
              />
              <BookingDetail 
                icon={<FaUserMd />}
                text={`Dr. ${selectedBooking.doctorName}`}
              />
              <PriceRow>
                <span>Amount Paid:</span>
                <Price>₹{selectedBooking.finalAmount.toLocaleString()}</Price>
              </PriceRow>
              <BookingDetail 
                icon={<FaSort />}
                text={`Status: ${selectedBooking.status}`}
              />
            </ModalDetails>
            <ModalCloseButton onClick={closeDetailsModal}>
              Close
            </ModalCloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </BookingsPageContainer>
  );
};

export default BookingsPage;