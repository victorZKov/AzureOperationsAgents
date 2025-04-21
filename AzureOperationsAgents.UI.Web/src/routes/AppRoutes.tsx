import { Routes, Route } from 'react-router-dom';
import Agents from '../pages/Agents';
import Audit from '../pages/Audit';
import LiveQueries from '../pages/LiveQueries';
import Login from '../pages/Login';
import { RequireAuth } from '../auth/RequireAuth';
import Settings from '../pages/Settings';

export const AppRoutes = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route
            path="/"
            element={
                <RequireAuth>
                    <Agents />
                </RequireAuth>
            }
        />
        <Route
            path="/audit"
            element={
                <RequireAuth>
                    <Audit />
                </RequireAuth>
            }
        />
        <Route
            path="/live-queries"
            element={
                <RequireAuth>
                    <LiveQueries />
                </RequireAuth>
            }
        />
        <Route
            path="/settings"
            element={
                <RequireAuth>
                    <Settings />
                </RequireAuth>
            }
        />
    </Routes>
);