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
  Typography
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
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
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
        setFormData(prev => ({
          ...prev,
          imageUrl: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
          <Stack spacing={3} sx={{ pt: 1 }}>
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
                    width={400}
                    height={200}
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formData.title || !formData.description}
          >
            {initialData ? 'Update' : 'Create'} Post
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateEditPostDialog;
