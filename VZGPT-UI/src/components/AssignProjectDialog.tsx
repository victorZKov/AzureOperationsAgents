import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    TextField,
    Button,
    Divider,
    CircularProgress,
    Box
} from "@mui/material";
import { Project } from "../types/Project";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getProjects } from "../api/ProjectsApi";

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (project: Project) => void;
    // Optional props - will use internal state if not provided
    projects?: Project[];
    loading?: boolean;
    onCreateProject: (projectName: string) => Promise<void>;
    newProjectName?: string;
    setNewProjectName?: (name: string) => void;
}

export default function AssignProjectDialog({
    open,
    onClose,
    onSelect,
    projects: externalProjects,
    loading: externalLoading,
    onCreateProject,
    newProjectName: externalProjectName = "",
    setNewProjectName: externalSetNewProjectName
}: Props) {
    const { t } = useTranslation();
    
    // Internal state to make the component self-contained
    const [internalProjects, setInternalProjects] = useState<Project[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);
    const [internalProjectName, setInternalProjectName] = useState("");
    
    // Decide which state to use - prefer internal but use external if provided
    const projects = externalProjects || internalProjects;
    const loading = externalLoading !== undefined ? externalLoading : internalLoading;
    const projectName = externalProjectName || internalProjectName;
    
    // Function to handle project name changes
    const handleProjectNameChange = (name: string) => {
        setInternalProjectName(name);
        if (typeof externalSetNewProjectName === 'function') {
            try {
                externalSetNewProjectName(name);
            } catch (e) {
                console.warn("Failed to call external setNewProjectName:", e);
            }
        }
    };
    
    // Load projects when dialog opens
    useEffect(() => {
        if (open && (!externalProjects || externalProjects.length === 0)) {
            setInternalLoading(true);
            getProjects()
                .then(result => {
                    console.log("AssignProjectDialog: Loaded projects internally:", result);
                    setInternalProjects(result);
                })
                .catch(error => {
                    console.warn("AssignProjectDialog: Failed to load projects:", error);
                })
                .finally(() => {
                    setInternalLoading(false);
                });
        }
    }, [open, externalProjects]);
    
    // Custom handler for creating project that uses internal state
    const handleCreateProject = async () => {
        try {
            await onCreateProject(projectName);
            // Reset internal state
            setInternalProjectName("");
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };
    
    // Log for debugging
    console.log("AssignProjectDialog: Rendering. Open:", open, "Loading:", loading, 
                "Projects Count:", projects ? projects.length : 'undefined/null', 
                "ProjectName:", projectName);
    
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t("assignMessageToProject")}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={2}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <>
                        <List>
                            {projects && projects.length > 0 ? projects.map((proj) => (
                                <ListItemButton key={proj.Id} onClick={() => { onSelect(proj); onClose(); }}>
                                    <ListItemText primary={proj.Name} />
                                </ListItemButton>
                            )) : (
                                <Typography variant="body2" color="textSecondary" p={2}>
                                    {t("noProjects") || "No projects available"}
                                </Typography>
                            )}
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                            {t("createNewProject")}
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label={t("newProjectName")}
                            value={projectName}
                            onChange={(e) => {
                                console.log("AssignProjectDialog: TextField onChange. New value:", e.target.value);
                                handleProjectNameChange(e.target.value);
                            }}
                            sx={{ mt: 1 }}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("cancel")}</Button>
                <Button
                    onClick={handleCreateProject}
                    disabled={!projectName || !projectName.trim()}
                    variant="contained"
                >
                    {t("create")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

