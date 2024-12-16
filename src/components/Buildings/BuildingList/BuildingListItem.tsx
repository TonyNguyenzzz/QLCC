import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fade,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import { Building } from '../../../types/building';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)`
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

interface BuildingListItemProps {
  building: Building;
  onEdit: (building: Building) => void;
  onDelete: (id: number) => void;
}

const BuildingListItem: React.FC<BuildingListItemProps> = ({
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
    <StyledTableRow
      key={building.id}
      tabIndex={0}
      role="button"
      aria-label={`Building ${building.name}`}
    >
      <TableCell component="th" scope="row">
        {building.name}
      </TableCell>
      <TableCell>{building.address}</TableCell>
      <TableCell>{building.totalFloors}</TableCell>
      <TableCell>{building.totalUnits}</TableCell>
      <TableCell align="right">
        <Tooltip
          title="Chỉnh sửa"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton
            aria-label="edit"
            onClick={() => onEdit(building)}
            size="small"
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Xóa"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton
            aria-label="delete"
            onClick={() => onDelete(building.id)}
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? 'building-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="building-menu"
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
      </TableCell>
    </StyledTableRow>
  );
};

export default React.memo(BuildingListItem);
