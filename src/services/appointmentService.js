import api from './api';

const appointmentService = {
  async getAppointments(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Handle pagination
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      // Handle status filter
      if (filters.status) queryParams.append('status', filters.status);
      
      // Handle date filter
      if (filters.date) queryParams.append('date', filters.date);
      
      // Handle doctor filter
      if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
      
      const response = await api.get(`/appointments?${queryParams.toString()}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  },

  async getAppointmentById(id) {
    try {
      const response = await api.get(`/appointments/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Appointment not found');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment details');
    }
  },

  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create appointment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  },

  async updateAppointment(id, appointmentData) {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update appointment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update appointment');
    }
  },

  async updateAppointmentStatus(id, status) {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update appointment status');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update appointment status');
    }
  },

  async cancelAppointment(id) {
    try {
      const response = await api.patch(`/appointments/${id}/cancel`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  },

  async rescheduleAppointment(id, newDate, newTimeSlot) {
    try {
      const response = await api.patch(`/appointments/${id}/reschedule`, {
        date: newDate,
        timeSlot: newTimeSlot
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to reschedule appointment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reschedule appointment');
    }
  },

  async deleteAppointment(id) {
    try {
      const response = await api.delete(`/appointments/${id}`);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Failed to delete appointment');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete appointment');
    }
  },

  async getUserAppointments(userId) {
    try {
      const response = await api.get(`/appointments/user/${userId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user appointments');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user appointments');
    }
  },

  async getDoctorAppointments(doctorId) {
    try {
      const response = await api.get(`/appointments/doctor/${doctorId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch doctor appointments');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor appointments');
    }
  },

  async getAppointmentStats() {
    try {
      const response = await api.get('/appointments/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch appointment stats');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment stats');
    }
  },

  // Helper methods for frontend use
  getStatusColor(status) {
    const colors = {
      pending: 'orange',
      confirmed: 'green',
      cancelled: 'red',
      completed: 'blue'
    };
    return colors[status] || 'default';
  },

  getStatusText(status) {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed'
    };
    return texts[status] || status;
  },

  formatAppointmentDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  formatAppointmentTime(timeSlot) {
    if (typeof timeSlot === 'string') {
      return timeSlot;
    }
    return `${timeSlot.start} - ${timeSlot.end}`;
  },

  canCancelAppointment(appointment) {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    // Can cancel if appointment is more than 24 hours away and not already cancelled
    return hoursDiff > 24 && appointment.status !== 'cancelled';
  },

  canRescheduleAppointment(appointment) {
    return this.canCancelAppointment(appointment) && appointment.status !== 'completed';
  }
};

export default appointmentService; 