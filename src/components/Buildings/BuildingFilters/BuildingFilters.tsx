import React from 'react';
import { Paper, Box } from '@mui/material';
import SearchBar from './SearchBar';

interface BuildingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const BuildingFilters: React.FC<BuildingFiltersProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <SearchBar value={search} onChange={onSearchChange} />
      </Box>
    </Paper>
  );
};

export default React.memo(BuildingFilters);
