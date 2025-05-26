import {Box, IconButton, TextField} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {useTranslation} from "react-i18next";
import {useState, useEffect} from "react";

type ChatPromptProps = {
    onSend: (message: string, model: string) => void;
};

export default function ChatPrompt({ onSend }: ChatPromptProps) {
    const { t } = useTranslation();
    const [input, setInput] = useState("");
    const [selectedModel, setSelectedModel] = useState("openai");

    // Get the engine from localStorage when component mounts
    useEffect(() => {
        const savedEngine = localStorage.getItem('chatEngine');
        if (savedEngine) {
            setSelectedModel(savedEngine);
        }
    }, []);

    const handleSend = () => {
        if (input.trim() === "") return;
        onSend(input, selectedModel);
        setInput("");
    };

    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
            width="100%" 
            px={2} 
            pb={2}
        >
            <Box 
                display="flex" 
                width="100%" 
                maxWidth="800px" 
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    size="medium"
                    placeholder={t("prompt")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    multiline
                    rows={1}
                    sx={{ 
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px'
                        }
                    }}
                />
                <IconButton 
                    onClick={handleSend} 
                    sx={{ 
                        ml: 1,
                        height: '100%'
                    }} 
                    color="primary"
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

