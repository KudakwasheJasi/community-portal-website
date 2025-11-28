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

interface PostFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
  initialData?: PostFormData;
  title: string;
}

const PostFormDialog: React.FC<PostFormDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData, 
  title 
}) => {
  const [formData, setFormData] = React.useState<PostFormData>(
    initialData || { title: '', description: '', imageUrl: '' }
  );

  React.useEffect(() => {
    if (open) {
      setFormData(initialData || { title: '', description: '', imageUrl: '' });
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          mx: 3,
          mt: 2,
          px: 0
        }}>
          <Box sx={{ typography: 'h6', fontWeight: 600 }}>{title}</Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stack spacing={3}>
            <TextField
              autoFocus
              name="title"
              label="Post Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <TextField
              name="imageUrl"
              label="Image URL (Optional)"
              fullWidth
              variant="outlined"
              value={formData.imageUrl}
              onChange={handleChange}
              helperText="Leave empty to use a default image"
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          mx: 0
        }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: 2, px: 3 }}
          >
            {initialData?.id ? 'Update' : 'Create'} Post
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostFormDialog;
