import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import * as Yup from 'yup';
import { Building, BuildingStatus } from '../../../types/building';

interface BuildingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Building, 'id'>) => void;
  initialValues?: Building;
}

const buildingSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên tòa nhà là bắt buộc')
    .min(2, 'Tên tòa nhà phải có ít nhất 2 ký tự')
    .max(50, 'Tên tòa nhà không được vượt quá 50 ký tự'),
  address: Yup.string()
    .required('Địa chỉ là bắt buộc')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(200, 'Địa chỉ không được vượt quá 200 ký tự'),
  totalFloors: Yup.number()
    .required('Tổng số tầng là bắt buộc')
    .min(1, 'Tổng số tầng phải lớn hơn 0')
    .max(200, 'Tổng số tầng không được vượt quá 200'),
  totalUnits: Yup.number()
    .required('Tổng số đơn vị là bắt buộc')
    .min(1, 'Tổng số đơn vị phải lớn hơn 0')
    .max(100000, 'Tổng số đơn vị không được vượt quá 100,000'),
});

const BuildingForm: React.FC<BuildingFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const defaultValues: Omit<Building, 'id'> = {
    name: '',
    address: '',
    totalFloors: 1,
    totalUnits: 0,
    occupiedUnits: 0,
    maintenanceRequests: 0,
    amenities: [] as string[],
    status: BuildingStatus.Active,
    description: '',
    yearBuilt: '',
    parkingSpaces: 0,
    monthlyRevenue: 0,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValues ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà mới'}
      </DialogTitle>
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={buildingSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
          onClose();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Field
                  name="name"
                  as={TextField}
                  label="Tên tòa nhà"
                  fullWidth
                  margin="normal"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  name="address"
                  as={TextField}
                  label="Địa chỉ"
                  fullWidth
                  margin="normal"
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
                <Field
                  name="totalFloors"
                  as={TextField}
                  label="Tổng số tầng"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={touched.totalFloors && Boolean(errors.totalFloors)}
                  helperText={touched.totalFloors && errors.totalFloors}
                  InputProps={{ inputProps: { min: 1, max: 200 } }}
                />
                <Field
                  name="totalUnits"
                  as={TextField}
                  label="Tổng số đơn vị"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={touched.totalUnits && Boolean(errors.totalUnits)}
                  helperText={touched.totalUnits && errors.totalUnits}
                  InputProps={{ inputProps: { min: 1, max: 100000 } }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Hủy</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {initialValues ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default React.memo(BuildingForm);
