import React, { useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip
} from '@mui/material';
import { 
  Build as MaintenanceIcon, 
  Print as PrintIcon, 
  GetApp as DownloadIcon 
} from '@mui/icons-material';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mock data cho báo cáo bảo trì
const mockMaintenanceReports = [
  {
    id: 'MR001',
    buildingId: 'B001',
    apartmentId: '101',
    residentName: 'Nguyễn Văn A',
    requestDate: new Date('2024-01-15'),
    type: 'Điện',
    description: 'Ổ cắm điện bị hỏng',
    status: 'completed',
    resolvedDate: new Date('2024-01-20')
  },
  {
    id: 'MR002',
    buildingId: 'B001',
    apartmentId: '202',
    residentName: 'Trần Thị B',
    requestDate: new Date('2024-02-10'),
    type: 'Nước',
    description: 'Vòi nước rò rỉ',
    status: 'pending',
    resolvedDate: null
  },
  {
    id: 'MR003',
    buildingId: 'B002',
    apartmentId: '303',
    residentName: 'Lê Văn C',
    requestDate: new Date('2024-03-05'),
    type: 'Thang Máy',
    description: 'Thang máy kêu to khi di chuyển',
    status: 'in-progress',
    resolvedDate: null
  }
];

const MaintenanceReports: React.FC = () => {
  // Thống kê trạng thái yêu cầu bảo trì
  const maintenanceStatusStats = useMemo(() => {
    const stats = {
      completed: 0,
      pending: 0,
      'in-progress': 0
    };
    mockMaintenanceReports.forEach(report => {
      stats[report.status as keyof typeof stats]++;
    });
    return Object.entries(stats).map(([status, count]) => ({ status, count }));
  }, []);

  // Xuất PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Báo Cáo Bảo Trì', 14, 15);
    
    const tableColumn = ['Mã YC', 'Tòa Nhà', 'Căn Hộ', 'Cư Dân', 'Loại', 'Ngày Yêu Cầu', 'Trạng Thái'];
    const tableRows = mockMaintenanceReports.map(report => [
      report.id,
      report.buildingId,
      report.apartmentId,
      report.residentName,
      report.type,
      format(report.requestDate, 'dd/MM/yyyy'),
      report.status
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save('bao_cao_bao_tri.pdf');
  };

  // Xuất Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      mockMaintenanceReports.map(report => ({
        'Mã Yêu Cầu': report.id,
        'Tòa Nhà': report.buildingId,
        'Căn Hộ': report.apartmentId,
        'Cư Dân': report.residentName,
        'Loại Bảo Trì': report.type,
        'Mô Tả': report.description,
        'Ngày Yêu Cầu': format(report.requestDate, 'dd/MM/yyyy'),
        'Ngày Giải Quyết': report.resolvedDate ? format(report.resolvedDate, 'dd/MM/yyyy') : 'Chưa giải quyết',
        'Trạng Thái': report.status
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo Bảo Trì');
    XLSX.writeFile(workbook, 'bao_cao_bao_tri.xlsx');
  };

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <MaintenanceIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Báo Cáo Bảo Trì
        </Typography>
        <Box>
          <Button 
            startIcon={<PrintIcon />} 
            onClick={exportPDF}
            sx={{ mr: 1 }}
            variant="outlined"
            color="secondary"
          >
            Xuất PDF
          </Button>
          <Button 
            startIcon={<DownloadIcon />} 
            onClick={exportExcel}
            variant="outlined"
            color="success"
          >
            Xuất Excel
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trạng Thái Yêu Cầu Bảo Trì
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={maintenanceStatusStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {maintenanceStatusStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống Kê Trạng Thái
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Box>
                  {maintenanceStatusStats.map((stat, index) => (
                    <Chip 
                      key={stat.status}
                      label={`${stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}: ${stat.count}`}
                      color={
                        stat.status === 'completed' ? 'success' : 
                        stat.status === 'pending' ? 'warning' : 
                        'info'
                      }
                      sx={{ m: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã YC</TableCell>
                  <TableCell>Tòa Nhà</TableCell>
                  <TableCell>Căn Hộ</TableCell>
                  <TableCell>Cư Dân</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Ngày Yêu Cầu</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockMaintenanceReports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>{report.buildingId}</TableCell>
                    <TableCell>{report.apartmentId}</TableCell>
                    <TableCell>{report.residentName}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{format(report.requestDate, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        color={
                          report.status === 'completed' ? 'success' : 
                          report.status === 'pending' ? 'warning' : 
                          'info'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MaintenanceReports;
