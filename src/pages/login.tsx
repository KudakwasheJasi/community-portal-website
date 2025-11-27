import React, { useState } from 'react';
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
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Head from 'next/head';
import { styled } from '@mui/system';
import { useAuth } from '@/hooks/useAuth';

interface FormData {
  email: string;
  password: string;
}

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  backgroundImage: 'linear-gradient(rgba(245, 247, 250, 0.9), rgba(195, 207, 226, 0.9)), url("/images/login-bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
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

const LeftPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  color: '#3f51b5',
  textAlign: 'center',
  '@media (max-width: 900px)': {
    display: 'none',
  },
});

const RightPanel = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  padding: '3rem 2.5rem',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  width: '100%',
  margin: '0 auto',
  '@media (max-width: 600px)': {
    padding: '2rem 1.5rem',
  },
});

const Sphere = styled(Box)({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  marginBottom: '2rem',
  '@media (max-width: 900px)': {
    width: '150px',
    height: '150px',
  },
});

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      // This is a mock login. In a real app, you would make an API call
      // and upon success, call the login function with user data from the API.
      console.log('Login data:', formData);
      login({
        id: 'user123',
        name: 'Kudakwashe', // You can derive this from the email or get it from the API
        email: formData.email,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login - Community Portal</title>
        <meta name="description" content="Login to the Community Portal" />
      </Head>
      <GradientBackground>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid container spacing={20} justifyContent="center" alignItems="center">
            <Grid item md ={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <LeftPanel>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Welcome back to our platform!
                </Typography>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  Community Portal
                </Typography>
                <Sphere />
              </LeftPanel>
            </Grid>
            <Grid item xs={12} md={6}>
              <RightPanel elevation={3}>
                <Typography variant="h4" component="h2" fontWeight="bold" color="primary" gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  Sign in to continue
                </Typography>
                
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
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 3 }}>
                    <Link href="/register" variant="body2" color="primary" underline="hover">
                      Don't have an account? Create Account
                    </Link>
                    <Link href="/forgot-password" variant="body2" color="primary" underline="hover">
                      Forgot Password?
                    </Link>
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </RightPanel>
            </Grid>
          </Grid>
        </Container>
      </GradientBackground>
    </>
  );
};

export default Login;
