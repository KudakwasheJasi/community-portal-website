// client/src/components/events/EventForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  GridProps,
  CircularProgress,
  Typography,
  Alert,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import eventsService from '@/services/events.service';
import { uploadFile, validateImage } from '@/utils/fileUpload';
import { JSX } from 'react/jsx-runtime';

type EventData = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  maxAttendees: number;
  organizerId: string;
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
  registrations?: {
    id: string;
    userId: string;
    registeredAt: string;
  }[];
  status?: 'open' | 'registered' | 'closed';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  maxAttendees: string;
  imageUrl: string;
  imageFile?: File;
}

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    maxAttendees?: number;
    imageUrl?: string;
  }) => Promise<void>;
  isEdit?: boolean;
  initialData?: Partial<EventData>;
}

const EventForm: React.FC<EventFormProps> = ({ open, onClose, onSubmit, isEdit = false, initialData }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    startDate: null,
    endDate: null,
    maxAttendees: '',
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize form data when editing
  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          location: initialData.location || '',
          startDate: initialData.startDate ? new Date(initialData.startDate) : null,
          endDate: initialData.endDate ? new Date(initialData.endDate) : null,
          maxAttendees: initialData.maxAttendees?.toString() || '',
          imageUrl: initialData.imageUrl || '',
        });
        setPreviewUrl(initialData.imageUrl || null);
      } else {
        // Reset form for new event
        setFormData({
          title: '',
          description: '',
          location: '',
          startDate: null,
          endDate: null,
          maxAttendees: '',
          imageUrl: '',
        });
        setPreviewUrl(null);
      }
      setUploadError(null);
    }
  }, [open, isEdit, initialData]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  const handleInputChange = (field: keyof EventFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | null) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the image
    const validation = validateImage(file);
    if (!validation.valid) {
      setUploadError(validation.message || 'Invalid image file');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Upload the file and get the URL
      const imageUrl = await uploadFile(file);

      setFormData(prev => ({
        ...prev,
        imageUrl,
        imageFile: file,
      }));
      setPreviewUrl(imageUrl);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.maxAttendees && parseInt(formData.maxAttendees) <= 0) {
      newErrors.maxAttendees = 'Max attendees must be greater than 0';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        startDate: formData.startDate!.toISOString(),
        endDate: formData.endDate!.toISOString(),
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      await onSubmit(eventData);
      handleClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: null,
      endDate: null,
      maxAttendees: '',
      imageUrl: '',
    });
    setFormErrors({});
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        scroll="body"
        BackdropProps={{ style: { backdropFilter: 'blur(8px)' } }}
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>{isEdit ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogActions sx={{ px: 3, pt: 1, pb: 0, justifyContent: 'flex-start' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Event' : 'Create Event')}
            </Button>
            <Button onClick={handleClose} disabled={loading} sx={{ ml: 1 }}>
              Cancel
            </Button>
          </DialogActions>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid size={{xs:12, md:4, }}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                    required
                  />
                </Grid>

                <Grid size={{xs :12, md:4}}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    multiline
                    rows={3}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                  />
                </Grid>

                <Grid size={{xs:12, md:4}}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={handleInputChange('location')}
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                  />
                </Grid>

                <Grid size={{ xs:12, sm:6, md:3,}}>
                  <TextField
                    fullWidth
                    label="Max Attendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={handleInputChange('maxAttendees')}
                    error={!!formErrors.maxAttendees}
                    helperText={formErrors.maxAttendees}
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid size={{xs:12, sm:6, md:4}}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={formData.startDate}
                    onChange={handleDateChange('startDate')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.startDate,
                        helperText: formErrors.startDate,
                        required: true,
                      },
                      popper: {
                        sx: {
                          '& .MuiPaper-root': {
                            maxWidth: '280px',
                            maxHeight: '350px',
                            overflow: 'auto',
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid size= {{xs:12, sm:6, md:5}}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={formData.endDate}
                    onChange={handleDateChange('endDate')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.endDate,
                        helperText: formErrors.endDate,
                      },
                      popper: {
                        sx: {
                          '& .MuiPaper-root': {
                            maxWidth: '280px',
                            maxHeight: '350px',
                            overflow: 'auto',
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{xs:12, md:6}}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Event Image
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        p: 1.5,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'grey.50',
                        },
                      }}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <CloudUploadIcon sx={{ fontSize: 24, color: 'grey.400', mb: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        JPG, PNG, GIF up to 5MB
                      </Typography>
                    </Box>

                    {/* Upload Status */}
                    {uploading && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="caption">Uploading...</Typography>
                      </Box>
                    )}

                    {/* Upload Error */}
                    {uploadError && (
                      <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
                        <Typography variant="caption">{uploadError}</Typography>
                      </Alert>
                    )}

                    {/* Image Preview */}
                    {previewUrl && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
                          Preview:
                        </Typography>
                        <Box
                          component="img"
                          src={previewUrl}
                          alt="Event preview"
                          sx={{
                            width: 80,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    )}

                    {/* Alternative: URL Input */}
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
                        Or URL:
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={handleInputChange('imageUrl')}
                        error={!!formErrors.imageUrl}
                        helperText={formErrors.imageUrl}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size = {{xs:12, md:6}}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    >
                      Clear Image
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setFormData({
                          title: '',
                          description: '',
                          location: '',
                          startDate: null,
                          endDate: null,
                          maxAttendees: '',
                          imageUrl: '',
                        });
                        setPreviewUrl(null);
                        setUploadError(null);
                      }}
                    >
                      Reset Form
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EventForm;