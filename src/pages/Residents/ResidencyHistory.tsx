import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  Tooltip,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Person,
  Home,
  Description,
  Warning,
  Build,
  Group,
  AttachMoney,
  CalendarToday,
  Phone,
  Email,
  ContactPhone,
  Assignment,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ResidencyHistory } from '../../types/residency';
import ViolationStatistics from './ViolationStatistics';
import NotificationCenter from './NotificationCenter';

interface ResidencyHistoryProps {
  history: ResidencyHistory[];
  onViewDetails?: (history: ResidencyHistory) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`residency-tabpanel-${index}`}
      aria-labelledby={`residency-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `residency-tab-${index}`,
    'aria-controls': `residency-tabpanel-${index}`,
  };
}

const ResidencyHistoryView: React.FC<ResidencyHistoryProps> = ({
  history,
  onViewDetails,
}) => {
  const [openRows, setOpenRows] = React.useState<{ [key: string]: boolean }>({});
  const [selectedHistory, setSelectedHistory] = React.useState<ResidencyHistory | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const handleRowClick = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenDialog = (historyItem: ResidencyHistory) => {
    setSelectedHistory(historyItem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHistory(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredHistory = React.useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = 
        item.resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.apartmentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      const isActive = item.status === 'active';
      return matchesSearch && (filterStatus === 'active' ? isActive : !isActive);
    });
  }, [history, searchTerm, filterStatus]);

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Lịch Sử Cư Trú
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                color="primary"
                onClick={() => {/* Handle add new */}}
              >
                Thêm Hồ Sơ Cư Trú
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên hoặc căn hộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Đang cư trú</MenuItem>
                <MenuItem value="inactive">Đã kết thúc</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
              },
            }}
          >
            <Tab 
              label="Lịch sử cư trú" 
              icon={<HistoryIcon />} 
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              label="Thống kê vi phạm" 
              icon={<AssessmentIcon />} 
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              label="Thông báo" 
              icon={<NotificationsIcon />} 
              iconPosition="start"
              {...a11yProps(2)} 
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Mã</TableCell>
                  <TableCell>Cư dân</TableCell>
                  <TableCell>Căn hộ</TableCell>
                  <TableCell>Ngày vào</TableCell>
                  <TableCell>Ngày ra</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow 
                      sx={{ 
                        '& > *': { borderBottom: 'unset' },
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleRowClick(row.id)}
                        >
                          {openRows[row.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.resident.name}</TableCell>
                      <TableCell>{row.apartmentId}</TableCell>
                      <TableCell>{format(new Date(row.startDate), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                      <TableCell>{row.endDate ? format(new Date(row.endDate), 'dd/MM/yyyy', { locale: vi }) : 'Hiện tại'}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={row.status === 'active' ? 'Đang cư trú' : 'Đã kết thúc'}
                          color={row.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(row)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => {/* Handle edit */}}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => {/* Handle delete */}}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Thông tin liên hệ
                                    </Typography>
                                    <List dense>
                                      <ListItem>
                                        <ListItemIcon>
                                          <Phone />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary="Số điện thoại"
                                          secondary={row.resident.phoneNumber || 'Chưa cập nhật'}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemIcon>
                                          <Email />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary="Email"
                                          secondary={row.resident.email || 'Chưa cập nhật'}
                                        />
                                      </ListItem>
                                    </List>
                                  </CardContent>
                                </Card>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Thống kê
                                    </Typography>
                                    <List dense>
                                      <ListItem>
                                        <ListItemIcon>
                                          <Warning />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary="Số lần vi phạm"
                                          secondary={row.violations?.length || 0}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemIcon>
                                          <Build />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary="Yêu cầu bảo trì"
                                          secondary={row.maintenanceRequests?.length || 0}
                                        />
                                      </ListItem>
                                    </List>
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ViolationStatistics residencyHistories={filteredHistory} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <NotificationCenter residencyHistories={filteredHistory} />
        </TabPanel>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedHistory && (
          <>
            <DialogTitle>
              Chi tiết lịch sử cư trú - {selectedHistory.resident.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin cơ bản
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tên cư dân"
                        secondary={selectedHistory.resident.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Home />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Căn hộ"
                        secondary={selectedHistory.apartmentId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Thời gian cư trú"
                        secondary={`${format(new Date(selectedHistory.startDate), 'dd/MM/yyyy', { locale: vi })} - ${selectedHistory.endDate ? format(new Date(selectedHistory.endDate), 'dd/MM/yyyy', { locale: vi }) : 'Hiện tại'}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin bổ sung
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Warning />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Vi phạm"
                        secondary={`${selectedHistory.violations?.length || 0} lần`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Build />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Yêu cầu bảo trì"
                        secondary={`${selectedHistory.maintenanceRequests?.length || 0} yêu cầu`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

const ResidencyHistoryPage: React.FC = () => {
  // Mock data
  const mockHistories: ResidencyHistory[] = [
    {
      id: '1',
      residentId: '1',
      resident: {
        id: '1',
        name: 'Nguyễn Văn A',
        phoneNumber: '0987654321',
        email: 'nguyenvana@email.com',
        identityNumber: '123456789',
        emergencyContact: {
          name: 'Nguyễn Văn B',
          relationship: 'Em trai',
          phoneNumber: '0987654322'
        }
      },
      buildingId: '1',
      apartmentId: 'A101',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      leaseType: 'rent',
      monthlyRent: 10000000,
      depositAmount: 20000000,
      contractNumber: 'HD001',
      status: 'active',
      notes: 'Thanh toán đúng hạn',
      documents: [
        {
          type: 'contract',
          name: 'Hợp đồng thuê nhà',
          url: '/documents/contract1.pdf',
          uploadedAt: new Date('2023-01-01')
        },
        {
          type: 'identity',
          name: 'CCCD',
          url: '/documents/id1.pdf',
          uploadedAt: new Date('2023-01-01')
        }
      ],
      utilities: [
        {
          type: 'electricity',
          included: false,
          monthlyFee: 500000
        },
        {
          type: 'water',
          included: true,
          monthlyFee: 200000
        }
      ],
      occupants: [
        {
          name: 'Nguyễn Thị X',
          relationship: 'Vợ',
          identityNumber: '123456790',
          phoneNumber: '0987654323'
        }
      ],
      violations: [
        {
          date: new Date('2023-06-15'),
          type: 'Tiếng ồn',
          description: 'Gây ồn sau 22h',
          status: 'resolved',
          resolution: 'Đã nhắc nhở và cam kết không tái phạm'
        }
      ],
      maintenanceRequests: [
        {
          date: new Date('2023-05-20'),
          type: 'Sửa điều hòa',
          description: 'Điều hòa không mát',
          status: 'completed',
          cost: 500000
        }
      ],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-12-15'),
    },
    {
      id: '2',
      residentId: '2',
      resident: {
        id: '2',
        name: 'Trần Thị B',
        phoneNumber: '0123456789',
        email: 'tranthib@email.com',
        identityNumber: '987654321',
        emergencyContact: {
          name: 'Trần Văn C',
          relationship: 'Anh trai',
          phoneNumber: '0123456788'
        }
      },
      buildingId: '1',
      apartmentId: 'B202',
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-12-31'),
      leaseType: 'own',
      contractNumber: 'HD002',
      status: 'active',
      notes: 'Chủ sở hữu',
      documents: [
        {
          type: 'contract',
          name: 'Hợp đồng mua bán',
          url: '/documents/contract2.pdf',
          uploadedAt: new Date('2023-03-01')
        }
      ],
      utilities: [
        {
          type: 'electricity',
          included: false
        },
        {
          type: 'water',
          included: false
        },
        {
          type: 'internet',
          included: false
        }
      ],
      occupants: [
        {
          name: 'Trần Văn D',
          relationship: 'Con trai',
          identityNumber: '987654322',
          phoneNumber: '0123456787'
        }
      ],
      violations: [],
      maintenanceRequests: [],
      createdAt: new Date('2023-03-01'),
      updatedAt: new Date('2023-12-15'),
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ResidencyHistoryView history={mockHistories} />
    </Box>
  );
};

export default ResidencyHistoryPage;
