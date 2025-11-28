import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Chip,
  Stack,
  useTheme,
  Skeleton,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Post, PostStatus } from '@/types/post';

interface PostFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onRefresh: () => void;
  statusFilter: PostStatus[];
  onStatusFilterChange: (statuses: PostStatus[]) => void;
  tagFilter: string[];
  onTagFilterChange: (tags: string[]) => void;
  availableTags: string[];
  loading?: boolean;
}

const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' }
] as const;

const PostFilters: React.FC<PostFiltersProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  statusFilter = [],
  onStatusFilterChange,
  tagFilter = [],
  onTagFilterChange,
  availableTags = [],
  loading = false
}) => {
  const theme = useTheme();
  const [tagMenuAnchor, setTagMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleTagMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTagMenuAnchor(event.currentTarget);
  };

  const handleTagMenuClose = () => {
    setTagMenuAnchor(null);
  };

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setStatusMenuAnchor(event.currentTarget);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = tagFilter.includes(tag)
      ? tagFilter.filter((t) => t !== tag)
      : [...tagFilter, tag];
    onTagFilterChange(newTags);
  };

  const handleStatusToggle = (status: PostStatus) => {
    const newStatuses = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];
    onStatusFilterChange(newStatuses);
  };

  const handleRemoveTag = (tag: string) => {
    onTagFilterChange(tagFilter.filter((t) => t !== tag));
  };

  const handleRemoveStatus = (status: PostStatus) => {
    onStatusFilterChange(statusFilter.filter((s) => s !== status));
  };

  const handleClearAll = () => {
    onTagFilterChange([]);
    onStatusFilterChange([]);
    onSearchChange('');
  };

  if (loading) {
    return (
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton variant="rectangular" width={300} height={40} />
        <Box display="flex" gap={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Box>
    );
  }

  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          placeholder="Search posts..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newViewMode) => {
              if (newViewMode !== null) {
                onViewModeChange(newViewMode);
              }
            }}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Filter by status">
            <IconButton
              onClick={handleStatusMenuOpen}
              color={statusFilter.length > 0 ? 'primary' : 'default'}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {(statusFilter.length > 0 || tagFilter.length > 0) && (
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="caption" color="text.secondary">
              Active filters:
            </Typography>
            <Typography 
              variant="caption" 
              color="primary" 
              onClick={handleClearAll}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Clear all
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {statusFilter.map((status) => (
              <Chip
                key={status}
                label={status}
                onDelete={() => handleRemoveStatus(status)}
                size="small"
                color={
                  status === 'published' ? 'success' :
                  status === 'draft' ? 'warning' : 'default'
                }
                deleteIcon={<CloseIcon />}
              />
            ))}
            {tagFilter.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                size="small"
                variant="outlined"
                deleteIcon={<CloseIcon />}
              />
            ))}
          </Box>
        </Box>
      )}

      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleStatusMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={2} width={200}>
          <Typography variant="subtitle2" gutterBottom>
            Filter by status
          </Typography>
          <Stack spacing={1}>
            {statusOptions.map((option) => (
              <Box key={option.value} display="flex" alignItems="center">
                <input
                  type="checkbox"
                  id={`status-${option.value}`}
                  checked={statusFilter.includes(option.value as PostStatus)}
                  onChange={() => handleStatusToggle(option.value as PostStatus)}
                  style={{
                    marginRight: theme.spacing(1),
                  }}
                />
                <label htmlFor={`status-${option.value}`}>
                  {option.label}
                </label>
              </Box>
            ))}
          </Stack>
          
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by tags
            </Typography>
            <Stack spacing={1} maxHeight={200} overflow="auto">
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <Box key={tag} display="flex" alignItems="center">
                    <input
                      type="checkbox"
                      id={`tag-${tag}`}
                      checked={tagFilter.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      style={{
                        marginRight: theme.spacing(1),
                      }}
                    />
                    <label htmlFor={`tag-${tag}`}>
                      {tag}
                    </label>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tags available
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default PostFilters;
