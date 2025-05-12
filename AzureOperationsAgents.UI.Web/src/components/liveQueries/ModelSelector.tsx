// src/components/livequeries/ModelSelector.tsx
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

interface Props {
    value: string;
    onChange: (model: string) => void;
}

const models = ['deepseek-r1:latest', 'mistral:latest', 'qwen3:4b', 'deepseek-r1:8b'];

export default function ModelSelector({ value, onChange }: Props) {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    return (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="body2">Model:</Typography>
            <Select
                size="small"
                value={value}
                onChange={handleChange}
                sx={{ minWidth: 200 }}
            >
                {models.map((model) => (
                    <MenuItem key={model} value={model}>
                        {model}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
}