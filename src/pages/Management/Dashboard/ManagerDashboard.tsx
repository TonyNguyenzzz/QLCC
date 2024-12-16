import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Person,
  Business,
  Build,
  Payment,
  Notifications,
  TrendingUp,
  Group,
  HomeWork,
  AttachMoney,
  ListAlt,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// Mock data cho Manager Dashboard
const managerDashboardData = {
  totalResidents: 250,
  totalBuildings: 8,
  pendingMaintenance: 12,
  pendingPayments: 35,
  monthlyRevenue: 750000000, // VND
  occupancyRate: 92,
  recentNotifications: [
    { id: 1, title: 'Báo cáo tài chính tháng 12', time: '2 giờ trước' },
    { id: 2, title: 'Cuộc họp quản lý hàng tháng', time: '1 ngày trước' },
    { id: 3, title: 'Yêu cầu bảo trì mới', time: '3 ngày trước' },
  ],
};

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton sx={{ backgroundColor: color, color: 'white', '&:hover': { backgroundColor: color } }}>
            {icon}
          </IconButton>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}> = ({ title, description, icon, path }) => {
  const navigate = useNavigate();
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(path)}>
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bảng Điều Khiển Quản Lý, {user?.name || 'Quản Trị Viên'}
        </Typography>
        <Typography color="text.secondary">
          Tổng quan về hoạt động quản lý tòa nhà
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Thống kê tổng quan */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số cư dân"
            value={managerDashboardData.totalResidents}
            icon={<Group />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Số tòa nhà"
            value={managerDashboardData.totalBuildings}
            icon={<Business />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Yêu cầu sửa chữa"
            value={managerDashboardData.pendingMaintenance}
            icon={<Build />}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Doanh Thu Tháng"
            value={`${(managerDashboardData.monthlyRevenue / 1000000).toFixed(1)}tr`}
            icon={<AttachMoney />}
            color="#388e3c"
          />
        </Grid>

        {/* Thông báo gần đây */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Thông Báo Gần Đây
            </Typography>
            <Box>
              {managerDashboardData.recentNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">
                        {notification.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                  {index < managerDashboardData.recentNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Truy cập nhanh */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Quản Lý Cư Dân"
                description="Danh sách và thông tin chi tiết"
                icon={<Person color="primary" />}
                path="/residents"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Quản Lý Tòa Nhà"
                description="Thông tin và quản lý tòa nhà"
                icon={<HomeWork color="secondary" />}
                path="/buildings"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Báo Cáo Thanh Toán"
                description="Phân tích và báo cáo tài chính"
                icon={<ListAlt color="primary" />}
                path="/payment-reports"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Yêu Cầu Bảo Trì"
                description="Quản lý và theo dõi yêu cầu sửa chữa"
                icon={<Build color="warning" />}
                path="/manager/maintenance-requests"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManagerDashboard;
