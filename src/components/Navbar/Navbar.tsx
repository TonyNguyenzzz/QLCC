import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  useTheme, // Import từ MUI
} from '@mui/material';
import {
  AccountCircle,
  Menu as MenuIcon,
  Home,
  Payment,
  Build,
  History,
  Person,
  Group,
  Business,
  Assessment,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext'; // Đổi tên import
import { UserRole } from '../../components/ProtectedRoute/ProtectedRoute';

interface NavbarProps {
}

const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme(); // Sử dụng hook custom
  const muiTheme = useTheme(); // Sử dụng hook từ MUI
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorElUser(null);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserClose();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!user) {
    return null;
  }

  // Menu riêng cho Resident
  const residentMenuItems = [
    { text: 'Trang chủ', icon: <Home />, path: '/resident/dashboard' },
    { text: 'Thanh toán', icon: <Payment />, path: '/resident/payments' },
    { text: 'Yêu cầu sửa chữa', icon: <Build />, path: '/maintenance-requests' },
    { text: 'Thông tin cá nhân', icon: <Person />, path: '/resident/profile' },
  ];

  // Menu riêng cho Manager
  const managerMenuItems = [
    { text: 'Trang chủ', icon: <Home />, path: '/manager/dashboard' },
    { text: 'Cư dân', icon: <Group />, path: '/residents' },
    { text: 'Tòa nhà', icon: <Business />, path: '/buildings' },
    { text: 'Thanh toán', icon: <Payment />, path: '/manager/payments' },
    { text: 'Yêu cầu sửa chữa', icon: <Build />, path: '/manager/maintenance-requests' },
    { text: 'Báo cáo thanh toán', icon: <Assessment />, path: '/payment-reports' },
    { text: 'Báo cáo khác', icon: <Assessment />, path: '/reports' },
    { text: 'Thông tin cá nhân', icon: <Person />, path: user?.role === UserRole.Resident ? '/resident/profile' : '/profile' },
  ];

  // Chọn menu dựa trên role
  const menuItems = user?.role === UserRole.Resident ? residentMenuItems : managerMenuItems;

  return (
    <AppBar 
      position="fixed" 
      sx={{
        zIndex: muiTheme.zIndex.drawer + 1,
        width: '100%'
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Quản lý Tòa nhà
        </Typography>
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
          sx={{ mr: 1 }}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleUserMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        
        {/* Menu chức năng */}
        <Popover
          open={Boolean(anchorElMenu)}
          anchorEl={anchorElMenu}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => {
                  navigate(item.path);
                  handleMenuClose();
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Popover>

        {/* Menu người dùng */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleUserClose}
        >
          <MenuItem onClick={() => navigate(user?.role === UserRole.Resident ? '/resident/profile' : '/profile')}>Thông tin cá nhân</MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
