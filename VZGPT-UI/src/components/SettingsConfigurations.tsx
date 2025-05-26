import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';
import { UserConfiguration } from '../types/Configuration';
import { useTranslation } from 'react-i18next';

interface SettingsConfigurationsProps {
    configurations: UserConfiguration[];
    loading: boolean;
    onSetDefault: (id: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onSave: (config: Partial<UserConfiguration>, isEditing: boolean) => Promise<void>;
}

const SettingsConfigurations: React.FC<SettingsConfigurationsProps> = ({
    configurations,
    loading,
    onSetDefault,
    onDelete,
    onSave
}) => {
    
    const { t } = useTranslation();
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState<UserConfiguration | null>(null);
    const [formData, setFormData] = useState<Partial<UserConfiguration>>({
        OpenAIKey: '',
        OpenAIEndpoint: '',
        OpenAIModel: '',
        OllamaServer: '',
        OllamaModel: '',
        SerperApiKey: '',
        SerperApiEndpoint: ''
    });

    const handleOpenDialog = (config?: UserConfiguration) => {
        if (config) {
            setEditingConfig(config);
            setFormData({
                Id: config.Id,
                OpenAIKey: config.OpenAIKey || '',
                OpenAIEndpoint: config.OpenAIEndpoint || '',
                OpenAIModel: config.OpenAIModel || '',
                OllamaServer: config.OllamaServer || '',
                OllamaModel: config.OllamaModel || '',
                SerperApiKey: config.SerperApiKey || '',
                SerperApiEndpoint: config.SerperApiEndpoint || ''
            });
        } else {
            setEditingConfig(null);
            setFormData({
                OpenAIKey: '',
                OpenAIEndpoint: '',
                OpenAIModel: '',
                OllamaServer: '',
                OllamaModel: '',
                SerperApiKey: '',
                SerperApiEndpoint: ''
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingConfig(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveConfiguration = async () => {
        await onSave(formData, Boolean(editingConfig));
        handleCloseDialog();
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t("apiConfig")}</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    {t("addNew")}
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : configurations.length > 0 ? (
                <List>
                    {configurations.map((config) => (
                        <React.Fragment key={config.Id}>
                            <ListItem>
                                <ListItemText 
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {config.IsDefault && (
                                                <StarIcon color="primary" sx={{ mr: 1 }} />
                                            )}
                                            <Typography>
                                                {config.IsDefault ? t("defaultConfiguration") : `${t("configuration")}${config.Id}`}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={`${t("lastUpdated")}: ${new Date(config.UpdatedAt).toLocaleString()}`}
                                />
                                <ListItemSecondaryAction>
                                    {!config.IsDefault && (
                                        <IconButton 
                                            edge="end" 
                                            aria-label="set-default"
                                            onClick={() => onSetDefault(config.Id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <StarIcon />
                                        </IconButton>
                                    )}
                                    <IconButton 
                                        edge="end" 
                                        aria-label="edit"
                                        onClick={() => handleOpenDialog(config)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete"
                                        onClick={() => onDelete(config.Id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography color="text.secondary">{t("noConfigurations")}</Typography>
                    <Typography color="text.secondary">{t("clickAddNew")}</Typography>
                </Box>
            )}

            {/* Configuration Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingConfig ? t("editConfiguration") : t("addNewConfiguration")}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>{t("openaiSettings")}</Typography>
                        <TextField
                            name="OpenAIKey"
                            label={t("openaiApiKey")}
                            value={formData.OpenAIKey}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            type="password"
                        />
                        <TextField
                            name="OpenAIEndpoint"
                            label={t("openaiEndpoint")}
                            value={formData.OpenAIEndpoint}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            placeholder="https://api.openai.com/v1"
                        />
                        <TextField
                            name="OpenAIModel"
                            label={t("openaiModel")}
                            value={formData.OpenAIModel}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            placeholder="gpt-4-turbo"
                        />

                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t("ollamaSettings")}</Typography>
                        <TextField
                            name="OllamaServer"
                            label={t("ollamaServer")}
                            value={formData.OllamaServer}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            placeholder="http://localhost:11434"
                        />
                        <TextField
                            name="OllamaModel"
                            label={t("ollamaModel")}
                            value={formData.OllamaModel}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            placeholder="llama2"
                        />

                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>{t("serperSettings")}</Typography>
                        <TextField
                            name="SerperApiKey"
                            label={t("serperApiKey")}
                            value={formData.SerperApiKey}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            type="password"
                        />
                        <TextField
                            name="SerperApiEndpoint"
                            label={t("serperApiEndpoint")}
                            value={formData.SerperApiEndpoint}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{t("cancel")}</Button>
                    <Button onClick={handleSaveConfiguration} variant="contained">
                        {t("save")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SettingsConfigurations;
