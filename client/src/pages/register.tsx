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
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Head from 'next/head';
import { styled } from '@mui/system';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
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

const Register: React.FC = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^\+?[0-9\s-]+$/.test(formData.mobile)) newErrors.mobile = 'Please enter a valid mobile number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setError('');
      try {
        await register(formData.name, formData.email, formData.password, formData.mobile);
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          mobile: '',
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Register - Community Portal</title>
        <meta name="description" content="Register for the Community Portal" />
      </Head>
      <GradientBackground>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', width: '100%' }}>
            <div style={{ flex: 1, maxWidth: '500px', display: 'none' }}>
              <LeftPanel>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Join our community today!
                </Typography>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  Create Account
                </Typography>
                <Sphere />
              </LeftPanel>
            </div>
            <div style={{ flex: 1, maxWidth: '500px' }}>
              <RightPanel elevation={3}>
                <Typography variant="h4" component="h2" fontWeight="bold" color="primary" gutterBottom>
                  Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  Fill in your details to get started
                </Typography>
                
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Registration successful! You can now sign in.
                  </Alert>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                    autoComplete="new-password"
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
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="mobile"
                    label="Mobile Number"
                    type="tel"
                    id="mobile"
                    autoComplete="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={!!errors.mobile}
                    helperText={errors.mobile || 'Include country code (e.g., +1)'}
                    sx={{ mb: 3 }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
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
                      mb: 2,
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link href="/login" color="primary" underline="hover" sx={{ fontWeight: 500 }}>
                        Sign In
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </RightPanel>
            </div>
          </div>
        </Container>
      </GradientBackground>
    </>
  );
};

export default Register;
