import api from './api';

const doctorService = {
  async getDoctors(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.specialty) queryParams.append('specialty', filters.specialty);
      if (filters.location) queryParams.append('location', filters.location);
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
  }
};

export default doctorService; 
