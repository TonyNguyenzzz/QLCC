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
import apartmentsData from '../../data/apartmentsData';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const statusOptions = [
  { value: 'Đang Sử Dụng', label: 'Đang Sử Dụng' },
  { value: 'Trống', label: 'Trống' },
  { value: 'Đang Sửa Chữa', label: 'Đang Sửa Chữa' },
];

interface Apartment {
  id: number;
  number: string;
  status: string;
  history: string;
}

const Apartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>(apartmentsData);
  const [open, setOpen] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpen = (apartment: Apartment | null = null) => {
    setCurrentApartment(apartment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setApartments(apartments.filter((a) => a.id !== id));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredApartments = useMemo(
    () =>
      apartments.filter(
        (a) =>
          a.number.toLowerCase().includes(search.toLowerCase()) ||
          a.status.toLowerCase().includes(search.toLowerCase()) ||
          a.history.toLowerCase().includes(search.toLowerCase())
      ),
    [apartments, search]
  );

  const initialValues = {
    id: currentApartment ? currentApartment.id : apartments.length + 1,
    number: currentApartment ? currentApartment.number : '',
    status: currentApartment ? currentApartment.status : '',
    history: currentApartment ? currentApartment.history : '',
  };

  const validationSchema = Yup.object({
    number: Yup.string().required('Bắt buộc'),
    status: Yup.string().required('Bắt buộc'),
    history: Yup.string().required('Bắt buộc'),
  });

  const handleSubmit = (values: typeof initialValues, { setSubmitting }: any) => {
    if (values.id) {
      setApartments(apartments.map((a) => (a.id === values.id ? { ...a, ...values } : a)));
    } else {
      setApartments([...apartments, { ...values, id: apartments.length + 1 }]);
    }
    setSubmitting(false);
    handleClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Thông Tin Căn Hộ
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Thêm Căn Hộ
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
              <TableCell>Số Căn Hộ</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Lịch Sử Cư Trú</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApartments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell>{apartment.id}</TableCell>
                  <TableCell>{apartment.number}</TableCell>
                  <TableCell>{apartment.status}</TableCell>
                  <TableCell>{apartment.history}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpen(apartment)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(apartment.id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {filteredApartments.length === 0 && (
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
          count={filteredApartments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentApartment ? 'Sửa Căn Hộ' : 'Thêm Căn Hộ'}</DialogTitle>
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
                  label="Số Căn Hộ"
                  name="number"
                  value={values.number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.number && Boolean(errors.number)}
                  helperText={touched.number && errors.number}
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
                  helperText={touched.status && errors.status}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  margin="dense"
                  label="Lịch Sử Cư Trú"
                  name="history"
                  value={values.history}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.history && Boolean(errors.history)}
                  helperText={touched.history && errors.history}
                />
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

export default React.memo(Apartments);
