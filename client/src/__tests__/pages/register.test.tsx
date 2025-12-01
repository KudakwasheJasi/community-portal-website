import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import Register from '../../pages/register'

const user = userEvent.setup()

// Mock next/router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock the AuthContext
const mockRegister = jest.fn()
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}))

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders register form with all required fields', () => {
    render(<Register />)

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<Register />)

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
      expect(screen.getByText('Please confirm your password')).toBeInTheDocument()
      expect(screen.getByText('Mobile number is required')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(<Register />)

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    render(<Register />)

    const passwordInput = screen.getByTestId('password-input')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(passwordInput, '123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('shows validation error for mismatched passwords', async () => {
    render(<Register />)

    const passwordInput = screen.getByLabelText(/^Password$/)
    const confirmPasswordInput = screen.getByLabelText(/^Confirm Password$/)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid mobile number', async () => {
    render(<Register />)

    const mobileInput = screen.getByLabelText(/mobile number/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(mobileInput, 'invalid-mobile')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid mobile number')).toBeInTheDocument()
    })
  })

  it('calls register function with correct data', async () => {
    mockRegister.mockResolvedValueOnce(undefined)

    render(<Register />)

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const mobileInput = screen.getByLabelText(/mobile number/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.type(mobileInput, '+1234567890')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123', '+1234567890')
    })
  })

  it('shows loading state during registration', async () => {
    mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<Register />)

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^Password$/)
    const confirmPasswordInput = screen.getByLabelText(/^Confirm Password$/)
    const mobileInput = screen.getByLabelText(/mobile number/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.type(mobileInput, '+1234567890')
    await user.click(submitButton)

    expect(screen.getByText('Creating Account...')).toBeInTheDocument()
  })

  it('shows success message on successful registration', async () => {
    mockRegister.mockResolvedValueOnce(undefined)

    render(<Register />)

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByTestId('password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const mobileInput = screen.getByLabelText(/mobile number/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.type(mobileInput, '+1234567890')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Registration successful! You can now sign in.')).toBeInTheDocument()
    })
  })

  it('shows error message on registration failure', async () => {
    const errorMessage = 'Email already exists'
    mockRegister.mockRejectedValueOnce(new Error(errorMessage))

    render(<Register />)

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByTestId('password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const mobileInput = screen.getByLabelText(/mobile number/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.type(mobileInput, '+1234567890')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    render(<Register />)

    const passwordInput = screen.getByLabelText(/^Password$/).querySelector('input')
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Click to show password
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('toggles confirm password visibility', () => {
    render(<Register />)

    const confirmPasswordInput = screen.getByLabelText(/^Confirm Password$/).querySelector('input')
    const toggleButton = screen.getByLabelText(/toggle confirm password visibility/i)

    // Initially password should be hidden
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    // Click to show password
    fireEvent.click(toggleButton)
    expect(confirmPasswordInput).toHaveAttribute('type', 'text')
  })

  it('has link to login page', () => {
    render(<Register />)

    const loginLink = screen.getByText(/log in/i)
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
  })
})