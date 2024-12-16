import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
} from '@mui/material';
import {
  Build,
  LocalLaundryService,
  MeetingRoom,
  LocalParking,
  CleaningServices,
} from '@mui/icons-material';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const services: ServiceItem[] = [
  {
    id: 1,
    title: 'Yêu Cầu Bảo Trì',
    description: 'Gửi yêu cầu sửa chữa và bảo dưỡng',
    icon: <Build />,
  },
  {
    id: 2,
    title: 'Dịch Vụ Giặt Ủi',
    description: 'Đăng ký dịch vụ giặt ủi chuyên nghiệp',
    icon: <LocalLaundryService />,
  },
  {
    id: 3,
    title: 'Đặt Phòng Sinh Hoạt Chung',
    description: 'Đặt phòng họp hoặc không gian chung',
    icon: <MeetingRoom />,
  },
  {
    id: 4,
    title: 'Đăng Ký Chỗ Đỗ Xe',
    description: 'Quản lý và đăng ký chỗ đỗ xe',
    icon: <LocalParking />,
  },
  {
    id: 5,
    title: 'Dịch Vụ Vệ Sinh',
    description: 'Đặt dịch vụ vệ sinh căn hộ',
    icon: <CleaningServices />,
  },
];

const ResidentServices: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dịch Vụ Cư Dân
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Khám phá và sử dụng các dịch vụ tiện ích
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {service.icon}
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    {service.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => handleServiceClick(service)}
                >
                  Đăng Ký Ngay
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TODO: Thêm modal hoặc form chi tiết khi chọn dịch vụ */}
    </Container>
  );
};

export default ResidentServices;
