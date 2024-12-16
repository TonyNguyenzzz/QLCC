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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import repairsData from '../../data/repairsData';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Định nghĩa kiểu Repair
interface Repair {
  id: number;
  apartment: string;
  description: string;
  status: string;
}

const statusOptions = [
  { value: 'Đang tiến hành', label: 'Đang tiến hành' },
  { value: 'Hoàn thành', label: 'Hoàn thành' },
  { value: 'Chưa bắt đầu', label: 'Chưa bắt đầu' },
];

const Repairs: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>(repairsData);
  const [open, setOpen] = useState(false);
  const [currentRepair, setCurrentRepair] = useState<Repair>({ id: 0, apartment: '', description: '', status: '' });
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpen = (repair = { id: 0, apartment: '', description: '', status: '' }) => {
    setCurrentRepair(repair);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setRepairs(repairs.filter((r) => r.id !== id));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRepairs = useMemo(
    () =>
      repairs.filter(
        (r) =>
          r.apartment.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.status.toLowerCase().includes(search.toLowerCase())
      ),
    [repairs, search]
  );

  const initialValues = {
    id: currentRepair.id || 0, // Đảm bảo id là 0 thay vì null
    apartment: currentRepair.apartment || '',
    description: currentRepair.description || '',
    status: currentRepair.status || '',
  };

  const validationSchema = Yup.object({
    apartment: Yup.string().required('Bắt buộc'),
    description: Yup.string().required('Bắt buộc'),
    status: Yup.string().required('Bắt buộc'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting }: any) => {
    if (values.id !== 0) {
      setRepairs(repairs.map((r) => (r.id === values.id ? values : r)));
    } else {
      setRepairs([...repairs, { ...values, id: repairs.length + 1 }]);
    }
    setSubmitting(false);
    handleClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Quản Lý Sửa Chữa Căn Hộ
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Thêm Sửa Chữa
      </Button>
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton disabled>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Căn Hộ</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRepairs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell>{repair.id}</TableCell>
                  <TableCell>{repair.apartment}</TableCell>
                  <TableCell>{repair.description}</TableCell>
                  <TableCell>{repair.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpen(repair)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(repair.id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {filteredRepairs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRepairs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentRepair.id ? 'Sửa Sửa Chữa' : 'Thêm Sửa Chữa'}</DialogTitle>
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
                  label="Căn Hộ"
                  name="apartment"
                  value={values.apartment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.apartment && Boolean(errors.apartment)}
                  helperText={touched.apartment && errors.apartment ? errors.apartment : ''}
                />
                <TextField
                  margin="dense"
                  label="Mô Tả"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description ? errors.description : ''}
                />
                <TextField
                  margin="dense"
                  label="Trạng Thái"
                  name="status"
                  select
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status ? errors.status : ''}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy</Button>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Lưu
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default React.memo(Repairs);
