import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography, Box } from '@mui/material';

interface Props {
    id: string;
    title: string;
    children: ReactNode;
}

export default function SortableGroupItem({ id, title, children }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
    };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ mb: 4 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                {children}
            </Paper>
        </Box>
    );
}