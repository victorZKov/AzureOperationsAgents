import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/SideBar";
import Topbar from "../components/TopBar";
import { useEffect, useState } from "react";

const WIDTH_KEY = "sidebar-width";

export default function MainLayout() {
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const stored = localStorage.getItem(WIDTH_KEY);
        return stored ? parseInt(stored, 10) : 260;
    });

    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
            const newWidth = Math.max(180, Math.min(600, e.clientX)); // min 180, max 600 px
            setSidebarWidth(newWidth);
            localStorage.setItem(WIDTH_KEY, newWidth.toString());
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    return (
        <Box display="flex" height="100vh" width="100vw" overflow="hidden">
            {/* Sidebar */}
            <Box width={sidebarWidth} flexShrink={0} display="flex" bgcolor="#f9f9f9">
                <Sidebar />
            </Box>

            {/* Resizer */}
            <Box
                width="6px"
                sx={{
                    cursor: "col-resize",
                    backgroundColor: "#ccc",
                    "&:hover": { backgroundColor: "#aaa" },
                    zIndex: 10
                }}
                onMouseDown={handleMouseDown}
            />

            {/* Main content */}
            <Box display="flex" flexDirection="column" flex={1} minHeight="100vh">
                <Topbar />
                <Box
                    component="main"
                    flex={1}
                    overflow="auto"
                    p={2}
                    display="flex"
                    flexDirection="column"
                    height="100%"
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}