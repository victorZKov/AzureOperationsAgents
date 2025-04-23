// src/components/shared/LoadingScreen.tsx
import { CircularProgress, Box } from '@mui/material';

export const LoadingScreen = () => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw"
    >
        <CircularProgress />
    </Box>
);