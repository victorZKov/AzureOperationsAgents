// src/hooks/useCustomParams.ts
import { useLocation } from 'react-router-dom';

export const useCustomParams = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries());
};