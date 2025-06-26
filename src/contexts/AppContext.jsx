import { createContext, useContext, useState } from 'react';
import { message } from 'antd';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctors(filters);
      setDoctors(data);
      return data;
    } catch (error) {
      message.error('Failed to fetch doctors');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDoctor = async (doctorData) => {
    try {
      const newDoctor = await doctorService.createDoctor(doctorData);
      setDoctors(prev => [...prev, newDoctor]);
      message.success('Doctor created successfully');
      return { success: true, data: newDoctor };
    } catch (error) {
      message.error('Failed to create doctor');
      return { success: false, error: error.message };
    }
  };

  const updateDoctor = async (id, doctorData) => {
    try {
      const updatedDoctor = await doctorService.updateDoctor(id, doctorData);
      setDoctors(prev => prev.map(doc => (doc._id || doc.id) === id ? updatedDoctor : doc));
      message.success('Doctor updated successfully');
      return { success: true, data: updatedDoctor };
    } catch (error) {
      message.error('Failed to update doctor');
      return { success: false, error: error.message };
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await doctorService.deleteDoctor(id);
      setDoctors(prev => prev.filter(doc => (doc._id || doc.id) !== id));
      message.success('Doctor deleted successfully');
      return { success: true };
    } catch (error) {
      message.error('Failed to delete doctor');
      return { success: false, error: error.message };
    }
  };

  const fetchAppointments = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments(filters);
      setAppointments(data);
      return data;
    } catch (error) {
      message.error('Failed to fetch appointments');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      const newAppointment = await appointmentService.createAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      message.success('Appointment booked successfully');
      return { success: true, data: newAppointment };
    } catch (error) {
      message.error('Failed to book appointment');
      return { success: false, error: error.message };
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(apt => (apt._id || apt.id) === id ? updatedAppointment : apt));
      message.success(`Appointment ${status} successfully`);
      return { success: true, data: updatedAppointment };
    } catch (error) {
      message.error('Failed to update appointment status');
      return { success: false, error: error.message };
    }
  };

  const value = {
    doctors,
    appointments,
    loading,
    setDoctors,
    setAppointments,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    fetchAppointments,
    createAppointment,
    updateAppointmentStatus
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 
