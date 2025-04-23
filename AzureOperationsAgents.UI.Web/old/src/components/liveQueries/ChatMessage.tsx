// /src/components/livequeries/ChatMessage.tsx
import { Box, Typography, Paper } from '@mui/material';

interface Props {
    role: 'user' | 'system';
    content: string;
}

export default function ChatMessage({ role, content }: Props) {
    const isUser = role === 'user';

    return (
        <Box display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'}>
            <Paper
                elevation={1}
                sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    bgcolor: isUser ? 'primary.light' : 'grey.100',
                    color: isUser ? 'white' : 'text.primary',
                }}
            >
                <Typography variant="body2">{content}</Typography>
            </Paper>
        </Box>
    );
}