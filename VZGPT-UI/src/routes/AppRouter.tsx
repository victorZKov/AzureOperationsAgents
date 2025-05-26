import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Chat from "../pages/Chat";
import History from "../pages/History";
import Settings from "../pages/Settings";
import {Home} from "../components/Home";
import Example3 from "../pages/Example3";
import Example4 from "../pages/Example4";
import Example2 from "../pages/Example2";
import Example1 from "../pages/Example1";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="chat" element={<Chat />} />
                <Route path="chat/:id" element={<Chat />} />
                <Route path="history" element={<History />} />
                <Route path="settings" element={<Settings />} />
                <Route path="example1" element={<Example1 />} />
                <Route path="example2" element={<Example2 />} />
                <Route path="example3" element={<Example3 />} />
                <Route path="example4" element={<Example4 />} />
            </Route>
        </Routes>
    );
}
