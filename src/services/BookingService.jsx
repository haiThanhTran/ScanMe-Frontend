import apiConfig from "../configs/apiConfig.jsx";
import fetchUtils from "../utils/fetchUtils.jsx";

const BookingService = {
    async getAllBookings(page = 0, size = 10, searchTerm = '') {
        try {
            const queryParams = new URLSearchParams({
                page,
                size,
                search: searchTerm
            }).toString();
            
            return await fetchUtils.get(`/admin/bookings?${queryParams}`);
        } catch (e) {
            throw new Error(e.message);
        }
    },
    
    async getBookingById(id) {
        try {
            return await fetchUtils.get(`/admin/bookings/${id}`);
        } catch (e) {
            throw new Error(e.message);
        }
    },
    
    async createBooking(bookingData) {
        try {
            return await fetchUtils.post(`/admin/bookings`, bookingData);
        } catch (e) {
            throw new Error(e.message);
        }
    },
    
    async updateBooking(id, bookingData) {
        try {
            return await fetchUtils.put(`/admin/bookings/${id}`, bookingData);
        } catch (e) {
            throw new Error(e.message);
        }
    },
    
    async updateBookingStatus(id, status) {
        try {
            return await fetchUtils.put(`/admin/bookings/${id}/status`, { status });
        } catch (e) {
            throw new Error(e.message);
        }
    },
    
    async deleteBooking(id) {
        try {
            return await fetchUtils.remove(`/admin/bookings/${id}`);
        } catch (e) {
            throw new Error(e.message);
        }
    },
    
    async exportBookingsToExcel() {
        try {
            const token = fetchUtils.getAuthToken();
            
            const res = await fetch(`${apiConfig.baseUrl}/admin/bookings/export`, {
                method: "GET",
                headers: apiConfig.getAuthHeaders(token),
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }
            
            // Return the blob for download
            return await res.blob();
        } catch (e) {
            throw new Error(e.message);
        }
    },

    async createBookingCustomer(bookingData) {
      try {
          return await fetchUtils.post(`/booking/create`, bookingData);
      } catch (e) {
          throw new Error(e.message);
      }
  },
    
    async getAllRooms() {
        try {
            return await fetchUtils.get(`/admin/rooms`);
        } catch (e) {
            throw new Error(e.message);
        }
    },
};

export default BookingService; 
