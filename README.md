# Doctor Appointment Booking System - Frontend

A modern, responsive React application for booking appointments with doctors, built with Vite, React, Ant Design, and React Router.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication (access + refresh tokens)
- Role-based access control (Admin/User)
- Protected routes with automatic redirects
- Automatic token refresh and session management
- Secure login/logout functionality

### User Features
- User registration and login with email validation
- Browse comprehensive doctor directory
- Advanced search and filters (specialty, location, rating)
- Book appointments with real-time availability checking
- View and manage personal appointment history
- Responsive user dashboard with statistics
- Time conflict prevention and validation

### Admin Features
- Comprehensive admin dashboard with system analytics
- Manage all appointments (view, confirm, cancel)
- Complete CRUD operations for doctors
- Doctor management with detailed forms
- System-wide appointment analytics
- User management capabilities

### Doctor Management
- **Doctor Profiles**: Name, specialty, qualifications, experience
- **Availability Scheduling**: Dynamic weekly schedule management  
- **Location Details**: Hospital, address, city, state, ZIP code
- **Contact Information**: Phone number with validation
- **Consultation Fees**: Configurable pricing
- **Rating System**: Star ratings and review counts

### Appointment System
- **Smart Booking**: Real-time availability checking
- **Conflict Prevention**: Prevents double-booking
- **Status Management**: Pending, confirmed, cancelled, completed
- **Detailed Forms**: Reason, symptoms, notes
- **Admin Controls**: Status updates, cancellation management

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with Hooks
- **Build Tool**: Vite (fast HMR and optimized builds)
- **UI Library**: Ant Design 5.x (modern component library)
- **Routing**: React Router v6 (latest routing features)
- **State Management**: React Context API + useReducer
- **HTTP Client**: Axios with interceptors
- **Form Handling**: Ant Design Form with validation
- **Date/Time**: Day.js (modern alternative to Moment.js)
- **Styling**: CSS Modules + Ant Design themes
- **Icons**: Ant Design Icons (comprehensive icon set)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## 🏗️ Installation & Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Update `src/services/api.js` if your backend runs on a different port:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🎯 Usage

### Demo Credentials

**Admin Account:**
- Email: `admin@doctorapp.com`
- Password: `password123`

**User Account:**
- Email: `user@doctorapp.com`
- Password: `password123`

### Key Features Guide

1. **Registration/Login**: Create account or login with demo credentials
2. **Doctor Directory**: Browse doctors with advanced filters (specialty, location, rating)
3. **Smart Booking**: 
   - Select doctor and view their availability
   - Choose date/time with real-time conflict checking
   - Fill detailed appointment form with reason and symptoms
4. **Dashboard**: Role-based dashboard showing relevant statistics
5. **Appointment Management**: 
   - Users: View and manage personal appointments
   - Admins: Manage all appointments with status controls
6. **Doctor Management (Admin)**: Complete CRUD for doctor profiles

## 📁 Project Structure

```
src/
├── components/
│   ├── Common/
│   │   └── ProtectedRoute.jsx         # Route protection
│   ├── Dashboard/
│   │   ├── AdminDashboard.jsx         # Admin analytics dashboard
│   │   └── UserDashboard.jsx          # User personal dashboard
│   ├── Doctors/
│   │   ├── DoctorCard.jsx             # Doctor profile card
│   │   ├── DoctorFilters.jsx          # Search/filter controls
│   │   ├── DoctorForm.jsx             # Doctor creation/edit form
│   │   └── DoctorList.jsx             # Doctor listing with pagination
│   ├── Appointments/
│   │   └── AppointmentModal.jsx       # Appointment booking modal
│   ├── Layout/
│   │   └── Layout.jsx                 # Main app layout with navigation
│   └── UI/
│       ├── LoadingCard.jsx            # Loading state components
│       ├── PageHeader.jsx             # Page headers
│       ├── StatCard.jsx               # Statistics cards
│       ├── StatusIcon.jsx             # Status indicators
│       └── StatusTag.jsx              # Status tags
├── contexts/
│   ├── AuthContext.jsx                # Authentication state management
│   └── AppContext.jsx                 # Global app state
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx                  # Login page
│   │   └── Signup.jsx                 # Registration page
│   ├── Dashboard/
│   │   ├── Dashboard.jsx              # Main dashboard router
│   │   └── UserDashboard.jsx          # User-specific dashboard
│   ├── Doctors/
│   │   └── DoctorDirectory.jsx        # Doctor browsing page
│   ├── Appointments/
│   │   └── MyAppointments.jsx         # User appointments page
│   └── Admin/
│       ├── ManageAppointments.jsx     # Admin appointment management
│       └── DoctorManagement.jsx       # Admin doctor management
├── services/
│   ├── api.js                         # Axios configuration & interceptors
│   ├── authService.js                 # Authentication API calls
│   ├── doctorService.js               # Doctor management API calls
│   └── appointmentService.js          # Appointment API calls
├── hooks/
│   └── useAuth.js                     # Custom authentication hook
├── App.jsx                            # Main app component with routing
├── App.css                            # Global styles
└── main.jsx                           # React app entry point
```

## 🔧 API Integration

The frontend integrates with the backend API for:

### Authentication
- User registration and login
- JWT token management with automatic refresh
- Role-based access control

### Doctor Management
- Public doctor directory with search/filters
- Admin-only doctor CRUD operations
- Real-time availability checking

### Appointment System
- Smart appointment booking with conflict prevention
- User appointment history
- Admin appointment management

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+): Full feature set with sidebar navigation
- **Tablet** (768px - 1199px): Adapted layout with collapsible sidebar
- **Mobile** (< 768px): Mobile-first design with drawer navigation

## 🎨 UI/UX Features

### Modern Design System
- Consistent color scheme and typography
- Ant Design's modern component library
- Intuitive navigation with breadcrumbs
- Loading states and error handling
- Toast notifications for user feedback

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly

### Performance Optimizations
- Code splitting with React.lazy()
- Optimized bundle size with Vite
- Image optimization and lazy loading
- Efficient state management

## 🔧 Configuration

### Theme Customization
Modify the theme in `src/App.jsx`:
```javascript
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
  },
};
```

### Environment Configuration
Create `.env` file for custom configurations:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Doctor Appointment System
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop `dist/` folder or connect repository
- **AWS S3 + CloudFront**: Upload build files to S3 bucket
- **Docker**: Use provided Dockerfile for containerized deployment

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Doctor Appointment System
```

## 🔒 Security Features

- **Authentication Security**: JWT token management with httpOnly options
- **Protected Routes**: Role-based route protection
- **Input Validation**: Client-side validation with server-side verification
- **XSS Prevention**: Proper data sanitization and escape
- **CSRF Protection**: Token-based request authentication
- **Secure Headers**: Content Security Policy implementation

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server with HMR
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Fix automatically fixable ESLint issues

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **Error Boundaries**: Graceful error handling in production
- **Development Tools**: React DevTools and Redux DevTools support
- **TypeScript Ready**: Easy migration to TypeScript if needed

### Code Quality
- ESLint configuration with React hooks and accessibility rules
- Prettier integration for consistent code formatting
- Husky pre-commit hooks for quality assurance
- Component-driven development approach

## 🎯 Key Components

### DoctorForm.jsx
Comprehensive form for doctor management with:
- Personal information (name, specialty, qualifications)
- Availability scheduling with dynamic slots
- Location details with validation
- Contact information and fees
- Real-time validation feedback

### AppointmentModal.jsx
Smart booking interface featuring:
- Doctor selection with search
- Date/time picker with availability checking
- Detailed appointment form (reason, symptoms, notes)
- Conflict prevention and validation
- Confirmation and feedback

### Dashboard Components
Role-based dashboards with:
- Statistics cards and charts
- Recent activity summaries
- Quick action buttons
- Responsive grid layouts

## 🐛 Error Handling

### Comprehensive Error Management
- Global error boundaries for crash prevention
- API error handling with user-friendly messages
- Form validation with real-time feedback
- Network error recovery mechanisms
- Graceful degradation for offline scenarios

### User Feedback
- Toast notifications for actions
- Loading states for async operations
- Confirmation dialogs for destructive actions
- Progress indicators for multi-step processes

## 🧪 Testing Strategy

### Planned Testing Approach
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration and user flow testing
- **E2E Tests**: Cypress for end-to-end user scenarios
- **Accessibility Tests**: WAVE and axe-core integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Run linting and fix any issues
6. Submit a pull request with clear description

### Coding Standards
- Use functional components with hooks
- Follow Ant Design design principles
- Implement proper error boundaries
- Add PropTypes or TypeScript for type safety
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend is running on correct port
   - Check CORS configuration
   - Ensure API endpoints match

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify API authentication endpoints

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for conflicting dependencies
   - Verify Node.js version compatibility

4. **Styling Issues**
   - Check Ant Design version compatibility
   - Verify CSS import order
   - Clear browser cache

### Performance Optimization
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize image sizes and formats
- Minimize bundle size with code splitting

## 📞 Support

For technical support or feature requests, please create an issue in the repository or contact the development team.

---

Built with ❤️ using React and Ant Design
