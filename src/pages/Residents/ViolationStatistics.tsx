import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tooltip as MuiTooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { 
  WarningAmber as WarningIcon, 
  CheckCircleOutline as ResolvedIcon,
  PendingOutlined as PendingIcon 
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ResidencyHistory } from '../../types/residency';
import { useAuth } from '../../contexts/AuthContext';
import { 
  mockViolationStatistics, 
  getViolationStatisticsByType,
  getViolationStatisticsByStatus
} from '../../data/violationStatistics';

interface ViolationStatisticsProps {
  residencyHistories?: ResidencyHistory[];
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const ViolationStatistics: React.FC<ViolationStatisticsProps> = ({
  residencyHistories = mockViolationStatistics,
}) => {
  const { user } = useAuth();

  // Kiểm tra quyền truy cập (chỉ dành cho Manager)
  if (user?.role !== 'manager') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <Typography variant="h6" color="error">
          Bạn không có quyền truy cập thống kê vi phạm
        </Typography>
      </Box>
    );
  }

  // Thống kê chi tiết vi phạm
  const violationDetails = React.useMemo(() => {
    const typeStats = getViolationStatisticsByType();
    const statusStats = getViolationStatisticsByStatus();

    return Object.entries(typeStats).map(([type, count]) => ({
      type,
      count,
      resolved: statusStats['resolved'] || 0,
      pending: statusStats['pending'] || 0
    }));
  }, [residencyHistories]);

  // Thống kê tổng quan
  const violationStatusSummary = React.useMemo(() => {
    const statusStats = getViolationStatisticsByStatus();

    return { 
      total: Object.values(statusStats).reduce((a, b) => a + b, 0),
      resolved: statusStats['resolved'] || 0,
      pending: statusStats['pending'] || 0
    };
  }, [residencyHistories]);

  // Biểu đồ vi phạm theo loại
  const violationsByType = React.useMemo(() => {
    const typeStats = getViolationStatisticsByType();
    return Object.entries(typeStats).map(([type, count]) => ({ type, count }));
  }, [residencyHistories]);

  // Biểu đồ vi phạm theo trạng thái
  const violationsByStatus = React.useMemo(() => {
    const statusStats = getViolationStatisticsByStatus();
    return Object.entries(statusStats).map(([name, value]) => ({ name, value }));
  }, [residencyHistories]);

  // Biểu đồ vi phạm theo tháng
  const violationsByMonth = React.useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const months = eachMonthOfInterval({
      start: sixMonthsAgo,
      end: now,
    });

    return months.map((month) => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      let count = 0;

      residencyHistories.forEach((history) => {
        history.violations?.forEach((violation) => {
          const violationDate = new Date(violation.date);
          if (violationDate >= start && violationDate <= end) {
            count++;
          }
        });
      });

      return {
        month: format(month, 'MM/yyyy', { locale: vi }),
        count,
      };
    });
  }, [residencyHistories]);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        <WarningIcon sx={{ mr: 2, verticalAlign: 'middle' }} color="error" />
        Thống Kê Vi Phạm Toàn Diện
      </Typography>

      <Grid container spacing={3}>
        {/* Tổng Quan Vi Phạm */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng Quan
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="body2">Tổng Vi Phạm</Typography>
                  <Typography variant="h5">{violationStatusSummary.total}</Typography>
                </Box>
                <Box>
                  <Chip 
                    icon={<ResolvedIcon />} 
                    label={`Đã Giải Quyết: ${violationStatusSummary.resolved}`} 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    icon={<PendingIcon />} 
                    label={`Đang Xử Lý: ${violationStatusSummary.pending}`} 
                    color="warning" 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chi Tiết Vi Phạm */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chi Tiết Vi Phạm
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại Vi Phạm</TableCell>
                      <TableCell align="right">Tổng Số</TableCell>
                      <TableCell align="right">Đã Giải Quyết</TableCell>
                      <TableCell align="right">Đang Xử Lý</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {violationDetails.map((violation) => (
                      <TableRow key={violation.type}>
                        <TableCell>{violation.type}</TableCell>
                        <TableCell align="right">{violation.count}</TableCell>
                        <TableCell align="right" sx={{ color: 'success.main' }}>
                          {violation.resolved}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'warning.main' }}>
                          {violation.pending}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ theo loại vi phạm */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Vi phạm theo loại
            </Typography>
            <ResponsiveContainer>
              <BarChart data={violationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Biểu đồ theo trạng thái */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Trạng thái xử lý
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={violationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    name,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 25;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#333"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {`${name} (${value})`}
                      </text>
                    );
                  }}
                >
                  {violationsByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Biểu đồ theo thời gian */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Xu hướng vi phạm theo tháng
            </Typography>
            <ResponsiveContainer>
              <LineChart data={violationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViolationStatistics;
