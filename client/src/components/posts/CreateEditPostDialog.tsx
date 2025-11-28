import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Stack,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PostFormData } from '@/types/post';

interface CreateEditPostDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
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

  React.useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    } else {
      // Reset form when creating a new post
      setFormData({
        id: '',
        title: '',
        description: '',
        imageUrl: '',
        status: 'draft'
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
            <TextField
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="https://example.com/image.jpg"
            />
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
