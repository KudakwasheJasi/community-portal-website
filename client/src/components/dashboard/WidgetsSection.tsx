import React from 'react';
import { Box, Typography, Stack, Chip, Grid, Card, CardActionArea, Paper } from '@mui/material';
import { Edit, BarChart, ThumbUp, AddCircleOutline } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

const WidgetsSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} px={0.5}>
        <Typography variant="h6">Your Widgets</Typography>
        <Chip
          icon={<Edit sx={{ fontSize: '14px !important' }} />}
          label="Customize"
          size="small"
          color="primary"
          variant="filled"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            fontWeight: 600,
            '& .MuiChip-icon': { color: 'inherit' }
          }}
          onClick={() => {}}
        />
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 2,
        }}
      >
        <Card sx={{ height: '100%', aspectRatio: '1' }}>
          <CardActionArea sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}>
            <BarChart sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={600} align="center">User Growth</Typography>
            <Typography variant="caption" color="text.secondary" align="center">Weekly report</Typography>
          </CardActionArea>
        </Card>
        <Card sx={{ height: '100%', aspectRatio: '1' }}>
          <CardActionArea sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}>
            <ThumbUp sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={600} align="center">Top Posts</Typography>
            <Typography variant="caption" color="text.secondary" align="center">Most liked</Typography>
          </CardActionArea>
        </Card>
        <Paper
          variant="outlined"
          sx={{
            height: '100%',
            aspectRatio: '1',
            borderStyle: 'dashed',
            borderWidth: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.04)
            },
          }}
        >
          <AddCircleOutline sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="subtitle2" fontWeight={600}>Add Widget</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default WidgetsSection;