import React, { useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  Assessment as ReportIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { 
  mockViolationStatistics, 
  getViolationStatisticsByType, 
  getViolationStatisticsByStatus 
} from '../../data/Violations/violationStatistics';
import { ResidencyHistory } from '../../types/residency';

const ViolationReports: React.FC = () => {
  // Thống kê vi phạm theo loại
  const violationTypeStats = useMemo(() => getViolationStatisticsByType(), []);
  
  // Thống kê vi phạm theo trạng thái
  const violationStatusStats = useMemo(() => getViolationStatisticsByStatus(), []);
  
  // Dữ liệu biểu đồ vi phạm theo loại
  const violationTypeChartData = useMemo(() => 
    Object.entries(violationTypeStats).map(([type, count]) => ({ type, count })),
    [violationTypeStats]
  );

  // Xuất PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Báo Cáo Vi Phạm', 14, 15);
    
    const tableColumn = ['Mã Cư Dân', 'Tên', 'Loại Vi Phạm', 'Ngày', 'Trạng Thái'];
    const tableRows = mockViolationStatistics
      .filter(history => history.violations && history.violations.length > 0)
      .flatMap((history: ResidencyHistory) => 
        history.violations!.map(violation => [
          history.residentId,
          history.resident.name,
          violation.type,
          format(violation.date, 'dd/MM/yyyy HH:mm'),
          violation.status
        ])
      );

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save('bao_cao_vi_pham.pdf');
  };

  // Xuất Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      mockViolationStatistics
        .filter(history => history.violations && history.violations.length > 0)
        .flatMap((history: ResidencyHistory) => 
          history.violations!.map(violation => ({
            'Mã Cư Dân': history.residentId,
            'Tên Cư Dân': history.resident.name,
            'Loại Vi Phạm': violation.type,
            'Mô Tả': violation.description,
            'Ngày': format(violation.date, 'dd/MM/yyyy HH:mm'),
            'Trạng Thái': violation.status,
            'Giải Quyết': violation.resolution || 'Chưa giải quyết'
          }))
        )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo Vi Phạm');
    XLSX.writeFile(workbook, 'bao_cao_vi_pham.xlsx');
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <ReportIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Báo Cáo Vi Phạm
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
                Vi Phạm Theo Loại
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={violationTypeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Số Lượng Vi Phạm" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trạng Thái Vi Phạm
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Box>
                  {Object.entries(violationStatusStats).map(([status, count]) => (
                    <Chip 
                      key={status}
                      label={`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`}
                      color={status === 'resolved' ? 'success' : 'warning'}
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
                  <TableCell>Mã Cư Dân</TableCell>
                  <TableCell>Tên Cư Dân</TableCell>
                  <TableCell>Loại Vi Phạm</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockViolationStatistics
                  .filter(history => history.violations && history.violations.length > 0)
                  .flatMap((history: ResidencyHistory) => 
                    history.violations!.map((violation, index) => (
                      <TableRow key={`${history.residentId}-${index}`}>
                        <TableCell>{history.residentId}</TableCell>
                        <TableCell>{history.resident.name}</TableCell>
                        <TableCell>{violation.type}</TableCell>
                        <TableCell>{format(violation.date, 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell>
                          <Chip 
                            label={violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
                            color={violation.status === 'resolved' ? 'success' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViolationReports;
