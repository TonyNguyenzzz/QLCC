import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Box 
} from '@mui/material';
import { 
  Assessment as ReportIcon,
  Build as MaintenanceIcon,
  Person as ResidentIcon,
  Business as BuildingIcon,
  Warning as ViolationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OtherReports: React.FC = () => {
  const navigate = useNavigate();

  const reportOptions = [
    {
      title: 'Báo Cáo Vi Phạm',
      description: 'Thống kê và chi tiết các vi phạm của cư dân',
      icon: <ViolationIcon />,
      path: '/violation-reports',
      color: 'warning'
    },
    {
      title: 'Báo Cáo Bảo Trì',
      description: 'Tổng hợp các yêu cầu và trạng thái bảo trì',
      icon: <MaintenanceIcon />,
      path: '/maintenance-reports',
      color: 'primary'
    },
    {
      title: 'Báo Cáo Cư Dân',
      description: 'Thống kê thông tin và hoạt động của cư dân',
      icon: <ResidentIcon />,
      path: '/resident-reports',
      color: 'secondary'
    },
    {
      title: 'Báo Cáo Tòa Nhà',
      description: 'Chi tiết về tình trạng và quản lý tòa nhà',
      icon: <BuildingIcon />,
      path: '/building-reports',
      color: 'info'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <ReportIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Báo Cáo Khác
        </Typography>
        <Typography color="text.secondary">
          Các báo cáo bổ sung để hỗ trợ quản lý
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {reportOptions.map((report) => (
          <Grid item xs={12} sm={6} md={3} key={report.title}>
            <Card>
              <CardActionArea 
                onClick={() => navigate(report.path)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <CardContent>
                  {React.cloneElement(report.icon, { 
                    color: report.color, 
                    sx: { fontSize: 48, mb: 2 } 
                  })}
                  <Typography variant="h6" component="div">
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OtherReports;
