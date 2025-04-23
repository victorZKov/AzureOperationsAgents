// /src/components/livequeries/ChatInput.tsx
import { 
    //Box, 
    IconButton, InputBase, Paper } from '@mui/material';
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={t('chat.placeholder')}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={onFocus}
            />
            <IconButton onClick={handleSend} color="primary">
                <SendIcon />
            </IconButton>
        </Paper>
    );
}