import {Paper, Stack, Typography, Button, Box, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PushPinIcon from "@mui/icons-material/PushPin";

interface Message {
    role: 'user' | 'system';
    content: string;
}

interface Props {
    history: Message[][];
    onNewConversation: () => void;
    pinned: boolean;
    onTogglePin: () => void;
    onSelectConversation: (messages: Message[]) => void;
}

export default function ChatHistoryPanel({ history, 
                                             onNewConversation, 
                                             pinned, 
                                             onTogglePin,
                                             onSelectConversation
                                         }: Props) {
    const { t } = useTranslation();
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <Paper sx={{ width: 300, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="div">
                    {t('chat.history')}
                </Typography>
                <Tooltip title={pinned ? t('chat.unpinHistory') : t('chat.pinHistory')}>
                    <IconButton onClick={onTogglePin}>
                        <PushPinIcon color={pinned ? 'primary' : 'inherit'} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Stack spacing={1} sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                {history.map((conversation, index) => (
                    <Box
                        key={index}
                        onClick={() => onSelectConversation(conversation)}
                        sx={{
                            cursor: 'pointer',
                            p: 1,
                            mb: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            }
                        }}
                    >
                        <Typography variant="body2">
                            {t('chat.conversation')} {index + 1}
                        </Typography>
                    </Box>
                ))}
            </Stack>
            <Button variant="outlined" onClick={() => setConfirmOpen(true)}>
                {t('chat.clear')}
            </Button>
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">{t('chat.confirmClearTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        {t('chat.confirmClearMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>{t('chat.cancel')}</Button>
                    <Button onClick={() => { setConfirmOpen(false); onNewConversation(); }} color="error" autoFocus>
                        {t('chat.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}