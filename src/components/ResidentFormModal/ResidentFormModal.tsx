// src/components/ResidentFormModal/ResidentFormModal.tsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

interface ResidentFormModalProps {
  open: boolean;
  handleClose: () => void;
  initialValues: {
    name: string;
    email: string;
    apartment: string;
  };
  onSubmit: (values: { name: string; email: string; apartment: string }) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ResidentFormModal: React.FC<ResidentFormModalProps> = ({
  open,
  handleClose,
  initialValues,
  onSubmit,
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
    apartment: Yup.string().required('Bắt buộc'),
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="resident-form-title"
    >
      <Box sx={style}>
        <Typography id="resident-form-title" variant="h6" component="h2" gutterBottom>
          {initialValues.name ? 'Chỉnh Sửa Cư Dân' : 'Thêm Cư Dân'}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
            handleClose();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <TextField
                fullWidth
                margin="normal"
                label="Tên"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Căn Hộ"
                name="apartment"
                value={values.apartment}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.apartment && Boolean(errors.apartment)}
                helperText={touched.apartment && errors.apartment}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleClose} sx={{ mr: 1 }}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {initialValues.name ? 'Cập Nhật' : 'Thêm'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ResidentFormModal;
