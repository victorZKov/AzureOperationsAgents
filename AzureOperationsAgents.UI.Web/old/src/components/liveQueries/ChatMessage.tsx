// ChatMessage.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
    role: 'user' | 'system';
    content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
    return (
        <div className={role === 'user' ? 'user-message' : 'system-message'}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
