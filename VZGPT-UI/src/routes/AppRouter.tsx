import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Chat from "../pages/Chat";
import History from "../pages/History";
import Settings from "../pages/Settings";
import {Home} from "../components/Home";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="chat" element={<Chat />} />
                <Route path="chat/:id" element={<Chat />} />
                <Route path="history" element={<History />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}
