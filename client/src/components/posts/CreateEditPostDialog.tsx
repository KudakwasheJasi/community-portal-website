import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Stack,
  Box,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { uploadFile, validateImage } from '@/utils/fileUpload';
// PostFormData is defined locally in the posts page
interface PostFormData {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  status?: 'published' | 'draft' | 'archived';
}

interface CreateEditPostDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => Promise<void>;
  initialData?: PostFormData;
  title: string;
}

const CreateEditPostDialog: React.FC<CreateEditPostDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title
}) => {
  const [formData, setFormData] = React.useState<PostFormData>({
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    status: 'draft',
    ...initialData
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
      setImagePreview(initialData.imageUrl || null);
    } else {
      // Reset form when creating a new post
      setFormData({
        id: '',
        title: '',
        description: '',
        imageUrl: '',
        status: 'draft'
      });
      setSelectedFile(null);
      setImagePreview(null);
      setImageProcessing(false);
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the image
    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.message || 'Invalid image file');
      return;
    }

    setSelectedFile(file);
    setImageProcessing(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);

      // Upload the file
      const imageUrl = await uploadFile(file);

      setFormData(prev => ({
        ...prev,
        imageUrl
      }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{ style: { backdropFilter: 'blur(8px)' } }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {title}
            <IconButton edge="end" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={3}>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  name="title"
                  label="Title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid size={{xs:12}}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Image (optional)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Choose Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {selectedFile && (
                    <Typography variant="body2" color="text.secondary">
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={200}
                        height={120}
                        style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formData.title || !formData.description || imageProcessing}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating...' : imageProcessing ? 'Processing Image...' : (initialData ? 'Update' : 'Create') + ' Post'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateEditPostDialog;
