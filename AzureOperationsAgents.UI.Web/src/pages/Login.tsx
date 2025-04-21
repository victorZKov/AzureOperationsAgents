// src/pages/Login.tsx
import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { CircularProgress, Typography, Box } from '@mui/material';

export default function Login() {
    const { instance, inProgress } = useMsal();

    useEffect(() => {
        if (inProgress === InteractionStatus.None) {
            instance.loginRedirect();
        }
    }, [inProgress, instance]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <CircularProgress />
            <Typography mt={2}>Redirecting to sign in...</Typography>
        </Box>
    );
}