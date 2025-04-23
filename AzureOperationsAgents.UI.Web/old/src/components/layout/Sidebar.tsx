import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Toolbar,
    Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

interface SidebarProps {
    mobileOpen: boolean;
    onDrawerToggle: () => void;
}

export default function Sidebar({ mobileOpen, onDrawerToggle }: SidebarProps) {
    const { t } = useTranslation();
    const drawerContent = (
        <Box onClick={onDrawerToggle} sx={{ textAlign: 'center' }}>
            <Toolbar />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                        <ListItemText primary={t("app.agents")} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/audit">
                        <ListItemText primary={t("app.audit")} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/live-queries">
                        <ListItemText primary={t("app.queries")} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            {/* Drawer en móviles */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Drawer permanente en desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <Toolbar />
                {drawerContent}
            </Drawer>
        </>
    );
}