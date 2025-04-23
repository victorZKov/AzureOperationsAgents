// /src/components/shared/PageOffset.tsx
import { Box } from '@mui/material';

export default function PageOffset() {
    return <Box sx={{ height: (theme) => theme.mixins.toolbar.minHeight }} />;
}