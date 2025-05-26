import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Example3 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box p={4}>
            <Box display="flex" alignItems="center" mb={2}>
                <Button variant="outlined" onClick={() => navigate('/')}>
                    <>&larr;</>
                </Button>
                <Typography variant="h4" gutterBottom ml={2}>
                    {t('example3TitleInPage')}
                </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
                {t('example3Description')}
            </Typography>
            <Typography variant="body2">
                <strong>{t('prompt')}:</strong> "{t('example3Prompt')}"<br />
                <strong>{t('response')}:</strong> "{t('example3Response')}"
            </Typography>
        </Box>
    );
};

export default Example3;
