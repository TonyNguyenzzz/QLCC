import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Button, 
  Box, 
  TextField, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  Home as HomeIcon, 
  CalendarToday as CalendarIcon,
  Lock as PasswordIcon
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';

interface ResidentProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  apartmentNumber: string;
  buildingName: string;
  joinDate: string;
}

const ResidentProfile: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ResidentProfileData>({
    name: user?.name || 'Cư Dân',
    email: user?.email || 'resident@example.com',
    phone: '0987654321',
    address: 'Chưa cập nhật',
    apartmentNumber: 'Chưa cập nhật',
    buildingName: 'Chưa cập nhật',
    joinDate: 'Chưa cập nhật'
  });

  const [editedData, setEditedData] = useState<ResidentProfileData>(profileData);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setEditMode(false);
  };

  const handleInputChange = (field: keyof ResidentProfileData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({
      ...editedData,
      [field]: event.target.value
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Hồ Sơ Cá Nhân Cư Dân
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                margin: '0 auto', 
                mb: 2, 
                bgcolor: theme.palette.primary.main 
              }}
            >
              {profileData.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6">{profileData.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary">Cư Dân</Typography>
            
            {!editMode ? (
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />} 
                onClick={handleEditToggle}
                sx={{ mt: 2 }}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSave}
                >
                  Lưu
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông Tin Chi Tiết
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {!editMode ? (
              <List>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Email" secondary={profileData.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon /></ListItemIcon>
                  <ListItemText primary="Số điện thoại" secondary={profileData.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Địa chỉ" 
                    secondary={`${profileData.apartmentNumber}, ${profileData.buildingName}`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CalendarIcon /></ListItemIcon>
                  <ListItemText primary="Ngày tham gia" secondary={profileData.joinDate} />
                </ListItem>
              </List>
            ) : (
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Email"
                  value={editedData.email}
                  onChange={handleInputChange('email')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={editedData.phone}
                  onChange={handleInputChange('phone')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Số căn hộ"
                  value={editedData.apartmentNumber}
                  onChange={handleInputChange('apartmentNumber')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Tòa nhà"
                  value={editedData.buildingName}
                  onChange={handleInputChange('buildingName')}
                  margin="normal"
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResidentProfile;
