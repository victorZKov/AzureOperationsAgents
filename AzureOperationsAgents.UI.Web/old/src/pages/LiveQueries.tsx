// /src/pages/LiveQueries.tsx
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChatWindow from '../components/liveQueries/ChatWindow';

export default function LiveQueries() {
    const { t } = useTranslation();
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t('chat.title')}
            </Typography>
            <ChatWindow />
        </Box>
    );
}