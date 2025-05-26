import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Example1 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box p={4}>
            <Box display="flex" alignItems="center" mb={2}>
                <Button variant="outlined" onClick={() => navigate('/')}>
                    <>&larr;</>
                </Button>
                <Typography variant="h4" gutterBottom ml={2}>
                    {t('example1TitleInPage')}
                </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
                {t('example1Description')}
            </Typography>
            <Typography variant="body2">
                <strong>{t('prompt')}:</strong> "{t('example1Prompt')}"<br />
                <strong>{t('response')}:</strong> "{t('example1Response')}"
            </Typography>
        </Box>
    );
};

export default Example1;
