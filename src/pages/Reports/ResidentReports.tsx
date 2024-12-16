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
  Person as ResidentIcon, 
  Print as PrintIcon, 
  GetApp as DownloadIcon 
} from '@mui/icons-material';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data cho báo cáo cư dân
const mockResidentReports = [
  {
    id: 'R001',
    name: 'Nguyễn Văn A',
    buildingId: 'B001',
    apartmentId: '101',
    phoneNumber: '0901234567',
    email: 'vana@example.com',
    leaseType: 'rent',
    startDate: new Date('2023-01-01'),
    status: 'active',
    paymentStatus: 'paid',
    violationCount: 2
  },
  {
    id: 'R002',
    name: 'Trần Thị B',
    buildingId: 'B001',
    apartmentId: '202',
    phoneNumber: '0907654321',
    email: 'thib@example.com',
    leaseType: 'own',
    startDate: new Date('2022-06-15'),
    status: 'active',
    paymentStatus: 'pending',
    violationCount: 1
  },
  {
    id: 'R003',
    name: 'Lê Văn C',
    buildingId: 'B002',
    apartmentId: '303',
    phoneNumber: '0903456789',
    email: 'vanc@example.com',
    leaseType: 'rent',
    startDate: new Date('2023-11-01'),
    status: 'inactive',
    paymentStatus: 'overdue',
    violationCount: 3
  }
];

const ResidentReports: React.FC = () => {
  // Thống kê trạng thái cư dân
  const residentStatusStats = useMemo(() => {
    const stats = {
      active: 0,
      inactive: 0
    };
    mockResidentReports.forEach(report => {
      stats[report.status as keyof typeof stats]++;
    });
    return Object.entries(stats).map(([status, count]) => ({ status, count }));
  }, []);

  // Xuất PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Báo Cáo Cư Dân', 14, 15);
    
    const tableColumn = ['Mã CĐ', 'Tên', 'Tòa Nhà', 'Căn Hộ', 'SĐT', 'Loại Thuê', 'Trạng Thái'];
    const tableRows = mockResidentReports.map(report => [
      report.id,
      report.name,
      report.buildingId,
      report.apartmentId,
      report.phoneNumber,
      report.leaseType,
      report.status
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save('bao_cao_cu_dan.pdf');
  };

  // Xuất Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      mockResidentReports.map(report => ({
        'Mã Cư Dân': report.id,
        'Tên': report.name,
        'Tòa Nhà': report.buildingId,
        'Căn Hộ': report.apartmentId,
        'Số Điện Thoại': report.phoneNumber,
        'Email': report.email,
        'Loại Thuê': report.leaseType,
        'Ngày Bắt Đầu': format(report.startDate, 'dd/MM/yyyy'),
        'Trạng Thái': report.status,
        'Trạng Thái Thanh Toán': report.paymentStatus,
        'Số Vi Phạm': report.violationCount
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo Cư Dân');
    XLSX.writeFile(workbook, 'bao_cao_cu_dan.xlsx');
  };

  // Dữ liệu biểu đồ vi phạm
  const violationChartData = mockResidentReports.map(report => ({
    name: report.name,
    violations: report.violationCount
  }));

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <ResidentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Báo Cáo Cư Dân
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
                Số Lượng Vi Phạm Của Cư Dân
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={violationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="violations" fill="#8884d8" name="Số Vi Phạm" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trạng Thái Cư Dân
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Box>
                  {residentStatusStats.map((stat) => (
                    <Chip 
                      key={stat.status}
                      label={`${stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}: ${stat.count}`}
                      color={stat.status === 'active' ? 'success' : 'warning'}
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
                  <TableCell>Mã CĐ</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Tòa Nhà</TableCell>
                  <TableCell>Căn Hộ</TableCell>
                  <TableCell>Loại Thuê</TableCell>
                  <TableCell>Ngày Bắt Đầu</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Vi Phạm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockResidentReports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.buildingId}</TableCell>
                    <TableCell>{report.apartmentId}</TableCell>
                    <TableCell>{report.leaseType}</TableCell>
                    <TableCell>{format(report.startDate, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        color={report.status === 'active' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>{report.violationCount}</TableCell>
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

export default ResidentReports;
