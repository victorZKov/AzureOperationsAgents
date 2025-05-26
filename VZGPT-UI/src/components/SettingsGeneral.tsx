import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { getAIModels } from '../api/ModelApi';
import { AIModel } from '../types/AIModel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface SettingsGeneralProps {
    language: string;
    engine: string;
    model: string; // Added model prop
    onLanguageChange: (event: SelectChangeEvent<string>) => void;
    onEngineChange: (event: SelectChangeEvent<string>) => void;
    onModelChange: (event: SelectChangeEvent<string>) => void; // Added onModelChange prop
    onInitComplete?: () => void;
}

const SettingsGeneral: React.FC<SettingsGeneralProps> = ({
    language,
    engine,
    model, // Added model
    onLanguageChange,
    onEngineChange,
    onModelChange, // Added onModelChange
    onInitComplete
}) => {
    const { t } = useTranslation();
    const [aiModels, setAiModels] = useState<AIModel[]>([]);
    const [filteredModels, setFilteredModels] = useState<AIModel[]>([]);
    const [loadingEngines, setLoadingEngines] = useState(true);
    const [loadingModels, setLoadingModels] = useState(true);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const models = await getAIModels();
                setAiModels(models);
                // Load saved engine and model from local storage
                const savedEngine = localStorage.getItem('selectedEngine');
                const savedModel = localStorage.getItem('selectedModel');
                if (savedEngine) {
                    onEngineChange({ target: { value: savedEngine } } as SelectChangeEvent<string>);
                    const modelsForSavedEngine = models.filter(m => m.engineName === savedEngine);
                    setFilteredModels(modelsForSavedEngine);
                    if (savedModel) {
                        onModelChange({ target: { value: savedModel } } as SelectChangeEvent<string>);
                    } else if (modelsForSavedEngine.length > 0) {
                        // If no model saved, but engine was, select first model for that engine
                        onModelChange({ target: { value: modelsForSavedEngine[0].modelName } } as SelectChangeEvent<string>);
                    }
                } else if (models.length > 0) {
                    // If no engine saved, select the first engine and its first model
                    const firstEngine = models[0].engineName;
                    onEngineChange({ target: { value: firstEngine } } as SelectChangeEvent<string>);
                    const modelsForFirstEngine = models.filter(m => m.engineName === firstEngine);
                    setFilteredModels(modelsForFirstEngine);
                    if (modelsForFirstEngine.length > 0) {
                        onModelChange({ target: { value: modelsForFirstEngine[0].modelName } } as SelectChangeEvent<string>);
                    }
                }
                // Notify parent that initial setup is complete
                onInitComplete && onInitComplete();
            } catch (error) {
                console.error("Failed to fetch AI models", error);
            }
        };
        fetchModels();
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            onLanguageChange({ target: { value: savedLanguage } } as SelectChangeEvent<string>);
        }
    }, []); // Run only on mount to set language from localStorage

    useEffect(() => {
        if (aiModels.length > 0) {
            setLoadingEngines(false);
        }
    }, [aiModels]);

    useEffect(() => {
        if (engine && filteredModels.length > 0) {
            setLoadingModels(false);
        }
    }, [engine, filteredModels]);

    useEffect(() => {
        // Update filtered models when engine changes
        if (engine) {
            setFilteredModels(aiModels.filter(m => m.engineName === engine));
            // Do not automatically select the first model here if a model is already selected
            // or if the current model is not part of the new filtered list, then reset it.
            const currentModelStillValid = aiModels.find(m => m.engineName === engine && m.modelName === model);
            if (!currentModelStillValid && aiModels.filter(m => m.engineName === engine).length > 0) {
                 // If current model is not valid for the new engine, select the first one by default
                // But only if a model isn't already set from localStorage or passed props
                if (!model || !aiModels.find(m => m.modelName === model && m.engineName === engine)) {
                    const firstModelOfEngine = aiModels.filter(m => m.engineName === engine)[0]?.modelName;
                    if (firstModelOfEngine) {
                        onModelChange({ target: { value: firstModelOfEngine } } as SelectChangeEvent<string>);
                    }
                }
            } else if (aiModels.filter(m => m.engineName === engine).length === 0) {
                 // If no models for this engine, reset model
                onModelChange({ target: { value: "" } } as SelectChangeEvent<string>);
            }
        } else {
            setFilteredModels([]);
        }
    }, [engine, aiModels]); // model is intentionally omitted to avoid loops with onModelChange

    const handleEngineChange = (event: SelectChangeEvent<string>) => {
        const selectedEngine = event.target.value;
        onEngineChange(event); // Propagate change up
        localStorage.setItem('selectedEngine', selectedEngine);
        // Reset model when engine changes, and select the first available model for the new engine
        const modelsForNewEngine = aiModels.filter(m => m.engineName === selectedEngine);
        if (modelsForNewEngine.length > 0) {
            const firstModelName = modelsForNewEngine[0].modelName;
            onModelChange({ target: { value: firstModelName } } as SelectChangeEvent<string>);
            localStorage.setItem('selectedModel', firstModelName);
        } else {
            onModelChange({ target: { value: "" } } as SelectChangeEvent<string>); // Reset model if no models for this engine
            localStorage.removeItem('selectedModel');
        }
    };

    const handleModelChange = (event: SelectChangeEvent<string>) => {
        const selectedModel = event.target.value;
        onModelChange(event); // Propagate change up
        localStorage.setItem('selectedModel', selectedModel);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };
    
    return (
        <>
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
                            onChange={onLanguageChange}
                        >
                            <MenuItem onClick={() => changeLanguage('es')} value="es">🇪🇸 Español</MenuItem>
                            <MenuItem onClick={() => changeLanguage('en')} value="en">🇬🇧 English</MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
            
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {t("chatEngineAndModel")} 
                    </Typography>
                    {loadingEngines ? (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="engine-select-label">{t("engine")}</InputLabel>
                            <Select
                                labelId="engine-select-label"
                                id="engine-select"
                                value={engine}
                                label={t("engine")}
                                onChange={handleEngineChange} // Use new handler
                            >
                                {/* Populate engines from aiModels */}
                                {Array.from(new Set(aiModels.map(m => m.engineName))).map(engineName => (
                                    <MenuItem key={engineName} value={engineName}>{engineName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {engine && (
                        loadingModels ? (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="model-select-label">{t("model")}</InputLabel>
                                <Select
                                    labelId="model-select-label"
                                    id="model-select"
                                    value={model}
                                    label={t("model")}
                                    onChange={handleModelChange} // Use new handler
                                >
                                    {filteredModels.map(m => (
                                        <MenuItem key={m.id} value={m.modelName}>{m.displayName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default SettingsGeneral;
