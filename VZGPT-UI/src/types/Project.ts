import {ChatHeader} from "./Chat";

export type Project = {
    Id: number;
    Name: string;
    UserId: string;
    CreatedAt: string;
    Chats?: ChatHeader[];
};
