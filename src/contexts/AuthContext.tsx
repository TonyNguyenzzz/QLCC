import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../components/ProtectedRoute/ProtectedRoute';

// Định nghĩa kiểu User
interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  permissions?: string[];
}

// Định nghĩa kiểu AuthContext
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Tạo context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {}
});

// Danh sách users
const users: User[] = [
  { 
    id: 1, 
    email: 'resident@gmail.com', 
    password: 'resident123', 
    role: UserRole.Resident,
    name: 'Resident User',
    permissions: ['view_apartment', 'submit_maintenance']
  },
  { 
    id: 2, 
    email: 'manager@gmail.com', 
    password: 'manager123', 
    role: UserRole.Manager,
    name: 'Manager User',
    permissions: ['manage_buildings', 'manage_residents', 'view_payments']
  }
];

// Provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Khởi tạo user từ localStorage khi component được render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate();

  // Hàm login
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      console.log('Login attempt:', { email, role }); // Log thông tin đăng nhập
      const foundUser = users.find(
        u => 
          u.email.trim().toLowerCase() === email.trim().toLowerCase() && 
          u.password === password && 
          u.role === role
      );

      console.log('Found user:', foundUser); // Log kết quả tìm user

      if (foundUser) {
        // Lưu user vào localStorage
        localStorage.setItem('user', JSON.stringify(foundUser));
        
        // Cập nhật state user
        setUser(foundUser);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Hàm logout
  const logout = () => {
    // Xóa user khỏi localStorage
    localStorage.removeItem('user');
    
    // Cập nhật state user
    setUser(null);
    
    // Điều hướng về trang login
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
