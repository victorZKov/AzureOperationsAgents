import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Example2 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box p={4}>
            <Box display="flex" alignItems="center" mb={2}>
                <Button variant="outlined" onClick={() => navigate('/')}>
                    <>&larr;</>
                </Button>
                <Typography variant="h4" gutterBottom ml={2}>
                    {t('example2TitleInPage')}
                </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
                {t('example2Description')}
            </Typography>
            <Typography variant="body2">
                <strong>{t('prompt')}:</strong> "{t('example2Prompt')}"<br />
                <strong>{t('response')}:</strong> "{t('example2Response')}"
            </Typography>
        </Box>
    );
};

export default Example2;
