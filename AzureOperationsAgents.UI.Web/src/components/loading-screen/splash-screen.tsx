import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Logo from '../logo'; // Assuming Logo is a component in your project

// ----------------------------------------------------------------------

interface SplashScreenProps extends BoxProps {
    message?: string;
}

export default function SplashScreen({ sx, message, ...other }: SplashScreenProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Box
            sx={{
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                position: 'fixed',
                bgcolor: 'background.default',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
            {...other}
        >
            {/* Display Message */}
            {message && (
                <Typography
                    variant="h4"
                    sx={{
                        position: 'absolute',
                        top: '15%', // Move the message higher (15% from the top of the screen)
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'text.primary',
                    }}
                    align="center"
                >
                    {message}
                </Typography>
            )}

            {/* Animated Logo with Rings */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Animated Logo */}
                <m.div
                    animate={{
                        scale: [1, 0.9, 0.9, 1, 1],
                        opacity: [1, 0.48, 0.48, 1, 1],
                    }}
                    transition={{
                        duration: 2,
                        ease: 'easeInOut',
                        repeatDelay: 1,
                        repeat: Infinity,
                    }}
                >
                    <Logo disabledLink sx={{ width: 64, height: 64 }} />
                </m.div>

                {/* First Animated Outer Ring */}
                <Box
                    component={m.div}
                    animate={{
                        scale: [1.6, 1, 1, 1.6, 1.6],
                        rotate: [270, 0, 0, 270, 270],
                        opacity: [0.25, 1, 1, 1, 0.25],
                        borderRadius: ['25%', '25%', '50%', '50%', '25%'],
                    }}
                    transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
                    sx={{
                        width: 100,
                        height: 100,
                        position: 'absolute',
                        border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
                    }}
                />

                {/* Second Animated Outer Ring */}
                <Box
                    component={m.div}
                    animate={{
                        scale: [1, 1.2, 1.2, 1, 1],
                        rotate: [0, 270, 270, 0, 0],
                        opacity: [1, 0.25, 0.25, 0.25, 1],
                        borderRadius: ['25%', '25%', '50%', '50%', '25%'],
                    }}
                    transition={{
                        ease: 'linear',
                        duration: 3.2,
                        repeat: Infinity,
                    }}
                    sx={{
                        width: 120,
                        height: 120,
                        color: 'primary.main',
                        position: 'absolute',
                        border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
                    }}
                />
            </Box>
        </Box>
    );
}