import React, { useContext, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Container, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import { UserRole } from '../components/ProtectedRoute/ProtectedRoute';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import OtherReports from '../pages/Reports/OtherReports';

// Lazy load tất cả các trang
const Login = React.lazy(() => import('../pages/Login/Login'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const Unauthorized = React.lazy(() => import('../pages/Unauthorized'));

// Resident Routes
const ResidentDashboard = React.lazy(() => import('../pages/ResidentPortal/Dashboard/ResidentDashboard'));
const ResidentPayments = React.lazy(() => import('../pages/Payments/ResidentPayments'));
const MaintenanceRequests = React.lazy(() => import('../pages/MaintenanceRequests/MaintenanceRequests'));
const ResidentProfile = React.lazy(() => import('../pages/Profile/Profile'));

// Manager Routes
const ManagerDashboard = React.lazy(() => import('../pages/Management/Dashboard/ManagerDashboard'));
const ManagerPayments = React.lazy(() => import('../pages/Payments/ManagerPayments'));
const PaymentReports = React.lazy(() => import('../pages/Payments/PaymentReports'));
const ManagerProfile = React.lazy(() => import('../pages/Profile/Profile'));

// Thêm các route quản lý mới
const Residents = React.lazy(() => import('../pages/Residents/Residents'));
const Buildings = React.lazy(() => import('../pages/Buildings/Buildings'));
const ViolationReports = React.lazy(() => import('../pages/Violations/ViolationReports'));
const ManagerMaintenanceRequests = React.lazy(() => import('../pages/MaintenanceRequests/MaintenanceRequests'));

// Import các báo cáo mới
const MaintenanceReports = React.lazy(() => import('../pages/Reports/MaintenanceReports'));
const ResidentReports = React.lazy(() => import('../pages/Reports/ResidentReports'));
const BuildingReports = React.lazy(() => import('../pages/Reports/BuildingReports'));

const AppRoutes: React.FC = () => {
  const { user } = useContext(AuthContext);

  // Layout với Navbar cho các trang đã đăng nhập
  const LayoutWithNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container 
        component="main" 
        maxWidth="xl" 
        sx={{ 
          flexGrow: 1, 
          mt: 10,  
          mb: 4,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Suspense fallback={<CircularProgress />}>
          {children}
        </Suspense>
      </Container>
    </Box>
  );

  // Nếu không có user, chỉ cho phép login và register
  if (!user) {
    return (
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        {/* Resident Routes */}
        {user.role === UserRole.Resident && (
          <>
            <Route 
              path="/resident/dashboard" 
              element={
                <LayoutWithNavbar>
                  <ResidentDashboard />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/resident/payments" 
              element={
                <LayoutWithNavbar>
                  <ResidentPayments />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/maintenance-requests" 
              element={
                <LayoutWithNavbar>
                  <MaintenanceRequests />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <LayoutWithNavbar>
                  <ResidentProfile />
                </LayoutWithNavbar>
              } 
            />
          </>
        )}

        {/* Manager Routes */}
        {user.role === UserRole.Manager && (
          <>
            <Route 
              path="/manager/dashboard" 
              element={
                <LayoutWithNavbar>
                  <ManagerDashboard />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/manager/payments" 
              element={
                <LayoutWithNavbar>
                  <ManagerPayments />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/payment-reports" 
              element={
                <LayoutWithNavbar>
                  <PaymentReports />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/residents" 
              element={
                <LayoutWithNavbar>
                  <Residents />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/buildings" 
              element={
                <LayoutWithNavbar>
                  <Buildings />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/other-reports" 
              element={
                <LayoutWithNavbar>
                  <OtherReports />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/violation-reports" 
              element={
                <ProtectedRoute requiredRole={UserRole.Manager}>
                  <LayoutWithNavbar>
                    <ViolationReports />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager/maintenance-requests" 
              element={
                <LayoutWithNavbar>
                  <ManagerMaintenanceRequests />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <LayoutWithNavbar>
                  <ManagerProfile />
                </LayoutWithNavbar>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute requiredRole={UserRole.Manager}>
                  <OtherReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance-reports" 
              element={
                <ProtectedRoute requiredRole={UserRole.Manager}>
                  <LayoutWithNavbar>
                    <MaintenanceReports />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resident-reports" 
              element={
                <ProtectedRoute requiredRole={UserRole.Manager}>
                  <LayoutWithNavbar>
                    <ResidentReports />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/building-reports" 
              element={
                <ProtectedRoute requiredRole={UserRole.Manager}>
                  <LayoutWithNavbar>
                    <BuildingReports />
                  </LayoutWithNavbar>
                </ProtectedRoute>
              } 
            />
          </>
        )}

        {/* Default Route */}
        <Route 
          path="/" 
          element={
            user.role === UserRole.Resident 
              ? <Navigate to="/resident/dashboard" replace /> 
              : <Navigate to="/manager/dashboard" replace />
          } 
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
