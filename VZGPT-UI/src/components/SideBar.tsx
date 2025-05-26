import {
    Box,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { msalInstance } from '../main';
import { useTranslation } from 'react-i18next';
import ChatList from './ChatList';
import ProjectList from "./ProjectList";
import { getProjects } from '../api/ProjectsApi';
import { getChats } from '../api/ChatApi';
import { Project } from "../types/Project";
import { ChatHeader } from "../types/Chat";
import { useSelection } from '../contexts/SelectionContext';

const HEIGHT_KEY = "sidebar-project-height";

export default function SideBar() {
    const { t } = useTranslation();
    const { setProjects: setGlobalProjects } = useSelection();

    const [projects, setProjects] = useState<Project[]>([]);
    const [chats, setChats] = useState<ChatHeader[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingC, setLoadingC] = useState(true);

    const account = msalInstance.getAllAccounts()[0];
    const userName = account?.name || t('guestUser');

    const [projectHeight, setProjectHeight] = useState(() => {
        const saved = localStorage.getItem(HEIGHT_KEY);
        return saved ? parseInt(saved, 10) : 300;
    });
    const [isResizing, setIsResizing] = useState(false);

    const loadAll = async () => {
        try {
            const [projectList, chatList] = await Promise.all([getProjects(), getChats()]);

            const chatsByProject: Record<number, ChatHeader[]> = {};
            chatList.forEach(chat => {
                if (chat.ProjectId) {
                    if (!chatsByProject[chat.ProjectId]) {
                        chatsByProject[chat.ProjectId] = [];
                    }
                    chatsByProject[chat.ProjectId].push(chat);
                }
            });

            const enrichedProjects = projectList.map(p => ({
                ...p,
                Chats: chatsByProject[p.Id] || []
            }));

            setProjects(enrichedProjects);
            setGlobalProjects(enrichedProjects);
            setChats(chatList.filter(chat => !chat.ProjectId));
            setLoading(false);
            setLoadingC(false);
        } catch (err) {
            console.error("Error loading data", err);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    useEffect(() => {
        localStorage.setItem(HEIGHT_KEY, projectHeight.toString());
    }, [projectHeight]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleCloseMenu();
        msalInstance.logoutRedirect();
    };

    const handleNewChat = () => {
        window.location.href = "/chat";
    };

    const handleCreateProject = () => {
        console.log("Crear nuevo proyecto");
    };

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
            const newHeight = Math.max(100, e.clientY); // mínimo 100px
            setProjectHeight(newHeight);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <Box display="flex" flexDirection="column" height="100vh" width="100%" sx={{ overflow: 'hidden' }}>
            {/* Projects Section */}
            <Box height={projectHeight} overflow="auto">
                <ProjectList
                    projects={projects}
                    loading={loading}
                    onCreate={handleCreateProject}
                />
            </Box>

            {/* Divider */}
            <Box
                height="6px"
                sx={{
                    backgroundColor: '#ccc',
                    cursor: 'row-resize',
                    '&:hover': { backgroundColor: '#aaa' }
                }}
                onMouseDown={handleMouseDown}
            />

            {/* Chats Section */}
            <Box flex={1} overflow="auto">
                <ChatList
                    chats={chats}
                    loading={loadingC}
                    onCreate={handleNewChat}
                    onChatUpdated={loadAll}
                />
            </Box>

            {/* Footer */}
            <Box>
                <Divider sx={{ mb: 1 }} />
                <Box
                    display="flex"
                    alignItems="center"
                    px={1}
                    py={1}
                    borderRadius={1}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: '#f8f8f8',
                        '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                    onClick={handleOpenMenu}
                    bgcolor="#e3f2fd"
                >
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500} noWrap>
                        {userName}
                    </Typography>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    {account && (
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" />
                            <Typography sx={{ ml: 1 }}>{t("logout")}</Typography>
                        </MenuItem>
                    )}
                    {account && (
                        <MenuItem component={Link} to="/settings">
                            <SettingsIcon fontSize="small" />
                            <Typography sx={{ ml: 1 }}>{t("settings")}</Typography>
                        </MenuItem>
                    )}
                </Menu>
            </Box>
        </Box>
    );
}