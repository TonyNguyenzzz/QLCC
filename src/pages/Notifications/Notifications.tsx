// src/pages/Notifications/Notifications.tsx
import React, { useMemo } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import notificationsData from '../../data/notificationsData';

const Notifications: React.FC = () => {
  const sortedNotifications = useMemo(
    () => [...notificationsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thông Báo
      </Typography>
      <Paper>
        <List>
          {sortedNotifications.map((notification) => (
            <ListItem key={notification.id} divider>
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.date).toLocaleDateString()}
              />
            </ListItem>
          ))}
          {sortedNotifications.length === 0 && (
            <ListItem>
              <ListItemText primary="Không có thông báo nào." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default React.memo(Notifications);
