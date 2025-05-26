import {
    Box,
    Button,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    CircularProgress,
    Menu,
    MenuItem
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from "react-i18next";
import { useSelection } from "../contexts/SelectionContext";
import { ChatHeader } from "../types/Chat";
import { useState, useEffect, useRef } from "react";
import {
    assignChatToProject,
    deAssignChatToProject,
    deleteChat
} from "../api/ChatApi";
import { getProjects, createProject } from "../api/ProjectsApi";
import AssignProjectDialog from "./AssignProjectDialog";
import { Project } from "../types/Project";

type Props = {
    chats: ChatHeader[];
    onCreate?: () => void;
    onChatUpdated?: () => void;
    loading?: boolean;
};

export default function ChatList({ chats, onCreate, onChatUpdated, loading }: Props) {
    const { t } = useTranslation();
    const { selectChat, selectProject, reloadSidebarData } = useSelection();

    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
        chat: ChatHeader | null;
    } | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [chatToAssign, setChatToAssign] = useState<ChatHeader | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const projectsRef = useRef<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const projects = await getProjects();
            setProjects(projects);
            projectsRef.current = projects;
        };
        fetchProjects();
    }, []);

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
        onChatUpdated?.();
        reloadSidebarData();
    };

    const handleAssignToProject = () => {
        if (!contextMenu?.chat) return;
        setChatToAssign(contextMenu.chat);
        setDialogOpen(true);
        handleCloseContextMenu();
        reloadSidebarData();
    };

    const handleRemoveFromProject = async () => {
        if (!contextMenu?.chat) return;
        await deAssignChatToProject(contextMenu.chat.Id);
        handleCloseContextMenu();
        onChatUpdated?.();
        reloadSidebarData();
    };

    const handleProjectSelected = async (project: Project) => {
        if (!chatToAssign) return;
        await assignChatToProject(chatToAssign.Id, project.Id);
        setDialogOpen(false);
        setChatToAssign(null);
        selectProject(project);
        onChatUpdated?.();
    };

    const handleCreateNewProject = async () => {
        if (!newProjectName) return;
        const newProject = await createProject(newProjectName);
        setProjects([...projects, newProject]);
        projectsRef.current = [...projects, newProject];
        setNewProjectName("");
    };

    return (
        <Box px={2} pt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="textSecondary">
                    {t("history")}
                </Typography>
                <Button
                    onClick={onCreate}
                    size="small"
                    startIcon={<AddIcon />}
                    title={t("newChat")}
                />
            </Box>

            {loading && chats.length === 0 ? (
                <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <List dense>
                    {chats.map((chat) => (
                        <ListItemButton
                            key={chat.Id}
                            onClick={() => selectChat(chat)}
                            onContextMenu={(e) => handleRightClick(e, chat)}
                        >
                            <ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary={chat.Title} />
                        </ListItemButton>
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
                <MenuItem onClick={handleDeleteChat}>
                    {t("delete")}
                </MenuItem>

                {!contextMenu?.chat?.ProjectId && (
                    <MenuItem onClick={handleAssignToProject}>
                        {t("assignMessageToProject")}
                    </MenuItem>
                )}

                
            </Menu>

            <AssignProjectDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSelect={handleProjectSelected}
                projects={projectsRef.current.length > 0 ? projectsRef.current : projects}
                loading={loading}
                onCreateProject={handleCreateNewProject}
                newProjectName={newProjectName}
                setNewProjectName={setNewProjectName}
            />
        </Box>
    );
}

