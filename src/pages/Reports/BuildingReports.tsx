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
  Business as BuildingIcon, 
  Print as PrintIcon, 
  GetApp as DownloadIcon 
} from '@mui/icons-material';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mock data cho báo cáo tòa nhà
const mockBuildingReports = [
  {
    id: 'B001',
    name: 'Chung cư Sunrise',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    totalApartments: 50,
    occupiedApartments: 45,
    maintenanceRequests: 10,
    activeResidents: 90,
    status: 'active',
    constructionYear: 2018,
    lastMaintenanceDate: new Date('2023-12-15')
  },
  {
    id: 'B002',
    name: 'Chung cư Moonlight',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    totalApartments: 80,
    occupiedApartments: 65,
    maintenanceRequests: 15,
    activeResidents: 130,
    status: 'maintenance',
    constructionYear: 2015,
    lastMaintenanceDate: new Date('2024-01-20')
  },
  {
    id: 'B003',
    name: 'Chung cư Starlight',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    totalApartments: 30,
    occupiedApartments: 25,
    maintenanceRequests: 5,
    activeResidents: 50,
    status: 'inactive',
    constructionYear: 2010,
    lastMaintenanceDate: new Date('2023-11-10')
  }
];

const BuildingReports: React.FC = () => {
  // Thống kê trạng thái tòa nhà
  const buildingStatusStats = useMemo(() => {
    const stats = {
      active: 0,
      maintenance: 0,
      inactive: 0
    };
    mockBuildingReports.forEach(report => {
      stats[report.status as keyof typeof stats]++;
    });
    return Object.entries(stats).map(([status, count]) => ({ status, count }));
  }, []);

  // Xuất PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Báo Cáo Tòa Nhà', 14, 15);
    
    const tableColumn = ['Mã TN', 'Tên', 'Địa Chỉ', 'Tổng Căn Hộ', 'Căn Hộ Đã Thuê', 'Trạng Thái'];
    const tableRows = mockBuildingReports.map(report => [
      report.id,
      report.name,
      report.address,
      report.totalApartments,
      report.occupiedApartments,
      report.status
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save('bao_cao_toa_nha.pdf');
  };

  // Xuất Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      mockBuildingReports.map(report => ({
        'Mã Tòa Nhà': report.id,
        'Tên': report.name,
        'Địa Chỉ': report.address,
        'Tổng Căn Hộ': report.totalApartments,
        'Căn Hộ Đã Thuê': report.occupiedApartments,
        'Số Cư Dân Hoạt Động': report.activeResidents,
        'Yêu Cầu Bảo Trì': report.maintenanceRequests,
        'Năm Xây Dựng': report.constructionYear,
        'Ngày Bảo Trì Cuối': format(report.lastMaintenanceDate, 'dd/MM/yyyy'),
        'Trạng Thái': report.status
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo Tòa Nhà');
    XLSX.writeFile(workbook, 'bao_cao_toa_nha.xlsx');
  };

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <BuildingIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Báo Cáo Tòa Nhà
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
                Trạng Thái Tòa Nhà
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={buildingStatusStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {buildingStatusStats.map((entry, index) => (
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
                  {buildingStatusStats.map((stat) => (
                    <Chip 
                      key={stat.status}
                      label={`${stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}: ${stat.count}`}
                      color={
                        stat.status === 'active' ? 'success' : 
                        stat.status === 'maintenance' ? 'warning' : 
                        'error'
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
                  <TableCell>Mã TN</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Địa Chỉ</TableCell>
                  <TableCell>Tổng Căn Hộ</TableCell>
                  <TableCell>Căn Hộ Đã Thuê</TableCell>
                  <TableCell>Năm Xây</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockBuildingReports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.address}</TableCell>
                    <TableCell>{report.totalApartments}</TableCell>
                    <TableCell>{report.occupiedApartments}</TableCell>
                    <TableCell>{report.constructionYear}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        color={
                          report.status === 'active' ? 'success' : 
                          report.status === 'maintenance' ? 'warning' : 
                          'error'
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

export default BuildingReports;
