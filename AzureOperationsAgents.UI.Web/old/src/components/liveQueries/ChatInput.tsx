import { IconButton, Paper, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    onSend: (text: string) => void;
    onFocus?: () => void;
}

export default function ChatInput({ onSend, onFocus }: Props) {
    const { t } = useTranslation();
    const [value, setValue] = useState('');

    const handleSend = () => {
        if (!value.trim()) return;
        onSend(value.trim());
        setValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) return; // allow newline
            e.preventDefault();     // prevent form submit
            handleSend();
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
        >
            <TextField
                multiline
                fullWidth
                variant="standard"
                placeholder={t('chat.placeholder')}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                sx={{ ml: 1, flex: 1 }}
                InputProps={{ disableUnderline: true }}
            />
            <IconButton onClick={handleSend} color="primary">
                <SendIcon />
            </IconButton>
        </Paper>
    );
}