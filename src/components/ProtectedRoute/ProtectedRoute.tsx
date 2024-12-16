import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material';

// Enum cho các vai trò
export enum UserRole {
  Resident = 'resident',
  Manager = 'manager',
  Admin = 'admin'
}

// Interface mở rộng cho thông tin người dùng
interface ExtendedUserInfo {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  permissions?: string[];
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  requiredPermissions,
  requiredRole
}) => {
  const { user } = useAuth();
  const location = useLocation();

  // Kiểm tra toàn diện quyền truy cập
  const checkAccess = () => {
    // Không có người dùng
    if (!user) {
      return {
        allowed: false,
        reason: 'Chưa đăng nhập'
      };
    }

    // Kiểm tra vai trò
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return {
        allowed: false,
        reason: 'Vai trò không được phép'
      };
    }

    if (requiredRole && user.role !== requiredRole) {
      return {
        allowed: false,
        reason: 'Vai trò không được phép'
      };
    }

    // Kiểm tra quyền
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasRequiredPermissions = requiredPermissions.every(perm => 
        user.permissions?.includes(perm)
      );

      if (!hasRequiredPermissions) {
        return {
          allowed: false,
          reason: 'Không đủ quyền'
        };
      }
    }

    return {
      allowed: true,
      reason: ''
    };
  };

  const accessResult = checkAccess();

  // Nếu không được phép, chuyển hướng đến trang unauthorized
  if (!accessResult.allowed) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          from: location, 
          reason: accessResult.reason 
        }} 
        replace 
      />
    );
  }

  // Nếu được phép, render children
  return <>{children}</>;
};

export default ProtectedRoute;