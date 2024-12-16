import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

type FormikTextFieldProps = TextFieldProps & {
  name: string;
};

const TextField: React.FC<FormikTextFieldProps> = ({ name, ...props }) => {
  const [field, meta] = useField(name);

  return (
    <MuiTextField
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default TextField;
