// Tipos
export type ChatHeader = {
    Id: number;
    Title: string;
    UserId: string;
    CreatedAt: string;
    ProjectId: number;
};

export type ChatDetail = {
    Id: number;
    ChatHeaderId: number;
    Sender: string;
    Message: string;
    SentAt: string;
};

export type Sender = "user" | "assistant";


export type Message = {
    sender: Sender;
    text: string;
    complete?: boolean;
    interactive?: boolean;
};