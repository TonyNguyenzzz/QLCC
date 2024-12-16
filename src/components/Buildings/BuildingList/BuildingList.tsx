import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  styled,
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import { Building } from '../../../types/building';
import BuildingCard from './BuildingCard';
import BuildingListItem from './BuildingListItem';

interface BuildingListProps {
  buildings: Building[];
  onEdit: (building: Building) => void;
  onDelete: (id: number) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  search: string;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
  },
}));

const BuildingList: React.FC<BuildingListProps> = ({
  buildings,
  onEdit,
  onDelete,
  viewMode,
  onViewModeChange,
  search,
}) => {
  const theme = useTheme();

  const filteredBuildings = buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(search.toLowerCase()) ||
      building.address.toLowerCase().includes(search.toLowerCase())
  );

  const renderViewModeToggle = () => (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <Tooltip title="Chế độ danh sách">
        <IconButton
          onClick={() => onViewModeChange('list')}
          color={viewMode === 'list' ? 'primary' : 'default'}
        >
          <ViewListIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Chế độ lưới">
        <IconButton
          onClick={() => onViewModeChange('grid')}
          color={viewMode === 'grid' ? 'primary' : 'default'}
        >
          <GridViewIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredBuildings.map((building) => (
        <Grid item xs={12} sm={6} md={4} key={building.id}>
          <BuildingCard
            building={building}
            onEdit={() => onEdit(building)}
            onDelete={() => onDelete(building.id)}
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên tòa nhà</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Số tầng</TableCell>
            <TableCell>Diện tích (m²)</TableCell>
            <TableCell align="right">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBuildings.map((building) => (
            <BuildingListItem
              key={building.id}
              building={building}
              onEdit={() => onEdit(building)}
              onDelete={() => onDelete(building.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      {renderViewModeToggle()}
      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </div>
  );
};

export default BuildingList;
