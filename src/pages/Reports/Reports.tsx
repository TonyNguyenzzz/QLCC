// src/pages/Reports/Reports.tsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  TableContainer,
  Paper,
  TablePagination,
  InputAdornment,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import reportsData from '../../data/reportsData';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Report {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(reportsData.reports);
  const [open, setOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [search, setSearch] = useState('');
  const [filterField, setFilterField] = useState('title');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpen = (report: Report | null = null) => {
    setCurrentReport(report);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentReport(null);
  };

  const handleDeleteClick = (report: Report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedReport) {
      setReports(reports.filter((r) => r.id !== selectedReport.id));
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: `Đã xóa báo cáo ID "${selectedReport.id}" thành công.`,
        severity: 'success',
      });
      setSelectedReport(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredReports = useMemo(
    () =>
      reports.filter((r) =>
        r[filterField as keyof Report].toString().toLowerCase().includes(search.toLowerCase())
      ),
    [reports, search, filterField]
  );

  const initialValues = {
    id: currentReport ? currentReport.id : reports.length + 1,
    title: currentReport ? currentReport.title : '',
    description: currentReport ? currentReport.description : '',
    createdAt: currentReport ? currentReport.createdAt : '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Bắt buộc'),
    description: Yup.string().required('Bắt buộc'),
    createdAt: Yup.date().required('Bắt buộc'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting }: any) => {
    if (currentReport && currentReport.id) {
      setReports(reports.map((r) => (r.id === values.id ? { ...r, ...values } : r)));
    } else {
      setReports([...reports, { ...values, id: reports.length + 1 }]);
    }
    setSubmitting(false);
    handleClose();
    setSnackbar({
      open: true,
      message: currentReport ? 'Cập nhật báo cáo thành công!' : 'Thêm báo cáo thành công!',
      severity: 'success',
    });
  };

  const monthlyRevenue = useMemo(() => reportsData.monthlyRevenue, []);
  const apartmentStatus = useMemo(() => reportsData.apartmentStatus, []);
  const repairsStatus = useMemo(() => reportsData.repairsStatus, []);

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4">Báo Cáo và Phân Tích</Typography>
        <Tooltip title="Thêm Báo Cáo">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            Thêm
          </Button>
        </Tooltip>
      </Box>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng Thanh Toán Theo Cư Dân
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="amount" fill="#8884d8" name="Doanh Thu" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tình Trạng Căn Hộ
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={apartmentStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                    label
                  >
                    {apartmentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trạng Thái Sửa Chữa
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={repairsStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#FF8042"
                    label
                  >
                    {repairsStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="filter-field">Lọc Theo</InputLabel>
          <Select
            label="Lọc Theo"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value as string)}
            sx={{ width: 120 }}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
            inputProps={{
              name: 'filter-field',
              id: 'filter-field',
            }}
          >
            <MenuItem value="title">Tiêu Đề</MenuItem>
            <MenuItem value="description">Mô Tả</MenuItem>
            <MenuItem value="createdAt">Ngày Tạo</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu Đề</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Ngày Tạo</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>
                    <Tooltip title="Chỉnh Sửa">
                      <IconButton color="secondary" onClick={() => handleOpen(report)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton aria-label="delete" color="error" onClick={() => handleDeleteClick(report)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredReports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentReport && currentReport.id ? 'Sửa Báo Cáo' : 'Thêm Báo Cáo'}</DialogTitle>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <TextField
                  margin="dense"
                  label="Tiêu Đề"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                <TextField
                  margin="dense"
                  label="Mô Tả"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  multiline
                  rows={3}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <TextField
                  margin="dense"
                  label="Ngày Tạo"
                  name="createdAt"
                  type="date"
                  value={values.createdAt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={touched.createdAt && Boolean(errors.createdAt)}
                  helperText={touched.createdAt && errors.createdAt}
                />
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Hủy
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Lưu
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={openDialog}
        title="Xác Nhận Xóa Báo Cáo"
        content={`Bạn có chắc chắn muốn xóa báo cáo ID "${selectedReport?.id}" không? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Reports;