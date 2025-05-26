import React, { useRef, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import ChatMessage from "./ChatMessage";
import AssistantMessageActions from "./AssistantMessageActions";
import { Message } from "../types/Chat";

interface ChatMessagesProps {
  messages: Message[];
  onLike: (index: number) => void;
  onDislike: (index: number) => void;
  onAddToProject: (index: number) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  onLike,
  onDislike,
  onAddToProject,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Stack spacing={2}>
      {messages.map((msg, index) => (
        <Box key={index}>
          <Box display="flex" justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}>
            <ChatMessage 
              sender={msg.sender} 
              content={msg.text} 
              complete={msg.complete !== false} 
            />
          </Box>
          {msg.sender === "assistant" && msg.interactive && msg.complete && (
            <AssistantMessageActions
              message={msg}
              index={index}
              onLike={() => onLike(index)}
              onDislike={() => onDislike(index)}
              onAddToProject={() => onAddToProject(index)}
            />
          )}
        </Box>
      ))}
      <div ref={bottomRef} />
    </Stack>
  );
};

export default ChatMessages;
