// src/pages/Residents/Residents.tsx
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
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  Money as MoneyIcon,
} from '@mui/icons-material';

import { Resident } from '../../types/resident';
import residentsData from '../../data/residentsData';

const Residents: React.FC = () => {
  const theme = useTheme();
  const [residents, setResidents] = useState<Resident[]>(residentsData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (resident?: Resident) => {
    setSelectedResident(resident || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedResident(null);
    setOpenDialog(false);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    handleCloseDialog();
    setSnackbar({
      open: true,
      message: selectedResident 
        ? 'Thông tin cư dân đã được cập nhật' 
        : 'Đã thêm cư dân mới',
      severity: 'success',
    });
  };

  const handleDelete = (id: number) => {
    setResidents(residents.filter(resident => resident.id !== id));
    setSnackbar({
      open: true,
      message: 'Đã xóa cư dân',
      severity: 'success',
    });
  };

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = 
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.apartmentNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || resident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedResidents = filteredResidents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as string)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang ở</MenuItem>
                <MenuItem value="inactive">Đã chuyển đi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Thêm cư dân
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thông tin cá nhân</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Thông tin thuê nhà</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>
                      {resident.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{resident.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {resident.occupation}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    <HomeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    {resident.apartmentNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    {resident.moveInDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    <MoneyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(resident.rentAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      'Đang ở'
                    }
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton onClick={() => handleOpenDialog(resident)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => handleDelete(resident.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredResidents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedResident ? 'Chỉnh sửa thông tin cư dân' : 'Thêm cư dân mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên"
                defaultValue={selectedResident?.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                defaultValue={selectedResident?.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                defaultValue={selectedResident?.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Căn hộ"
                defaultValue={selectedResident?.apartmentNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nghề nghiệp"
                defaultValue={selectedResident?.occupation}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ngày nhận phòng"
                type="date"
                InputLabelProps={{ shrink: true }}
                defaultValue={selectedResident?.moveInDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tiền thuê nhà"
                type="number"
                defaultValue={selectedResident?.rentAmount}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Người liên hệ khẩn cấp</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên"
                defaultValue={selectedResident?.emergencyContact.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mối quan hệ"
                defaultValue={selectedResident?.emergencyContact.relationship}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                defaultValue={selectedResident?.emergencyContact.phone}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Residents;
