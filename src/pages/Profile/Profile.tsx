import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Divider,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ChangePasswordDialog from '../ChangePasswordDialog/ChangePasswordDialog';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  joinDate: string;
  language: string;
  notifications: boolean;
  avatar?: string;
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Mock data - thay thế bằng dữ liệu thực từ API
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || 'Người dùng',
    email: user?.email || 'user@example.com',
    phone: '0123456789',
    address: 'Số 123, Đường ABC, Quận XYZ, TP.HCM',
    role: 'Quản lý tòa nhà',
    joinDate: '01/01/2024',
    language: 'Tiếng Việt',
    notifications: true,
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setEditMode(false);
    setSnackbar({
      open: true,
      message: 'Thông tin cá nhân đã được cập nhật',
      severity: 'success',
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedProfile(profile);
  };

  const handleChange = (field: keyof UserProfile) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({
      ...editedProfile,
      [field]: event.target.value,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Thông tin cá nhân */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                src={profile.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {profile.role}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{ mt: 2 }}
              >
                Chỉnh sửa thông tin
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={profile.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary="Số điện thoại" secondary={profile.phone} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Địa chỉ" secondary={profile.address} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText primary="Ngày tham gia" secondary={profile.joinDate} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Cài đặt và bảo mật */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bảo mật
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SecurityIcon />}
                      onClick={() => setChangePasswordOpen(true)}
                    >
                      Đổi mật khẩu
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cài đặt thông báo
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <NotificationsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Thông báo qua email"
                        secondary="Nhận thông báo về các yêu cầu sửa chữa và thanh toán"
                      />
                      <Button variant="outlined" size="small">
                        {profile.notifications ? 'Tắt' : 'Bật'}
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cài đặt ngôn ngữ
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LanguageIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Ngôn ngữ hiển thị"
                        secondary={profile.language}
                      />
                      <Button variant="outlined" size="small">
                        Thay đổi
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Dialog chỉnh sửa thông tin */}
      <Dialog open={editMode} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={editedProfile.name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={editedProfile.email}
                onChange={handleChange('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={editedProfile.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={editedProfile.address}
                onChange={handleChange('address')}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog đổi mật khẩu */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
