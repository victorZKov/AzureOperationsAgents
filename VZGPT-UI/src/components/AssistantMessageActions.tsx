import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelection } from "../contexts/SelectionContext";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import AddIcon from "@mui/icons-material/Add";
import { assignChatToProject } from "../api/ChatApi";

type Props = {
    message: { text: string; complete?: boolean };
    index: number;
    onLike: () => void;
    onDislike: () => void;
    onAddToProject: () => void;
};

export default function AssistantMessageActions({
                                                    message,
                                                    onLike,
                                                    onDislike,
                                                    onAddToProject
                                                }: Props) {
    const { t } = useTranslation();
    const { selectedProject, selectedChat } = useSelection();

    const handleAssign = async () => {
        if (selectedProject && selectedChat) {
            try {
                await assignChatToProject(selectedChat.Id, selectedProject.Id);
                console.log(`Chat ${selectedChat.Id} assigned to project ${selectedProject.Id}`);
            } catch (err) {
                console.error("Error assigning chat to project", err);
            }
        }
    };

    if (!message.complete) return null;

    return (
        <Stack direction="row" spacing={1} sx={{ mt: 1, px: 2, alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
                {t("feedback")}
            </Typography>
            <Button size="small" variant="outlined" onClick={onLike} title={t("like")}>
                <ThumbUpOffAltIcon fontSize="small" />
            </Button>
            <Button size="small" variant="outlined" onClick={onDislike} title={t("dislike")}>
                <ThumbDownOffAltIcon fontSize="small" />
            </Button>
            {selectedProject ? (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={handleAssign}
                    title={t("assignToSelectedProject")}
                >
                    <AddIcon fontSize="small" />
                </Button>
            ) : (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={onAddToProject}
                    title={t("addToProject")}
                >
                    <AddIcon fontSize="small" />
                </Button>
            )}
        </Stack>
    );
}