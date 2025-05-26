// ChatMessage.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../index.css';
import { Box, CircularProgress } from '@mui/material';

interface ChatMessageProps {
    sender: 'user' | 'assistant';
    content: string;
    complete?: boolean;
}

export default function ChatMessage({ sender, content, complete = true }: ChatMessageProps) {
    return (
        <div className={sender === 'user' ? 'user-message' : 'system-message'}>
            <ReactMarkdown>{content}</ReactMarkdown>
            {sender === 'assistant' && !complete && (
                <Box display="flex" justifyContent="center" mt={1}>
                    <CircularProgress size={20} />
                </Box>
            )}
        </div>
    );
}
