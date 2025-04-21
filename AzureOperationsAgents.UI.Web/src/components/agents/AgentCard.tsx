// /src/components/agents/AgentCard.tsx
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    IconButton
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { keyframes } from '@emotion/react';

interface Agent {
    id: number;
    name: string;
    type: string;
    status: string;
}

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

export default function AgentCard({ agent }: { agent: Agent }) {
    const { t } = useTranslation();

    const getColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'success';
            case 'Inactive':
                return 'default';
            case 'Error':
                return 'error';
            case 'Running':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ width: '200px', aspectRatio: '1 / 1' }}>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    animation: agent.status === 'Running' ? `${pulseAnimation} 2s infinite` : undefined,
                    border: agent.status === 'Running' ? '1px solid #1976d2' : undefined
                }}
            >
                <CardContent sx={{ flex: '1 1 auto', overflow: 'hidden' }}>
                    <Typography variant="subtitle2" color="text.secondary" noWrap>
                        #{agent.id} • {t(`agent.type.${agent.type}`)}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }} noWrap>
                        {agent.name}
                    </Typography>
                    <Chip
                        label={t(`agent.status.${agent.status}`)}
                        color={getColor(agent.status)}
                        sx={{ mt: 2 }}
                    />
                </CardContent>
                <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ p: 1 }}>
                    <IconButton size="small" title={t('agent.actions.restart')}>
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title={t('agent.actions.details')}>
                        <InfoIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Card>
        </Box>
    );
}
