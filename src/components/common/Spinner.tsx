import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface Props {
  message?: string;
}

const Spinner = ({ message }: Props) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 3 }}>
      <CircularProgress size={28} thickness={4} color="primary" />
      {message && (
        <Typography variant="caption" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Spinner;
