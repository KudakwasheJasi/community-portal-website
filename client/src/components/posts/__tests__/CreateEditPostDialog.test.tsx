import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEditPostDialog from '../CreateEditPostDialog';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />
}));

describe('CreateEditPostDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    title: 'Create New Post'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create post dialog with correct title', () => {
    render(<CreateEditPostDialog {...defaultProps} />);

    expect(screen.getByText('Create New Post')).toBeInTheDocument();
    expect(screen.getByText('Create Post')).toBeInTheDocument();
  });

  it('renders edit post dialog with correct title and data', () => {
    const initialData = {
      id: '1',
      title: 'Test Post',
      description: 'Test Description',
      status: 'published' as const
    };

    render(
      <CreateEditPostDialog
        {...defaultProps}
        title="Edit Post"
        initialData={initialData}
      />
    );

    expect(screen.getByText('Edit Post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Update Post')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CreateEditPostDialog {...defaultProps} />);

    const submitButton = screen.getByText('Create Post');
    expect(submitButton).toBeDisabled();

    // Fill in title
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.type(titleInput, 'Test Title');

    // Button should still be disabled (description required)
    expect(submitButton).toBeDisabled();

    // Fill in description
    const descriptionInput = screen.getByLabelText(/description/i);
    await userEvent.type(descriptionInput, 'Test Description');

    // Button should now be enabled
    expect(submitButton).toBeEnabled();
  });

  it('submits form with correct data', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(<CreateEditPostDialog {...defaultProps} />);

    // Fill form
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await userEvent.type(titleInput, 'New Post Title');
    await userEvent.type(descriptionInput, 'New Post Description');

    // Submit form
    const submitButton = screen.getByText('Create Post');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        id: '',
        title: 'New Post Title',
        description: 'New Post Description',
        imageUrl: '',
        status: 'draft'
      });
    });
  });

  it('handles file upload', async () => {
    render(<CreateEditPostDialog {...defaultProps} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/choose image/i);

    await userEvent.upload(fileInput, file);

    expect(screen.getByText('Selected: test.png')).toBeInTheDocument();
  });

  it('calls onSubmit with file when file is selected', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(<CreateEditPostDialog {...defaultProps} />);

    // Fill form
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await userEvent.type(titleInput, 'Post with Image');
    await userEvent.type(descriptionInput, 'Description with image');

    // Upload file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/choose image/i);
    await userEvent.upload(fileInput, file);

    // Submit form
    const submitButton = screen.getByText('Create Post');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        id: '',
        title: 'Post with Image',
        description: 'Description with image',
        imageUrl: '',
        status: 'draft',
        file: file
      });
    });
  });

  it('resets form when dialog opens for new post', () => {
    const initialData = {
      id: '1',
      title: 'Existing Post',
      description: 'Existing Description'
    };

    const { rerender } = render(
      <CreateEditPostDialog
        {...defaultProps}
        initialData={initialData}
        open={false}
      />
    );

    // Re-open dialog without initial data
    rerender(
      <CreateEditPostDialog
        {...defaultProps}
        open={true}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });

  it('closes dialog when cancel button is clicked', () => {
    render(<CreateEditPostDialog {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes dialog when close icon is clicked', () => {
    render(<CreateEditPostDialog {...defaultProps} />);

    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});