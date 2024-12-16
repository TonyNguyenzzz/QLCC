import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import { Building } from '../../../types/building';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)`
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows[4]};
  }
`;

interface BuildingCardProps {
  building: Building;
  onEdit: () => void;
  onDelete: (id: number) => void;
}

const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    handleClose();
    switch (action) {
      case 'payment':
        console.log('Thanh toán cho tòa nhà:', building.id);
        break;
      case 'history':
        console.log('Xem lịch sử cư trú của tòa nhà:', building.id);
        break;
      case 'residents':
        console.log('Quản lý cư dân của tòa nhà:', building.id);
        break;
      default:
        break;
    }
  };

  return (
    <StyledCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {building.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {building.address}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Số tầng: {building.totalFloors}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng số đơn vị: {building.totalUnits} 
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton size="small" onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(building.id)}>
          <DeleteIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? 'building-card-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="building-card-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleAction('payment')}>
            <ListItemIcon>
              <PaymentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Thanh toán</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('history')}>
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Lịch sử cư trú</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('residents')}>
            <ListItemIcon>
              <PeopleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Quản lý cư dân</ListItemText>
          </MenuItem>
        </Menu>
      </CardActions>
    </StyledCard>
  );
};

export default React.memo(BuildingCard);
