// /src/components/livequeries/ChatWindow.tsx
import { 
    Box, Paper, Stack, IconButton, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
//import PushPinIcon from '@mui/icons-material/PushPin';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChatMessage from "./ChatMessage.tsx";
import ChatInput from "./ChatInput.tsx";
import ChatHistoryPanel from './ChatHistoryPanel.tsx';

interface Message {
    role: 'user' | 'system';
    content: string;
}

export default function ChatWindow() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [historyVisible, setHistoryVisible] = useState(true);
    const [historyPinned, setHistoryPinned] = useState(false);
    const [history, setHistory] = useState<Message[][]>(() => {
      const saved = localStorage.getItem('chatHistory');
      return saved ? JSON.parse(saved) : [];
    });

    const handleSend = (text: string) => {
        const userMessage: Message = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);

      // Simulated system response
      setTimeout(() => {
const systemMessage: Message = { role: 'system', content: `${t('chat.youAsked')}: "${text}"` };
setMessages((prev) => [...prev, systemMessage]);
      }, 1000);
    };

    const handleNewConversation = () => {
      if (messages.length > 0) {
        const newHistory = [...history, messages];
        setHistory(newHistory);
        localStorage.setItem('chatHistory', JSON.stringify(newHistory));
      }
      setMessages([]);
    };

    const handleSelectConversation = (selectedMessages: Message[]) => {
      setMessages(selectedMessages);
    };

    return (
        <Box sx={{ display: 'flex', height: '70vh' }}>
            {/* Chat principal */}
            <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="flex-end" gap={1} mb={1}>
                    <Tooltip title={t('chat.clear')}>
                        <IconButton onClick={handleNewConversation}>
                            <RestartAltIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={historyVisible ? t('chat.hideHistory') : t('chat.showHistory')}>
                    <IconButton onClick={() => setHistoryVisible(prev => !prev)}>
                        <MenuOpenIcon />
                    </IconButton>
                    </Tooltip>
                    
                </Box>
                <Stack spacing={1} sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} role={msg.role} content={msg.content} />
                    ))}
                </Stack>
                <ChatInput
                    onSend={handleSend}
                    onFocus={() => {
                        if (!historyPinned) setHistoryVisible(false);
                    }}
                />
            </Paper>

            {/* Historial lateral */}
            {historyVisible && (
                <ChatHistoryPanel
                    history={history}
                    onNewConversation={handleNewConversation}
                    pinned={historyPinned}
                    onTogglePin={() => setHistoryPinned(prev => !prev)}
                    onSelectConversation={handleSelectConversation}
                />
            )}
        </Box>
    );
}