import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useState } from 'react';
import PageOffset from "../shared/PageOffset.tsx";

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Topbar onDrawerToggle={handleDrawerToggle} />
            <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <PageOffset /> {/* Espacio para que no tape la Topbar */}
                {children}
            </Box>
        </Box>
    );
};