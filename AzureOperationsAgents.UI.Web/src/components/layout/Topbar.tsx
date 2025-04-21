import { useMsal } from '@azure/msal-react';
import { AccountInfo } from '@azure/msal-browser';
import { Menu, MenuItem, IconButton, Tooltip, Typography, AppBar, Toolbar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';

interface TopbarProps {
    onDrawerToggle: () => void;
}

export default function Topbar({ onDrawerToggle }: TopbarProps) {
    const { t } = useTranslation();
    const { accounts, instance } = useMsal();
    const user = accounts[0] as AccountInfo;

    // 🔹 Idioma
    const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
    const languageMenuOpen = Boolean(languageAnchorEl);

    // 🔹 Usuario
    const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(userAnchorEl);

    const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => setLanguageAnchorEl(event.currentTarget);
    const handleLanguageMenuClose = () => setLanguageAnchorEl(null);

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => setUserAnchorEl(event.currentTarget);
    const handleUserMenuClose = () => setUserAnchorEl(null);

    const handleLogout = () => instance.logoutRedirect();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        handleLanguageMenuClose();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    {t('app.title')}
                </Typography>

                {/* Idioma */}
                <IconButton color="inherit" onClick={handleLanguageMenuOpen}>
                    <TranslateIcon />
                </IconButton>
                <Menu
                    anchorEl={languageAnchorEl}
                    open={languageMenuOpen}
                    onClose={handleLanguageMenuClose}
                >
                    <MenuItem onClick={() => changeLanguage('es')}>Español</MenuItem>
                    <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                </Menu>

                {/* Usuario */}
                <Tooltip title={user?.name || 'User'}>
                    <IconButton onClick={handleUserMenuOpen} size="large" color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={userAnchorEl} open={userMenuOpen} onClose={handleUserMenuClose}>
                    <MenuItem disabled>{user?.name}</MenuItem>
                    <MenuItem onClick={() => location.href = '/settings'}>{t('menu.settings')}</MenuItem>
                    <MenuItem onClick={handleLogout}>{t('menu.logout')}</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}