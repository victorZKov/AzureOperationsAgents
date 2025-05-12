import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';
import { Typography } from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';
import { paths } from '../../routes/paths';
import Label from '../label';
import { VERSION } from '../../config-global';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
    disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
    ({ disabledLink = false, sx, ...other }, ref) => {
        const theme = useTheme();

        const logo = (
            <Box
                ref={ref}
                component="div"
                sx={{
                    width: 40,
                    height: 40,
                    display: 'inline-flex',
                    ...sx,
                }}
                {...other}
            >
                <Badge
                    sx={{
                        [`& .${badgeClasses.badge}`]: {
                            top: 8,
                            right: -16,
                        },
                    }}
                    badgeContent={
                        <Label color="info" sx={{ ml: 6, textTransform: 'unset', height: 22, px: 0.5 }}>
                            {VERSION}
                        </Label>
                    }
                >
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'purple' }}>
                        L1 Support
                    </Typography>
                </Badge>
            </Box>
        );

        if (disabledLink) {
            return logo;
        }

        return (
            <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
                {logo}
            </Link>
        );
    }
);

export default Logo;