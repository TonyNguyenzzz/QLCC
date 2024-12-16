import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert, 
  IconButton, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';  
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserRole } from '../../components/ProtectedRoute/ProtectedRoute';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.Resident);

  // Sử dụng type assertion an toàn
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const initialValues = { email: '', password: '' };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Bắt buộc')
      .trim(),
    password: Yup.string()
      .min(6, 'Ít nhất 6 ký tự')
      .required('Bắt buộc')
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setStatus }: any) => {
    try {
      setSubmitting(true);
      const success = await login(
        values.email.trim(), 
        values.password, 
        role
      );
      
      if (success) {
        // Điều hướng đến trang trước đó hoặc trang chính
        navigate(from, { replace: true });
      } else {
        setStatus({ error: 'Email hoặc mật khẩu không chính xác' });
      }
    } catch (error) {
      setStatus({ error: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Đăng Nhập
        </Typography>
        
        <Formik 
          initialValues={initialValues} 
          validationSchema={validationSchema} 
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
            <Form style={{ width: '100%' }}>
              {status && status.error && (
                <Alert 
                  severity="error" 
                  sx={{ width: '100%', mb: 1 }}
                >
                  {status.error}
                </Alert>
              )}
              
              <TextField
                margin="dense"
                required
                fullWidth
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              
              <TextField
                margin="dense"
                required
                fullWidth
                name="password"
                label="Mật Khẩu"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <FormControl fullWidth margin="dense">
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={role}
                  label="Vai trò"
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <MenuItem value={UserRole.Resident}>Cư Dân</MenuItem>
                  <MenuItem value={UserRole.Manager}>Quản Lý</MenuItem>
                </Select>
              </FormControl>

              {/* Quên mật khẩu */}
              <Box sx={{ width: '100%', textAlign: 'right', mt: 0.5, mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  to="/forgot-password" 
                  color="primary"
                  underline="hover"
                >
                  Quên mật khẩu?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;