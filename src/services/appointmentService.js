import api from './api';

const appointmentService = {
  async getAppointments(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      if (filters.status) queryParams.append('status', filters.status);
      
      if (filters.date) queryParams.append('date', filters.date);
      
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

  async createAppointment(appointmentData) {
    try {
      console.log("appointmentData", appointmentData)
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
    
    return hoursDiff > 24 && appointment.status !== 'cancelled';
  },

  canRescheduleAppointment(appointment) {
    return this.canCancelAppointment(appointment) && appointment.status !== 'completed';
  }
};

export default appointmentService; 
