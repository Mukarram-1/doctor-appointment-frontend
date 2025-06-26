import { Card, Input, Select, Button, Typography } from 'antd';
import { SearchOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const DoctorFilters = ({ filters, specialties, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      search: e.target.value
    });
  };

  const handleSpecialtyChange = (value) => {
    onFilterChange({
      ...filters,
      specialty: value
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      specialty: ''
    });
  };

  return (
    <Card 
      className="sticky top-5 rounded-xl shadow-sm border border-gray-200"
      title={
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-blue-600" />
          <span className="font-semibold text-gray-900">Filter Doctors</span>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Text className="block text-gray-700 font-medium mb-2">
            Search
          </Text>
          <Input
            placeholder="Search by name, specialty..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={filters.search}
            onChange={handleSearchChange}
            allowClear
            size="large"
            className="rounded-lg"
          />
        </div>

        <div>
          <Text className="block text-gray-700 font-medium mb-2">
            Specialty
          </Text>
          <Select
            placeholder="Select specialty"
            value={filters.specialty || undefined}
            onChange={handleSpecialtyChange}
            allowClear
            size="large"
            className="w-full rounded-lg"
          >
            {specialties.map(specialty => (
              <Option key={specialty} value={specialty}>
                {specialty}
              </Option>
            ))}
          </Select>
        </div>

        <Button
          icon={<ClearOutlined />}
          onClick={handleClearFilters}
          block
          size="large"
          disabled={!filters.search && !filters.specialty}
          className="h-10 rounded-lg border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 disabled:bg-gray-50 disabled:text-gray-400"
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  );
};

export default DoctorFilters; 
