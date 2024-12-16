import React from 'react';
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { Building } from '../../../types/building';

interface AdvancedFiltersProps {
  buildings: Building[];
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  buildingId: string;
  paymentType: string;
  status: string;
}

const initialFilters: FilterValues = {
  dateRange: {
    startDate: null,
    endDate: null,
  },
  buildingId: '',
  paymentType: '',
  status: '',
};

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  buildings,
  onFilterChange,
}) => {
  const [filters, setFilters] = React.useState<FilterValues>(initialFilters);

  const handleFilterChange = (field: keyof FilterValues, value: any) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: Date | null) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Từ ngày"
              value={filters.dateRange.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small"
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Đến ngày"
              value={filters.dateRange.endDate}
              onChange={(date) => handleDateChange('endDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small"
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tòa nhà</InputLabel>
              <Select
                value={filters.buildingId}
                label="Tòa nhà"
                onChange={(e) => handleFilterChange('buildingId', e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại thanh toán</InputLabel>
              <Select
                value={filters.paymentType}
                label="Loại thanh toán"
                onChange={(e) => handleFilterChange('paymentType', e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="RENT">Tiền thuê</MenuItem>
                <MenuItem value="SERVICE">Phí dịch vụ</MenuItem>
                <MenuItem value="DEPOSIT">Tiền cọc</MenuItem>
                <MenuItem value="OTHER">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filters.status}
                label="Trạng thái"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="COMPLETED">Đã thanh toán</MenuItem>
                <MenuItem value="PENDING">Chờ thanh toán</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              onClick={handleReset}
              fullWidth
            >
              Đặt lại
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default AdvancedFilters;
