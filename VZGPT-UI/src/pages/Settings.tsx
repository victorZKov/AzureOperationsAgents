import { useState, useEffect } from 'react';
import {
    Box, 
    Card, 
    CardContent,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function Settings() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem('language') || i18n.language || 'en');
    const [engine, setEngine] = useState(localStorage.getItem('chatEngine') || 'openai');

    // Effect to synchronize with localStorage if it changes externally
    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage && storedLanguage !== language) {
            setLanguage(storedLanguage);
        }

        const storedEngine = localStorage.getItem('chatEngine');
        if (storedEngine && storedEngine !== engine) {
            setEngine(storedEngine);
        }
    }, []);

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
        // Save to localStorage for persistence
        localStorage.setItem('language', newLanguage);
    };

    const handleEngineChange = (event: SelectChangeEvent<string>) => {
        const newEngine = event.target.value;
        setEngine(newEngine);
        // Save to localStorage for persistence
        localStorage.setItem('chatEngine', newEngine);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('settings')}
                </Typography>
                
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {t('language')}
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="language-select-label">{t('language')}</InputLabel>
                            <Select
                                labelId="language-select-label"
                                id="language-select"
                                value={language}
                                label={t('language')}
                                onChange={handleLanguageChange}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Español</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
                
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Chat Engine
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="engine-select-label">Engine</InputLabel>
                            <Select
                                labelId="engine-select-label"
                                id="engine-select"
                                value={engine}
                                label="Engine"
                                onChange={handleEngineChange}
                            >
                                <MenuItem value="openai">OpenAI</MenuItem>
                                <MenuItem value="ollama">Ollama</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
