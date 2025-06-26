# Doctor Appointment Booking System - Frontend

A modern, responsive React application for booking appointments with doctors, built with Vite, React, Ant Design, and React Router.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication (access + refresh tokens)
- Role-based access control (Admin/User)
- Protected routes
- Automatic token refresh

### User Features
- User registration and login
- Browse doctor directory with search and filters
- Book appointments with available doctors
- View personal appointment history
- Modern responsive dashboard

### Admin Features
- Admin dashboard with statistics
- Manage all appointments (confirm/cancel)
- CRUD operations for doctors
- View system-wide analytics
- Doctor management interface

### Core Entities
- **Users**: name, email, password (hashed), role (admin/user)
- **Doctors**: name, specialty, availability, location, contact
- **Appointments**: userId, doctorId, date, time, status (pending/confirmed/cancelled)

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Ant Design
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Styling**: CSS + Ant Design themes
- **Icons**: Ant Design Icons
- **Date Handling**: Moment.js

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🏗️ Installation & Setup

1. **Clone the repository** (if applicable)
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 🎯 Usage

### Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

**User Account:**
- Email: `user@example.com`
- Password: `password123`

### Key Features Guide

1. **Login/Registration**: Start by logging in with demo credentials or creating a new account
2. **Doctor Directory**: Browse available doctors, filter by specialty
3. **Booking**: Click "Book Appointment" on any doctor card to schedule
4. **Dashboard**: View personalized dashboard based on your role
5. **Appointments**: Manage your appointments (users) or all appointments (admins)

## 📁 Project Structure

```
src/
├── components/
│   ├── Common/
│   │   └── ProtectedRoute.jsx
│   ├── Dashboard/
│   │   ├── AdminDashboard.jsx
│   │   └── UserDashboard.jsx
│   ├── Doctors/
│   │   ├── DoctorCard.jsx
│   │   ├── DoctorFilters.jsx
│   │   ├── DoctorForm.jsx
│   │   └── DoctorList.jsx
│   ├── Appointments/
│   │   └── AppointmentModal.jsx
│   └── Layout/
│       └── Layout.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── Doctors/
│   │   └── DoctorDirectory.jsx
│   ├── Appointments/
│   │   └── MyAppointments.jsx
│   └── Admin/
│       ├── ManageAppointments.jsx
│       └── DoctorManagement.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── doctorService.js
│   └── appointmentService.js
├── App.jsx
├── App.css
└── main.jsx
```

## 🔧 Configuration

The application uses mock data for development. To connect to a real backend:

1. Update the API base URL in `src/services/api.js`
2. Replace mock service functions with actual API calls
3. Configure authentication endpoints

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Customization

### Theme Customization
Modify the theme configuration in `src/App.jsx`:
```javascript
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
};
```

### Adding New Features
1. Create new components in appropriate directories
2. Add routes in `src/App.jsx`
3. Update navigation in `src/components/Layout/Layout.jsx`
4. Add corresponding service functions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The build artifacts will be stored in the `dist/` directory.

## 🔒 Security Features

- JWT token management with automatic refresh
- Protected routes based on authentication status
- Role-based access control
- Input validation and sanitization
- Secure password handling (frontend validation)

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- ESLint configuration for React
- Modular component structure
- Consistent naming conventions
- Comprehensive error handling

## 📄 License

This project is for demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please create an issue in the repository or contact the development team.

---

Built with ❤️ using React and Ant Design
