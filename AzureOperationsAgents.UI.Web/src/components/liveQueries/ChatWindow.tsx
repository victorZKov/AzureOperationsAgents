import { Box, Paper, Stack, IconButton, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatHistoryPanel from "./ChatHistoryPanel";
import ModelSelector from './ModelSelector';
import AgentSelector from './AgentSelector';
import terraformAgentPrompt from "../../constants/TerraformAgentPrompt";
import azureOperationsAgentPrompt from "../../constants/AzureOperationsAgentPrompt";
import { sendMessageToOllama } from "../../api/ollamaService";

interface Message {
    role: 'user' | 'system';
    content: string;
}

export default function ChatWindow() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [historyVisible, setHistoryVisible] = useState(true);
    const [historyPinned, setHistoryPinned] = useState(false);
    const [selectedModel, setSelectedModel] = useState('deepseek-r1:latest');
    const [selectedAgent, setSelectedAgent] = useState('terraform');

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [history, setHistory] = useState<Message[][]>(() => {
        const saved = localStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [];
    });


    const handleSend = async (text: string) => {
        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        // Add placeholder for system message
        setMessages(prev => [...prev, { role: 'system', content: '' }]);

        const systemMsgIndex = messages.length + 1;
        const systemPrompt =
            selectedAgent === 'terraform' ? terraformAgentPrompt : azureOperationsAgentPrompt;

        const sendPrompt = `${systemPrompt.trim()}\n\nUser: ${text}`;
        try {
            await sendMessageToOllama(sendPrompt, (chunk) => {
                setMessages(prevMessages => {
                    if (!prevMessages[systemMsgIndex]) {
                        return [...prevMessages, { role: 'system', content: chunk }];
                    }
                    const updated = [...prevMessages];
                    updated[systemMsgIndex] = {
                        ...updated[systemMsgIndex],
                        content: (updated[systemMsgIndex].content || '') + chunk
                    };
                    return updated;
                });
            }, selectedModel);

            // ✅ Scroll when finished
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

            // ✅ Add "response completed" message
            setMessages(prev => [...prev, { role: 'system', content: '[✔] Response completed.' }]);

        } catch {
            setMessages(prev => [...prev, { role: 'system', content: 'Error: Unable to get a response.' }]);
        }
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
                
                <ModelSelector value={selectedModel} onChange={setSelectedModel} />

                <AgentSelector value={selectedAgent} onChange={setSelectedAgent} />
                
                <Stack spacing={1} sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} role={msg.role} content={msg.content} />
                    ))}
                    <div ref={bottomRef} />
                </Stack>
                <ChatInput
                    onSend={handleSend}
                    onFocus={() => {
                        if (!historyPinned) setHistoryVisible(false);
                    }}
                />
            </Paper>

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