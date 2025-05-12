// @mui
import Box, { BoxProps } from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

interface LoadingScreenProps extends BoxProps {
    message?: string;
}

export default function LoadingScreen({ sx, message, ...other }: LoadingScreenProps) {
    //console.log('LoadingScreenProps:', message);
    return (
        <Box
            sx={{
                px: 5,
                width: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                ...sx,
            }}
            {...other}
        >{message && (
            <Typography variant="body2" sx={{ mt: 2 }}>
                {message}
            </Typography>
        )}
            <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
            
        </Box>
    );
}