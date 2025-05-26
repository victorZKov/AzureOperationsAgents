import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Example4 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box p={4}>
            <Box display="flex" alignItems="center" mb={2}>
                <Button variant="outlined" 
                        onClick={() => navigate('/')}>
                    <>&larr;</>
                </Button>
                <Typography variant="h4" gutterBottom ml={2}>
                    {t('example4TitleInPage')}
                </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
                {t('example4Description')}
            </Typography>
            <Typography variant="body2">
                <strong>{t('prompt')}:</strong> "{t('example4Prompt')}"<br />
                <strong>{t('response')}:</strong> "{t('example4Response')}"
            </Typography>
        </Box>
    );
};

export default Example4;
