// src/components/livequeries/AgentSelector.tsx
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

interface Props {
    value: string;
    onChange: (agent: string) => void;
}

const agentOptions = [
    { label: 'Terraform Agent', value: 'terraform' },
    { label: 'Azure Ops Agent', value: 'azureOps' },
    { label: 'PowerShell Agent', value: 'powershell' },
];

export default function AgentSelector({ value, onChange }: Props) {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    return (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="body2">Agent:</Typography>
            <Select
                size="small"
                value={value}
                onChange={handleChange}
                sx={{ minWidth: 200 }}
            >
                {agentOptions.map((agent) => (
                    <MenuItem key={agent.value} value={agent.value}>
                        {agent.label}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
}