import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import DoctorFilters from '../../components/Doctors/DoctorFilters';
import DoctorList from '../../components/Doctors/DoctorList';
import AppointmentModal from '../../components/Appointments/AppointmentModal';
import PageHeader from '../../components/UI/PageHeader';
import { useApp } from '../../contexts/AppContext';

const { Text } = Typography;

const DoctorDirectory = () => {
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    specialty: ''
  });
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { doctors, loading, fetchDoctors } = useApp();

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, filters]);

  const loadDoctors = async () => {
    await fetchDoctors();
  };

  const applyFilters = () => {
    let filtered = [...doctors];

    if (filters.search) {
      filtered = filtered.filter(doctor => {
        const searchTerm = filters.search.toLowerCase();
        const locationText = doctor.location 
          ? `${doctor.location.hospital} ${doctor.location.city} ${doctor.location.state}`.toLowerCase()
          : '';
        
        return doctor.name.toLowerCase().includes(searchTerm) ||
               doctor.specialty.toLowerCase().includes(searchTerm) ||
               locationText.includes(searchTerm) ||
               (doctor.qualifications && doctor.qualifications.toLowerCase().includes(searchTerm));
      });
    }

    if (filters.specialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialty && doctor.specialty.toLowerCase() === filters.specialty.toLowerCase()
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentModalVisible(true);
  };

  const handleAppointmentModalClose = () => {
    setAppointmentModalVisible(false);
    setSelectedDoctor(null);
  };

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        <PageHeader
          title="Doctor Directory"
          description="Find and book appointments with our qualified doctors"
        />

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="xl:w-80 flex-shrink-0">
            <DoctorFilters
              filters={filters}
              specialties={specialties}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                <Text className="text-gray-600 font-medium">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </Text>
              </div>
              
              <DoctorList
                doctors={filteredDoctors}
                loading={loading}
                onBookAppointment={handleBookAppointment}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedDoctor && (
        <AppointmentModal
          visible={appointmentModalVisible}
          doctor={selectedDoctor}
          onCancel={handleAppointmentModalClose}
          onSuccess={handleAppointmentModalClose}
        />
      )}
    </div>
  );
};

export default DoctorDirectory; 
