import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from './ProtectedRoute/ProtectedRoute'; // Import UserRole từ file ProtectedRoute chính

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // Thay đổi kiểu dữ liệu của allowedRoles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Log chi tiết thông tin người dùng và quyền truy cập
  console.error('🔒 PROTECTED ROUTE DEBUG:', {
    userExists: !!user,
    userDetails: user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    } : null,
    allowedRoles: allowedRoles || [],
    currentPath: location.pathname,
    roleCheck: user && allowedRoles ? allowedRoles.includes(user.role) : false
  });

  // Nếu không có user, chuyển về trang login
  if (!user) {
    console.error('❌ No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có allowedRoles và user không thuộc các role này
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.error('🚫 Unauthorized access attempt:', {
      userRole: user.role,
      requiredRoles: allowedRoles,
      message: 'User role does not match required roles'
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu thỏa mãn điều kiện, hiển thị component
  console.log('✅ Access Granted');
  return <>{children}</>;
};

export default ProtectedRoute;