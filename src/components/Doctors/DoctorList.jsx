import { Row, Col, Card, Button, Typography, Tag, Avatar, Rate, Skeleton } from 'antd';
import { UserOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';

const { Text, Title } = Typography;

const DoctorCard = ({ doctor, onBookAppointment }) => {
  return (
    <Card 
      className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar 
            size={80} 
            icon={<UserOutlined />} 
            className="bg-primary-600 mx-auto sm:mx-0 flex-shrink-0"
          />
          <div className="text-center sm:text-left flex-1">
            <Title level={4} className="!mb-1 !text-gray-900">
              {doctor.name}
            </Title>
            <Text className="text-gray-600 text-base block mb-2">
              {doctor.specialization}
            </Text>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Rate disabled defaultValue={doctor.rating || 4.5} size="small" />
              <Text className="text-gray-500 text-sm">
                ({doctor.rating || 4.5})
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <Text className="text-gray-500 text-xs uppercase tracking-wide block mb-1">
              Experience
            </Text>
            <Text className="font-semibold text-gray-900">
              {doctor.experience} years
            </Text>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Text className="text-gray-500 text-xs uppercase tracking-wide block mb-1">
              Consultation Fee
            </Text>
            <Text className="font-semibold text-gray-900">
              ${doctor.fee}
            </Text>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <PhoneOutlined className="text-primary-600 w-4" />
            <Text className="text-sm">{doctor.phone}</Text>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <ClockCircleOutlined className="text-primary-600" />
            <Text className="font-medium text-gray-900">Available Time</Text>
          </div>
          <div className="flex flex-wrap gap-2">
            {doctor.availability?.length > 0 ? (
              doctor.availability.map((timeSlot, index) => (
                <Tag 
                  key={index} 
                  className="rounded-full px-3 py-1 border-primary-200 text-primary-700 bg-primary-50"
                >
                  {typeof timeSlot === 'string' 
                    ? timeSlot 
                    : `${timeSlot.day}: ${timeSlot.startTime} - ${timeSlot.endTime}`
                  }
                </Tag>
              ))
            ) : (
              <Tag className="rounded-full px-3 py-1 border-gray-200 text-gray-600 bg-gray-50">
                9:00 AM - 5:00 PM
              </Tag>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Button 
          type="primary" 
          block 
          size="large"
          onClick={() => onBookAppointment(doctor)}
          className="h-12 rounded-lg font-medium bg-primary-600 hover:bg-primary-700 border-primary-600 hover:border-primary-700 shadow-sm hover:shadow transition-all duration-200"
        >
          Book Appointment
        </Button>
      </div>
    </Card>
  );
};

const DoctorList = ({ doctors, onBookAppointment, loading }) => {
  const { loading: appLoading } = useApp();
  
  if (loading || appLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="h-full">
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (!doctors?.length) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-4xl text-gray-400" />
          </div>
          <Title level={3} className="!text-gray-900 !mb-2">
            No Doctors Found
          </Title>
          <Text className="text-gray-500 text-base">
            Try adjusting your search criteria or check back later.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Text className="text-gray-600">
          Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
            onBookAppointment={onBookAppointment}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorList; 
