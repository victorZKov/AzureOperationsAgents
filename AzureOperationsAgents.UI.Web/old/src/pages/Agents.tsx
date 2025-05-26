// /src/pages/Agents.tsx
import {
    Grid,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    //Button,
    Tooltip,
    IconButton
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AgentCard from '../components/agents/AgentCard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableGroupItem from '../components/agents/SortableGroupItem';

const agents = [
    { id: 0, name: 'solar-fire-scan', type: 'Script', status: 'Active' },
    { id: 1, name: 'ocean-cloud-monitor', type: 'Monitor', status: 'Inactive' },
    { id: 2, name: 'falcon-logic-sort', type: 'Classification', status: 'Error' },
    { id: 3, name: 'echo-run-core', type: 'Run', status: 'Running' },
    { id: 4, name: 'ledger-audit-point', type: 'Audit', status: 'Stopped' },
    { id: 5, name: 'alert-notify-hub', type: 'Notify', status: 'Inactive' },
    { id: 6, name: 'flow-decide-act', type: 'Decide', status: 'Active' },
    { id: 7, name: 'frontend-public-web', type: 'Script', status: 'Unknown' },
];

export default function Agents() {
    const { t } = useTranslation();
    const [groupBy, setGroupBy] = useState<'none' | 'type' | 'status'>('none');
    const [orderedStatuses, setOrderedStatuses] = useState<string[]>([]);
    const [enableSort, setEnableSort] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('statusOrder');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setOrderedStatuses(parsed);
        }
    }, []);

    const handleChange = (event: any) => {
        const value = event.target.value;
        setGroupBy(value);
        setEnableSort(false);
    };

    const resetStatusOrder = () => {
        localStorage.removeItem('statusOrder');
        setOrderedStatuses([]);
    };

    const groupAgents = () => {
        if (groupBy === 'none') return [{ label: '', agents }];
        const grouped = agents.reduce((acc: any, agent) => {
            const key = agent[groupBy];
            if (!acc[key]) acc[key] = [];
            acc[key].push(agent);
            return acc;
        }, {});

        const entries = Object.entries(grouped).map(([label, agents]) => ({ label, agents }));

        if (groupBy === 'status') {
            const allStatuses = entries.map((e) => e.label);
            if (orderedStatuses.length === 0) {
                setOrderedStatuses(allStatuses);
                localStorage.setItem('statusOrder', JSON.stringify(allStatuses));
            }

            const knownOrder = orderedStatuses.length
                ? orderedStatuses.filter((label) => grouped[label])
                : allStatuses;

            return knownOrder.map((label) => ({ label, agents: grouped[label] || [] }));
        }

        return entries; // Ensure a fallback return value
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!active?.id || !over?.id || active.id === over.id) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        const oldIndex = orderedStatuses.indexOf(activeId);
        const newIndex = orderedStatuses.indexOf(overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(orderedStatuses, oldIndex, newIndex);
        setOrderedStatuses(newOrder);
        localStorage.setItem('statusOrder', JSON.stringify(newOrder));
    };

    const groupList = groupAgents();

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4">
                    {t('app.agents')}
                </Typography>
                <Stack direction="row" spacing={2}>
                    {groupBy === 'status' && (
                        <>
                            <Tooltip title={enableSort ? t('agent.sort.disable') : t('agent.sort.enable')}>
                                <IconButton onClick={() => setEnableSort(!enableSort)}>
                                    <DragIndicatorIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t('agent.sort.reset')}>
                                <IconButton onClick={resetStatusOrder}>
                                    <ReplayIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <FormControl sx={{ minWidth: 200 }} size="small">
                        <InputLabel>{t('agent.groupBy.label')}</InputLabel>
                        <Select value={groupBy} label={t('agent.groupBy.label')} onChange={handleChange}>
                            <MenuItem value="none">{t('agent.groupBy.none')}</MenuItem>
                            <MenuItem value="type">{t('agent.groupBy.type')}</MenuItem>
                            <MenuItem value="status">{t('agent.groupBy.status')}</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>

            {groupBy === 'status' && enableSort ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                    <SortableContext items={groupList.map((g) => g.label.toString())} strategy={verticalListSortingStrategy}>
                        {groupList.map((group) => (
                            <SortableGroupItem
                                key={group.label}
                                id={group.label.toString()}
                                title={t(`agent.groupBy.status`) + ': ' + t(`agent.status.${group.label}`, group.label)}
                            >
                                <Grid container spacing={2}>
                                    {group.agents.map((agent: any) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id} sx={{ display: 'flex' }}>
                                            <Box sx={{ width: '100%' }}>
                                                <AgentCard agent={agent} />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </SortableGroupItem>
                        ))}
                    </SortableContext>
                </DndContext>
            ) : (
                groupList.map((group, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                        {group.label && (
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {t(`agent.groupBy.${groupBy}`)}: {t(`agent.${groupBy}.${group.label}`, group.label)}
                            </Typography>
                        )}
                        <Grid container spacing={2}>
                            {group.agents.map((agent: any) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id} sx={{ display: 'flex' }}>
                                    <Box sx={{ width: '100%' }}>
                                        <AgentCard agent={agent} />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))
            )}
        </Box>
    );
}