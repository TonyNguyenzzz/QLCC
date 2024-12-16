import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ResidencyHistory } from '../../types/residency';

interface NotificationCenterProps {
  residencyHistories: ResidencyHistory[];
}

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'maintenance' | 'payment' | 'violation' | 'other';
  recipients: string[]; // resident IDs
  sendVia: ('email' | 'sms' | 'app')[];
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: Date;
  sentAt?: Date;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  residencyHistories,
}) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = React.useState<Partial<Notification>>({
    title: '',
    content: '',
    type: 'general',
    recipients: [],
    sendVia: ['app'],
  });

  const handleOpenDialog = (notification?: Notification) => {
    if (notification) {
      setFormData(notification);
      setSelectedNotification(notification);
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'general',
        recipients: [],
        sendVia: ['app'],
      });
      setSelectedNotification(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotification(null);
    setFormData({
      title: '',
      content: '',
      type: 'general',
      recipients: [],
      sendVia: ['app'],
    });
  };

  const handleSendNotification = async () => {
    try {
      // TODO: Implement actual sending logic
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...formData as Omit<Notification, 'id' | 'status' | 'createdAt'>,
        status: 'sent',
        createdAt: new Date(),
        sentAt: new Date(),
      };

      setNotifications([newNotification, ...notifications]);
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: 'Thông báo đã được gửi thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi gửi thông báo',
        severity: 'error',
      });
    }
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    setSnackbar({
      open: true,
      message: 'Thông báo đã được xóa',
      severity: 'success',
    });
  };

  const getNotificationTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'general':
        return 'Chung';
      case 'maintenance':
        return 'Bảo trì';
      case 'payment':
        return 'Thanh toán';
      case 'violation':
        return 'Vi phạm';
      case 'other':
        return 'Khác';
      default:
        return type;
    }
  };

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'scheduled':
        return 'info';
      case 'sent':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Trung tâm thông báo</Typography>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => handleOpenDialog()}
            >
              Tạo thông báo mới
            </Button>
          </Box>
        </Grid>

        {/* Danh sách thông báo */}
        <Grid item xs={12}>
          <Paper>
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.id} divider>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {notification.content}
                        </Typography>
                        <br />
                        <Box mt={1}>
                          <Chip
                            size="small"
                            label={getNotificationTypeLabel(notification.type)}
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            size="small"
                            label={`${notification.recipients.length} người nhận`}
                            sx={{ mr: 1 }}
                          />
                          {notification.sendVia.map((via) => (
                            <Chip
                              key={via}
                              size="small"
                              label={via === 'email' ? 'Email' : via === 'sms' ? 'SMS' : 'App'}
                              sx={{ mr: 1 }}
                            />
                          ))}
                          <Chip
                            size="small"
                            label={
                              notification.status === 'draft'
                                ? 'Nháp'
                                : notification.status === 'scheduled'
                                ? 'Đã lên lịch'
                                : notification.status === 'sent'
                                ? 'Đã gửi'
                                : 'Thất bại'
                            }
                            color={getStatusColor(notification.status)}
                          />
                        </Box>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenDialog(notification)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog tạo/chỉnh sửa thông báo */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung"
                multiline
                rows={4}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại thông báo</InputLabel>
                <Select
                  value={formData.type}
                  label="Loại thông báo"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Notification['type'],
                    })
                  }
                >
                  <MenuItem value="general">Chung</MenuItem>
                  <MenuItem value="maintenance">Bảo trì</MenuItem>
                  <MenuItem value="payment">Thanh toán</MenuItem>
                  <MenuItem value="violation">Vi phạm</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Người nhận</InputLabel>
                <Select
                  multiple
                  value={formData.recipients}
                  label="Người nhận"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recipients: e.target.value as string[],
                    })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            residencyHistories.find(
                              (h) => h.resident.id === value
                            )?.resident.name
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {residencyHistories.map((history) => (
                    <MenuItem key={history.resident.id} value={history.resident.id}>
                      {history.resident.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Gửi qua
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sendVia?.includes('email')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sendVia: e.target.checked
                          ? [...(formData.sendVia || []), 'email']
                          : formData.sendVia?.filter((v) => v !== 'email'),
                      })
                    }
                  />
                }
                label="Email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sendVia?.includes('sms')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sendVia: e.target.checked
                          ? [...(formData.sendVia || []), 'sms']
                          : formData.sendVia?.filter((v) => v !== 'sms'),
                      })
                    }
                  />
                }
                label="SMS"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sendVia?.includes('app')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sendVia: e.target.checked
                          ? [...(formData.sendVia || []), 'app']
                          : formData.sendVia?.filter((v) => v !== 'app'),
                      })
                    }
                  />
                }
                label="App"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSendNotification}
            startIcon={<SendIcon />}
          >
            {selectedNotification ? 'Cập nhật' : 'Gửi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationCenter;
