// src/pages/Buildings/Buildings.tsx
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Apartment as ApartmentIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  LocalParking as ParkingIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  Restaurant as RestaurantIcon,
  Elevator as ElevatorIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

import { Building } from '../../types/building';
import buildingsData from '../../data/buildingsData';

const Buildings: React.FC = () => {
  const theme = useTheme();
  const [buildings, setBuildings] = useState<Building[]>(buildingsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleOpenDialog = (building?: Building) => {
    setSelectedBuilding(building || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedBuilding(null);
    setOpenDialog(false);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    handleCloseDialog();
    setSnackbar({
      open: true,
      message: selectedBuilding 
        ? 'Thông tin tòa nhà đã được cập nhật' 
        : 'Đã thêm tòa nhà mới',
      severity: 'success',
    });
  };

  const handleDelete = (id: number) => {
    setBuildings(buildings.filter(building => building.id !== id));
    setSnackbar({
      open: true,
      message: 'Đã xóa tòa nhà',
      severity: 'success',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'maintenance':
        return theme.palette.warning.main;
      case 'renovation':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'maintenance':
        return 'Đang bảo trì';
      case 'renovation':
        return 'Đang cải tạo';
      default:
        return status;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'parking':
        return <ParkingIcon />;
      case 'pool':
        return <PoolIcon />;
      case 'gym':
        return <GymIcon />;
      case 'restaurant':
        return <RestaurantIcon />;
      case 'security':
        return <SecurityIcon />;
      default:
        return <ApartmentIcon />;
    }
  };

  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch = 
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || building.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý tòa nhà
        </Typography>
        <Typography color="text.secondary">
          Quản lý thông tin và theo dõi trạng thái của các tòa nhà
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm tòa nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="maintenance">Đang bảo trì</MenuItem>
                <MenuItem value="renovation">Đang cải tạo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Thêm tòa nhà mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredBuildings.map((building) => (
          <Grid item xs={12} md={6} lg={4} key={building.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={building.image || 'https://source.unsplash.com/random?building'}
                alt={building.name}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {building.name}
                  </Typography>
                  <Chip
                    label={getStatusText(building.status)}
                    size="small"
                    sx={{ bgcolor: getStatusColor(building.status), color: 'white' }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <ApartmentIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  {building.address}
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tổng số tầng
                      </Typography>
                      <Typography variant="h6">
                        {building.totalFloors}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tỷ lệ lấp đầy
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flex: 1, mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(building.occupiedUnits / building.totalUnits) * 100}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2">
                          {Math.round((building.occupiedUnits / building.totalUnits) * 100)}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Tiện ích
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {building.amenities.map((amenity) => (
                    <Tooltip key={amenity} title={amenity}>
                      <IconButton size="small">
                        {getAmenityIcon(amenity)}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      {building.occupiedUnits}/{building.totalUnits} căn hộ
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <BuildIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      {building.maintenanceRequests} yêu cầu
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(building)}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(building.id)}
                >
                  Xóa
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBuilding ? 'Chỉnh sửa thông tin tòa nhà' : 'Thêm tòa nhà mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên tòa nhà"
                defaultValue={selectedBuilding?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                defaultValue={selectedBuilding?.address}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                defaultValue={selectedBuilding?.description}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tổng số tầng"
                type="number"
                defaultValue={selectedBuilding?.totalFloors}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tổng số căn hộ"
                type="number"
                defaultValue={selectedBuilding?.totalUnits}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số chỗ đỗ xe"
                type="number"
                defaultValue={selectedBuilding?.parkingSpaces}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Năm xây dựng"
                defaultValue={selectedBuilding?.yearBuilt}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  defaultValue={selectedBuilding?.status || 'active'}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="maintenance">Đang bảo trì</MenuItem>
                  <MenuItem value="renovation">Đang cải tạo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Doanh thu hàng tháng"
                type="number"
                defaultValue={selectedBuilding?.monthlyRevenue}
                InputProps={{
                  startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Tiện ích
              </Typography>
              <Grid container spacing={1}>
                {['parking', 'pool', 'gym', 'restaurant', 'security'].map((amenity) => (
                  <Grid item key={amenity}>
                    <Chip
                      icon={getAmenityIcon(amenity)}
                      label={amenity}
                      onClick={() => {}}
                      variant={selectedBuilding?.amenities.includes(amenity) ? 'filled' : 'outlined'}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedBuilding ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Buildings;
