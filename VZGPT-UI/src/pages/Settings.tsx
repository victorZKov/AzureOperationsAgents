import React, { useState, useEffect } from 'react';
import {
    Box, 
    Container,
    Typography,
    Tabs,
    Tab,
    Snackbar,
    Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { UserConfiguration } from '../types/Configuration';
import { 
    getUserConfigurations, 
    updateConfiguration, 
    createConfiguration, 
    setDefaultConfiguration,
    deleteConfiguration 
} from '../api/ConfigurationApi';
import SettingsGeneral from '../components/SettingsGeneral';
import SettingsConfigurations from '../components/SettingsConfigurations';
import { SelectChangeEvent } from '@mui/material'; // Import SelectChangeEvent

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function Settings() {
    const { t } = useTranslation();
    const [isInitializing, setIsInitializing] = useState(true);
    const [language, setLanguage] = useState(localStorage.getItem('language') || i18n.language || 'en');
    const [engine, setEngine] = useState(localStorage.getItem('selectedEngine') || ''); // Updated key and default
    const [model, setModel] = useState(localStorage.getItem('selectedModel') || ''); // Added model state
    
    // Configurations state
    const [configurations, setConfigurations] = useState<UserConfiguration[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Effect to synchronize with localStorage if it changes externally
    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage && storedLanguage !== language) {
            setLanguage(storedLanguage);
        }

        const storedEngine = localStorage.getItem('selectedEngine'); // Updated key
        if (storedEngine && storedEngine !== engine) {
            setEngine(storedEngine);
        }

        const storedModel = localStorage.getItem('selectedModel'); // Added for model
        if (storedModel && storedModel !== model) {
            setModel(storedModel);
        }
    }, []); // language, engine, model removed from deps to avoid loops, they are initialized once

    // Clear initializing flag once both engine and model have been set
    useEffect(() => {
        if (engine && model && isInitializing) {
            setIsInitializing(false);
        }
    }, [engine, model, isInitializing]);

    // Load user configurations on component mount
    useEffect(() => {
        fetchConfigurations();
    }, []);

    const fetchConfigurations = async () => {
        setLoading(true);
        try {
            const configs = await getUserConfigurations();
            setConfigurations(configs);
        } catch (error) {
            console.error(t("failedToFetchConfigurations"), error);
            setSnackbar({
                open: true,
                message: t("failedToLoadConfigurations"),
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (event: SelectChangeEvent<string>) => { // Changed event type
        const newLanguage = event.target.value as string;
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    const handleEngineChange = (event: SelectChangeEvent<string>) => { // Changed event type
        const newEngine = event.target.value as string;
        setEngine(newEngine);
        if (!isInitializing) {
            localStorage.setItem('selectedEngine', newEngine);
        }
    };

    const handleModelChange = (event: SelectChangeEvent<string>) => { // Added model handler
        const newModel = event.target.value as string;
        setModel(newModel);
        if (!isInitializing) {
            localStorage.setItem('selectedModel', newModel);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleSaveConfiguration = async (formData: Partial<UserConfiguration>, isEditing: boolean) => {
        try {
            if (isEditing && configurations.find(c => c.Id === formData.Id)) {
                // Update existing configuration
                await updateConfiguration(formData.Id!, formData);
                setSnackbar({
                    open: true,
                    message: t("configurationSaved"),
                    severity: 'success'
                });
            } else {
                // Create new configuration
                await createConfiguration(formData);
                setSnackbar({
                    open: true,
                    message: t("configurationSaved"),
                    severity: 'success'
                });
            }
            fetchConfigurations();
        } catch (error) {
            console.error("Failed to save configuration:", error);
            setSnackbar({
                open: true,
                message: t("failedToSaveConfiguration"),
                severity: 'error'
            });
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultConfiguration(id);
            setSnackbar({
                open: true,
                message: t("defaultConfigurationSet"),
                severity: 'success'
            });
            fetchConfigurations();
        } catch (error) {
            console.error(t("failedToSetDefaultConfiguration"), error);
            setSnackbar({
                open: true,
                message: t("failedToSetDefaultConfiguration"),
                severity: 'error'
            });
        }
    };

    const handleDeleteConfiguration = async (id: number) => {
        if (window.confirm(t("confirmDeleteConfiguration"))) {
            try {
                await deleteConfiguration(id);
                setSnackbar({
                    open: true,
                    message: t("configurationDeleted"),
                    severity: 'success'
                });
                fetchConfigurations();
            } catch (error) {
                console.error(t("failedToDeleteConfiguration"), error);
                setSnackbar({
                    open: true,
                    message: t("failedToDeleteConfiguration"),
                    severity: 'error'
                });
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('settings')}
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="settings tabs">
                        <Tab label={t('general')} />
                        <Tab label={t('apiConfig')} />
                    </Tabs>
                </Box>

                <TabPanel value={currentTab} index={0}>
                    <SettingsGeneral 
                        language={language} 
                        engine={engine}
                        model={model} // Pass model state
                        onLanguageChange={handleLanguageChange} // Correctly typed, no cast needed
                        onEngineChange={handleEngineChange}
                        onModelChange={handleModelChange} // Pass model handler
                    />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <SettingsConfigurations
                        configurations={configurations}
                        loading={loading}
                        onSetDefault={handleSetDefault}
                        onDelete={handleDeleteConfiguration}
                        onSave={handleSaveConfiguration}
                    />
                </TabPanel>

                {/* Snackbar for notifications */}
                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={6000} 
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
}
