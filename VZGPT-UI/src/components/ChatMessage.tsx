// ChatMessage.tsx
import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import '../index.css';
import { Box, CircularProgress } from '@mui/material';

interface ChatMessageProps {
    sender: 'user' | 'assistant';
    content: string;
    complete?: boolean;
}

export default function ChatMessage({ sender, content, complete = true }: ChatMessageProps) {
    // Extract content within <think> tags
    const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = thinkRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
        }
        parts.push({ type: 'think', value: match[1] });
        lastIndex = thinkRegex.lastIndex;
    }

    if (lastIndex < content.length) {
        parts.push({ type: 'text', value: content.slice(lastIndex) });
    }

    return (
        <div className={sender === 'user' ? 'user-message' : 'system-message'}>
            {parts.map((part, index) => (
                <Fragment key={index}>
                    {part.type === 'think' ? (
                        <div className="think-content" >{part.value}</div>
                    ) : (
                        <ReactMarkdown>{part.value}</ReactMarkdown>
                    )}
                </Fragment>
            ))}
            {sender === 'assistant' && !complete && (
                <Box display="flex" justifyContent="center" mt={1}>
                    <CircularProgress size={20} />
                </Box>
            )}
        </div>
    );
}
