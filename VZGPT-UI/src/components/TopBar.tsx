import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Chip } from '@mui/material'; // Added Chip
import LanguageIcon from '@mui/icons-material/Language';
import React, { useState, useEffect } from 'react'; // Added useEffect
import i18n from '../i18n';
import {useTranslation} from "react-i18next";
import { useSelection } from '../contexts/SelectionContext';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useNavigate and useLocation
import { AIModel } from '../types/AIModel'; // Added AIModel import
import { getAIModels } from '../api/ModelApi'; // Added getAIModels import

export default function Topbar() {
    const { t } = useTranslation();
    const { selectedChat, selectedProject } = useSelection();
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation();
    const [aiModels, setAiModels] = useState<AIModel[]>([]);
    const [currentModelDisplayName, setCurrentModelDisplayName] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');

    // Fetch AI models once
    useEffect(() => {
        getAIModels().then(setAiModels).catch(err => console.error('Failed to load AI models in TopBar', err));
    }, []);

    // Update display name when models load or route changes
    useEffect(() => {
        const savedEngine = localStorage.getItem('selectedEngine');
        const savedModelName = localStorage.getItem('selectedModel');
        if (savedEngine && savedModelName && aiModels.length) {
            const sm = aiModels.find(m => m.engineName === savedEngine && m.modelName === savedModelName);
            setCurrentModelDisplayName(sm?.displayName || t('defaultModel'));
        } else {
            setCurrentModelDisplayName(t('noModelSelected'));
        }
    }, [aiModels, location]);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            setSelectedLanguage(savedLanguage);
            i18n.changeLanguage(savedLanguage); // Ensure i18n is updated
        } else {
            setSelectedLanguage('en'); // Default to English if no language is saved
            i18n.changeLanguage('en'); // Ensure i18n is updated
        }
    }, []);

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
        localStorage.setItem('selectedLanguage', lang);
        setSelectedLanguage(lang);
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
            <Toolbar sx={{ minHeight: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="textPrimary" sx={{ flexGrow: 1 }} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                   {title.join(' : ')}
                </Typography>

                {currentModelDisplayName && (
                    <Chip
                        label={currentModelDisplayName}
                        onClick={() => navigate('/settings')}
                        sx={{ cursor: 'pointer', mr: 2, backgroundColor: 'primary.light', color: 'white' }}
                        size="small"
                    />
                )}

                <IconButton onClick={handleClick} size="small" sx={{ ml: 'auto' }}>
                    <LanguageIcon />
                    <span style={{ marginLeft: 4 }}>
                        {i18n.language === 'es' ? '🇪🇸' : '🇬🇧'}
                    </span>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => changeLanguage('es')}>🇪🇸 Español</MenuItem>
                    <MenuItem onClick={() => changeLanguage('en')}>🇬🇧 English</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

