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

  const handleRowClick = (id: string) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewDetails = (item: ResidencyHistory) => {
    setSelectedHistory(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedHistory(null);
    setOpenDialog(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: ResidencyHistory['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'terminated':
        return 'error';
      case 'expired':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="residency tabs">
          <Tab label="Lịch sử cư trú" {...a11yProps(0)} />
          <Tab label="Thống kê vi phạm" {...a11yProps(1)} />
          <Tab label="Thông báo" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Cư dân</TableCell>
                <TableCell>Căn hộ</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Loại hợp đồng</TableCell>
                <TableCell>Tiền thuê</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleRowClick(item.id)}>
                        {openRows[item.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1 }} />
                        {item.resident.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Home sx={{ mr: 1 }} />
                        {item.apartmentId}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ mr: 1 }} />
                        {format(new Date(item.startDate), 'dd/MM/yyyy', { locale: vi })}
                        {' - '}
                        {item.endDate
                          ? format(new Date(item.endDate), 'dd/MM/yyyy', { locale: vi })
                          : 'Hiện tại'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {item.leaseType === 'rent' ? 'Thuê' : 'Sở hữu'}
                    </TableCell>
                    <TableCell>
                      {item.monthlyRent ? formatCurrency(item.monthlyRent) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          item.status === 'active'
                            ? 'Đang cư trú'
                            : item.status === 'terminated'
                            ? 'Đã chấm dứt'
                            : 'Hết hạn'
                        }
                        color={getStatusColor(item.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(item)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                      <Collapse in={openRows[item.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Grid container spacing={3}>
                            {/* Thông tin liên hệ */}
                            <Grid item xs={12} md={4}>
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
                                        secondary={item.resident.phoneNumber}
                                      />
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Email />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary="Email"
                                        secondary={item.resident.email}
                                      />
                                    </ListItem>
                                    {item.resident.emergencyContact && (
                                      <ListItem>
                                        <ListItemIcon>
                                          <ContactPhone />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Liên hệ khẩn cấp"
                                          secondary={`${item.resident.emergencyContact.name} (${item.resident.emergencyContact.relationship})`}
                                        />
                                      </ListItem>
                                    )}
                                  </List>
                                </CardContent>
                              </Card>
                            </Grid>

                            {/* Thông tin hợp đồng */}
                            <Grid item xs={12} md={4}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    Thông tin hợp đồng
                                  </Typography>
                                  <List dense>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Assignment />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary="Số hợp đồng"
                                        secondary={item.contractNumber}
                                      />
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <AttachMoney />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary="Tiền đặt cọc"
                                        secondary={
                                          item.depositAmount
                                            ? formatCurrency(item.depositAmount)
                                            : 'N/A'
                                        }
                                      />
                                    </ListItem>
                                  </List>
                                </CardContent>
                              </Card>
                            </Grid>

                            {/* Người ở cùng */}
                            <Grid item xs={12} md={4}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    Người ở cùng ({item.occupants.length})
                                  </Typography>
                                  <List dense>
                                    {item.occupants.map((occupant, index) => (
                                      <ListItem key={index}>
                                        <ListItemIcon>
                                          <Group />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={occupant.name}
                                          secondary={`${occupant.relationship}${
                                            occupant.phoneNumber
                                              ? ` • ${occupant.phoneNumber}`
                                              : ''
                                          }`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </CardContent>
                              </Card>
                            </Grid>

                            {/* Vi phạm */}
                            {item.violations && item.violations.length > 0 && (
                              <Grid item xs={12}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Vi phạm ({item.violations.length})
                                    </Typography>
                                    <List dense>
                                      {item.violations.map((violation, index) => (
                                        <React.Fragment key={index}>
                                          <ListItem>
                                            <ListItemIcon>
                                              <Warning color="error" />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={violation.type}
                                              secondary={`${format(
                                                new Date(violation.date),
                                                'dd/MM/yyyy',
                                                { locale: vi }
                                              )} • ${violation.description}`}
                                            />
                                            <Chip
                                              label={
                                                violation.status === 'resolved'
                                                  ? 'Đã giải quyết'
                                                  : 'Đang xử lý'
                                              }
                                              color={
                                                violation.status === 'resolved'
                                                  ? 'success'
                                                  : 'warning'
                                              }
                                              size="small"
                                            />
                                          </ListItem>
                                          {item.violations && index < item.violations.length - 1 && (
                                            <Divider variant="inset" component="li" />
                                          )}
                                        </React.Fragment>
                                      ))}
                                    </List>
                                  </CardContent>
                                </Card>
                              </Grid>
                            )}
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
        <ViolationStatistics residencyHistories={history} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <NotificationCenter residencyHistories={history} />
      </TabPanel>

      {/* Dialog chi tiết */}
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
            <DialogContent>
              <Grid container spacing={3}>
                {/* Thông tin cơ bản */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">CMND/CCCD</Typography>
                      <Typography>{selectedHistory.resident.identityNumber}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Số hợp đồng</Typography>
                      <Typography>{selectedHistory.contractNumber}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Tiện ích */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Tiện ích đăng ký
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedHistory.utilities.map((utility, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={`${
                            utility.type === 'electricity'
                              ? 'Điện'
                              : utility.type === 'water'
                              ? 'Nước'
                              : utility.type === 'internet'
                              ? 'Internet'
                              : utility.type === 'parking'
                              ? 'Đỗ xe'
                              : 'Khác'
                          }${
                            utility.monthlyFee
                              ? ` - ${formatCurrency(utility.monthlyFee)}`
                              : ''
                          }`}
                          color={utility.included ? 'primary' : 'default'}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Tài liệu */}
                {selectedHistory.documents && selectedHistory.documents.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Tài liệu
                    </Typography>
                    <List dense>
                      {selectedHistory.documents.map((doc, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Description />
                          </ListItemIcon>
                          <ListItemText
                            primary={doc.name}
                            secondary={`${
                              doc.type === 'contract'
                                ? 'Hợp đồng'
                                : doc.type === 'identity'
                                ? 'Giấy tờ tùy thân'
                                : 'Khác'
                            } • ${format(new Date(doc.uploadedAt), 'dd/MM/yyyy', {
                              locale: vi,
                            })}`}
                          />
                          <Button size="small" href={doc.url} target="_blank">
                            Xem
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}

                {/* Yêu cầu bảo trì */}
                {selectedHistory.maintenanceRequests &&
                  selectedHistory.maintenanceRequests.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Yêu cầu bảo trì
                      </Typography>
                      <List dense>
                        {selectedHistory.maintenanceRequests.map(
                          (request, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Build />
                              </ListItemIcon>
                              <ListItemText
                                primary={request.type}
                                secondary={`${format(
                                  new Date(request.date),
                                  'dd/MM/yyyy',
                                  { locale: vi }
                                )} • ${request.description}`}
                              />
                              <Chip
                                label={
                                  request.status === 'completed'
                                    ? 'Hoàn thành'
                                    : request.status === 'in_progress'
                                    ? 'Đang xử lý'
                                    : 'Chờ xử lý'
                                }
                                color={
                                  request.status === 'completed'
                                    ? 'success'
                                    : request.status === 'in_progress'
                                    ? 'primary'
                                    : 'warning'
                                }
                                size="small"
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </Grid>
                  )}

                {/* Ghi chú */}
                {selectedHistory.notes && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Ghi chú
                    </Typography>
                    <Typography variant="body2">{selectedHistory.notes}</Typography>
                  </Grid>
                )}
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

export default ResidencyHistoryView;
