import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  Alert,
  Slide,
  useTheme,
} from '@mui/material';
import Head from 'next/head';
import { styled } from '@mui/system';
import NextLink from 'next/link';
import Link from '@mui/material/Link';
import { toast } from 'sonner';
import authService from '@/services/auth.service';

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

const ForgotPasswordForm = styled(Paper)(({ theme }) => ({
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
    borderRadius: '16px',
    maxWidth: '100%',
    margin: '1rem',
  },
}));

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const validate = (): boolean => {
    const newErrors: { email?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setErrors({});

      try {
        await authService.forgotPassword(email);

        setSuccess(true);
        toast.success('Password reset link sent to your email!');
      } catch (err: unknown) {
        toast.error('Failed to send reset link. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Community Portal</title>
        <meta name="description" content="Reset your password" />
      </Head>
      <GradientBackground>
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
          <Slide direction="up" in={mounted} mountOnEnter unmountOnExit>
            <ForgotPasswordForm elevation={3}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom align="center">
                  Forgot Password
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
              </Box>

              {success ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Check your email!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    We've sent a password reset link to {email}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                    sx={{ mr: 2 }}
                  >
                    Try Another Email
                  </Button>
                  <Button
                    component={NextLink}
                    href="/login"
                    variant="contained"
                  >
                    Back to Login
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ mb: 2, py: 1.5, borderRadius: '6px' }}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Remember your password?{' '}
                      <Link component={NextLink} href="/login" color="primary">
                        Sign In
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              )}
            </ForgotPasswordForm>
          </Slide>
        </Container>
      </GradientBackground>
    </>
  );
};

export default ForgotPassword;