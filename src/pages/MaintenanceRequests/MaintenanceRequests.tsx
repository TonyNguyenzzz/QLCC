import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  LinearProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

import { MaintenanceRequest, sampleRequests } from '../../data/maintenanceRequestsData';

const MaintenanceRequests: React.FC = () => {
  const theme = useTheme();
  const [requests, setRequests] = useState<MaintenanceRequest[]>(sampleRequests);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenDialog = (request?: MaintenanceRequest) => {
    setSelectedRequest(request || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'in-progress':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const RequestCard: React.FC<{ request: MaintenanceRequest }> = ({ request }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {request.title}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => handleOpenDialog(request)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography color="text.secondary" gutterBottom>
          {request.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={request.status.toUpperCase()}
            size="small"
            sx={{ mr: 1, bgcolor: getStatusColor(request.status), color: 'white' }}
          />
          <Chip
            label={request.priority.toUpperCase()}
            size="small"
            sx={{ bgcolor: getPriorityColor(request.priority), color: 'white' }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Địa điểm:</strong> {request.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Người yêu cầu:</strong> {request.requestedBy}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Ngày yêu cầu:</strong> {request.requestDate}
          </Typography>
          {request.assignedTo && (
            <Typography variant="body2" color="text.secondary">
              <strong>Người xử lý:</strong> {request.assignedTo}
            </Typography>
          )}
        </Box>

        {request.status === 'in-progress' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tiến độ
            </Typography>
            <LinearProgress variant="determinate" value={70} />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý yêu cầu sửa chữa
        </Typography>
        <Typography color="text.secondary">
          Quản lý và theo dõi các yêu cầu sửa chữa trong tòa nhà
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm yêu cầu..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="pending">Đang chờ</MenuItem>
                <MenuItem value="in-progress">Đang xử lý</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
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
              Tạo yêu cầu mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredRequests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request.id}>
            <RequestCard request={request} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRequest ? 'Chỉnh sửa yêu cầu' : 'Tạo yêu cầu mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                defaultValue={selectedRequest?.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={4}
                defaultValue={selectedRequest?.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mức độ ưu tiên</InputLabel>
                <Select
                  defaultValue={selectedRequest?.priority || 'medium'}
                  label="Mức độ ưu tiên"
                >
                  <MenuItem value="low">Thấp</MenuItem>
                  <MenuItem value="medium">Trung bình</MenuItem>
                  <MenuItem value="high">Cao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Địa điểm"
                defaultValue={selectedRequest?.location}
              />
            </Grid>
            {selectedRequest && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    defaultValue={selectedRequest.status}
                    label="Trạng thái"
                  >
                    <MenuItem value="pending">Đang chờ</MenuItem>
                    <MenuItem value="in-progress">Đang xử lý</MenuItem>
                    <MenuItem value="completed">Hoàn thành</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedRequest ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaintenanceRequests;
