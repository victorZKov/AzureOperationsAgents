import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    CircularProgress,
    Collapse,
    Menu, MenuItem
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';

import { useTranslation } from 'react-i18next';
import { useSelection } from '../contexts/SelectionContext';
import { Project } from "../types/Project";
import { ChatHeader } from "../types/Chat";
import { useState } from "react";
import { deleteChat, deAssignChatToProject } from "../api/ChatApi";

type Props = {
    projects: Project[];
    onCreate?: () => void;
    loading?: boolean;
};

export default function ProjectList({ projects, onCreate, loading }: Props) {
    const { t } = useTranslation();
    const { selectChat } = useSelection();
    const [openProjectIds, setOpenProjectIds] = useState<number[]>([]);
    
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
        chat: ChatHeader | null;
    } | null>(null);
    const toggleProject = (projectId: number) => {
        setOpenProjectIds(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const handleRightClick = (e: React.MouseEvent, chat: ChatHeader) => {
        e.preventDefault();
        setContextMenu({
            mouseX: e.clientX - 2,
            mouseY: e.clientY - 4,
            chat
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleDeleteChat = async () => {
        if (!contextMenu?.chat) return;
        await deleteChat(contextMenu.chat.Id);
        handleCloseContextMenu();
        window.location.reload(); // o sincroniza el contexto
    };

    const handleRemoveFromProject = async () => {
        if (!contextMenu?.chat) return;
        await deAssignChatToProject(contextMenu.chat.Id);
        handleCloseContextMenu();
        window.location.reload();
    };
    
    return (
        <Box px={2} pt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="textSecondary">
                    {t("projects")}
                </Typography>
                <Button
                    onClick={onCreate}
                    size="small"
                    startIcon={<AddIcon />}
                    title={t("newProject")}
                />
            </Box>

            {loading && projects.length === 0 ? (
                <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <List dense>
                    {projects.map((project) => (
                        <Box key={project.Id}>
                            <ListItemButton
                                onClick={() => (project.Chats && project.Chats.length > 0) && toggleProject(project.Id)}
                            >
                                <ListItemIcon><FolderIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary={project.Name} />
                                {project.Chats && project.Chats.length > 0 && (
                                    openProjectIds.includes(project.Id) ? <ExpandLess /> : <ExpandMore />
                                )}
                            </ListItemButton>

                            <Collapse in={openProjectIds.includes(project.Id)} timeout="auto" unmountOnExit>
                                <List disablePadding dense>
                                    {(project.Chats || []).map((chat: ChatHeader) => (
                                        <ListItemButton
                                            key={chat.Id}
                                            sx={{ pl: 4 }}
                                            onClick={() => selectChat(chat)}
                                            onContextMenu={(e) => handleRightClick(e, chat)}
                                        >
                                            <ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary={chat.Title} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
            )}
            <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleDeleteChat}>{t("delete")}</MenuItem>
                <MenuItem onClick={handleRemoveFromProject}>{t("removeFromProject")}</MenuItem>
            </Menu>
        </Box>
    );
}