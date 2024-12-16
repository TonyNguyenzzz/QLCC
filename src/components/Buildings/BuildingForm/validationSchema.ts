import * as Yup from 'yup';

export const buildingSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên tòa nhà là bắt buộc')
    .min(3, 'Tên tòa nhà phải có ít nhất 3 ký tự')
    .max(100, 'Tên tòa nhà không được vượt quá 100 ký tự'),
  address: Yup.string()
    .required('Địa chỉ là bắt buộc')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(200, 'Địa chỉ không được vượt quá 200 ký tự'),
  floors: Yup.number()
    .required('Số tầng là bắt buộc')
    .min(1, 'Số tầng phải lớn hơn 0')
    .max(200, 'Số tầng không được vượt quá 200')
    .integer('Số tầng phải là số nguyên'),
});
