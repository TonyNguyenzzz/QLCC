import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  FileDownload as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { vi } from 'date-fns/locale';

interface PaymentReportFiltersProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  reportType: string;
  onReportTypeChange: (type: string) => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  onExport: () => void;
  onPrint: () => void;
  onEmail: () => void;
  onRefresh: () => void;
}

const PaymentReportFilters: React.FC<PaymentReportFiltersProps> = ({
  timeRange,
  onTimeRangeChange,
  reportType,
  onReportTypeChange,
  startDate,
  endDate,
  onDateChange,
  onExport,
  onPrint,
  onEmail,
  onRefresh,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Khoảng thời gian</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              label="Khoảng thời gian"
            >
              <MenuItem value="today">Hôm nay</MenuItem>
              <MenuItem value="yesterday">Hôm qua</MenuItem>
              <MenuItem value="thisWeek">Tuần này</MenuItem>
              <MenuItem value="lastWeek">Tuần trước</MenuItem>
              <MenuItem value="thisMonth">Tháng này</MenuItem>
              <MenuItem value="lastMonth">Tháng trước</MenuItem>
              <MenuItem value="thisQuarter">Quý này</MenuItem>
              <MenuItem value="lastQuarter">Quý trước</MenuItem>
              <MenuItem value="thisYear">Năm nay</MenuItem>
              <MenuItem value="custom">Tùy chỉnh</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {timeRange === 'custom' && (
          <>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Từ ngày"
                  value={startDate}
                  onChange={(newValue) => onDateChange(newValue, endDate)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Đến ngày"
                  value={endDate}
                  onChange={(newValue) => onDateChange(startDate, newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Loại báo cáo</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => onReportTypeChange(e.target.value)}
              label="Loại báo cáo"
            >
              <MenuItem value="overview">Tổng quan</MenuItem>
              <MenuItem value="detailed">Chi tiết</MenuItem>
              <MenuItem value="analytics">Phân tích</MenuItem>
              <MenuItem value="comparison">So sánh</MenuItem>
              <MenuItem value="forecast">Dự báo</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="Làm mới">
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xuất báo cáo">
              <IconButton onClick={onExport}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="In báo cáo">
              <IconButton onClick={onPrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gửi qua email">
              <IconButton onClick={onEmail}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentReportFilters;
