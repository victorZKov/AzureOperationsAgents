import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';
import i18n from '../i18n';
import {useTranslation} from "react-i18next";
import { useSelection } from '../contexts/SelectionContext';

export default function Topbar() {
    const { t } = useTranslation();
    const { selectedChat, selectedProject } = useSelection();
     const title = [t("appTitle")];
    if (selectedProject) {
        title.push(t("project"));
        title.push(selectedProject.Name);
    }
    if (selectedChat) {
        title.push(t("chat"));
        title.push(selectedChat.Title);
    }
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        handleClose();
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#e8f5e9',
                boxShadow: 'none',
                borderBottom: '1px solid #ccc',
                m: 0, // quita cualquier margen
                p: 0  // quita cualquier padding accidental
            }}
        >
            <Toolbar sx={{ minHeight: 48, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="textPrimary">
                    {title.join(' : ')}
                </Typography>

                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                    <LanguageIcon />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => changeLanguage('es')}>Español</MenuItem>
                    <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}