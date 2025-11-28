import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Container,
  Alert,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Head from 'next/head';
import { styled } from '@mui/system';
import NextLink from 'next/link';

interface FormData {
  email: string;
  password: string;
}

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(195, 207, 226, 0.9) 100%)',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
});

const LoginForm = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '3rem 2.5rem',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  width: '100%',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: '2rem 1.5rem',
    borderRadius: '16px 16px 0 0',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '100%',
    animation: 'slideUp 0.5s ease-out',
  },
  '@keyframes slideUp': {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
}));

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loginError, setLoginError] = useState('');
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) setLoginError('');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Login attempt with:', formData);
      // setLoginError('Invalid email or password'); // Uncomment to simulate error
    }
  };

  const formContent = (
    <>
      <Typography variant="h4" component="h2" fontWeight="bold" color="primary" gutterBottom>
        Welcome Back!
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Log in to manage your community.
      </Typography>
      
      {loginError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loginError}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
          <Link component={NextLink} href="/forgot-password" variant="body2" color="primary">
            Forgot password?
          </Link>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: '8px' }}
        >
          Log In
        </Button>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={NextLink} href="/register" color="primary">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <Head>
        <title>Login - Community Portal</title>
        <meta name="description" content="Login to your Community Portal account" />
      </Head>
      <GradientBackground>
        <Container 
          maxWidth="sm" 
          sx={{ 
            position: 'relative',
            height: isMobile ? 'auto' : '100vh',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isMobile ? (
            <LoginForm elevation={3} sx={{ 
              animation: mounted ? 'slideUp 0.5s ease-out' : 'none',
              '@keyframes slideUp': {
                from: { transform: 'translateY(100%)' },
                to: { transform: 'translateY(0)' },
              }
            }}>
              {formContent}
            </LoginForm>
          ) : (
            <Slide direction="left" in={mounted} mountOnEnter unmountOnExit>
              <LoginForm elevation={3}>
                {formContent}
              </LoginForm>
            </Slide>
          )}
        </Container>
      </GradientBackground>
    </>
  );
};

export default Login;