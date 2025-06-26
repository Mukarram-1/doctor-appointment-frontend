import api from './api';

const doctorService = {
  async getDoctors(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Handle pagination
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      // Handle search
      if (filters.search) queryParams.append('search', filters.search);
      
      // Handle specialty filter
      if (filters.specialty) queryParams.append('specialty', filters.specialty);
      
      // Handle location filter
      if (filters.location) queryParams.append('location', filters.location);
      
      // Handle rating filter
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      
      const response = await api.get(`/doctors?${queryParams.toString()}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch doctors');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  },

  async getDoctorById(id) {
    try {
      const response = await api.get(`/doctors/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Doctor not found');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor details');
    }
  },

  async getPopularDoctors(limit = 5) {
    try {
      const response = await api.get(`/doctors/popular?limit=${limit}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch popular doctors');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch popular doctors');
    }
  },

  async createDoctor(doctorData) {
    try {
      const response = await api.post('/doctors', doctorData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create doctor');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create doctor');
    }
  },

  async updateDoctor(id, doctorData) {
    try {
      const response = await api.put(`/doctors/${id}`, doctorData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update doctor');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update doctor');
    }
  },

  async deleteDoctor(id) {
    try {
      const response = await api.delete(`/doctors/${id}`);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Failed to delete doctor');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete doctor');
    }
  },

  async checkDoctorAvailability(doctorId, date, timeSlot) {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability`, {
        params: { date, timeSlot }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to check availability');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check availability');
    }
  },

  async getDoctorStats(id) {
    try {
      const response = await api.get(`/doctors/${id}/stats`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch doctor stats');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor stats');
    }
  },

  // Helper methods for frontend use
  getSpecialties() {
    return [
      'Cardiology',
      'Dermatology', 
      'Pediatrics',
      'Orthopedics',
      'Neurology',
      'Oncology',
      'Psychiatry',
      'Surgery',
      'Internal Medicine',
      'Family Medicine',
      'Emergency Medicine',
      'Radiology',
      'Anesthesiology',
      'Pathology',
      'Gynecology',
      'Urology',
      'Ophthalmology',
      'ENT'
    ];
  },

  formatDoctorName(doctor) {
    return `Dr. ${doctor.name}`;
  },

  formatAvailability(availability) {
    if (!availability || !Array.isArray(availability)) return [];
    
    return availability.map(slot => ({
      day: slot.day,
      timeSlots: slot.timeSlots || [],
      isAvailable: slot.isAvailable !== false
    }));
  }
};

export default doctorService; 