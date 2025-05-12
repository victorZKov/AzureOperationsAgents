import React, {useEffect, useRef, useState} from 'react';
import { useLocales } from "../../locales";
import {Box, Drawer, Typography, Badge} from "@mui/material";
import Scrollbar from "../../components/scrollbar";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Iconify from "../../components/iconify";
import Button from "@mui/material/Button";
import {useGenerateIdeas} from "../../api/dashboard";
import {enqueueSnackbar} from "../../components/snackbar";
import {useGetUser} from "../../api/user";
import Label from "../../components/label";
import {SplashScreen} from "../../components/loading-screen";

interface Props {
    existingText: string | null;
    open: boolean;
    onClose: VoidFunction;
    setIdea: (idea: string) => void;
}

export default function GenerationIdeasDrawer({
        existingText,
        open,
        onClose,
        setIdea,
    ...other
    }: Props) {
    
    const { t } = useLocales();
    
    const { profile } = useGetUser();
    
    const [text, setText] = useState<string>(existingText ?? '');
    
    const { generateIdeas, generateIdeasLoading, generateIdeasError } = useGenerateIdeas();
    
    const [ideas, setIdeas] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (generateIdeasError) {
            console.error(generateIdeasError);
            enqueueSnackbar(generateIdeasError, { variant: 'error' });
        }
    }, [generateIdeasError]);

    const onIdeas = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const suggestions = await generateIdeas(existingText ?? '');

            if (!suggestions?.Value?.response) {
                console.warn('No suggestions found');
                return;
            }

            const cleanIdea = (idea: string): string =>
                idea
                    .replace(/^\d+\.\s*Prompt:\s*/, '') 
                    .replace(/^\d+\.\s*/, ''); 

            const ideasArray = suggestions.Value.response
                .split('\n') 
                .filter(Boolean) 
                .map(cleanIdea);

            ideasArray.shift();
            
            console.log('Processed ideas:', ideasArray);
            setIdeas(ideasArray);
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to generate ideas:', err);
            enqueueSnackbar(t('generation.error-generating-ideas'), { variant: 'error' });
            setIsLoading(false);
        }
    };
    
    const onIdea = (idea: string) => {
        setIdea(idea);
        onClose();
    }
    
    const onInitializeIdeas = () => {
        setIdeas([]);
        setText('');
        setIsLoading(false);
    }
    
    return (
        <>
            <Drawer
                open={open}
                onClose={onClose}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true},
                }}
                PaperProps={{
                    sx: { width: 320 },
                }}
                {...other}
                >
                <Scrollbar sx={{ height: 1 }}>
                    <Stack direction="row" alignItems="center"
                            justifyContent="space-between" sx={{ p: 2.5 }}>
                        <Button
                            // sx={{ mr: 1 }}
                            variant="soft"
                            size="large"
                            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                            onClick={onClose}
                        >
                            {/*{t('fileManager.close')}*/}
                        </Button>
                       
                        <Label
                            color="primary"
                            right={2}
                            variant="soft"
                            sx={{
                                top: 3,
                                px: 0.5,
                                //left: 40,
                                height: 20,
                                position: 'absolute',
                                borderBottomLeftRadius: 2,
                            }}
                        >
                            {t('generation.remaining-ideas')}: {profile?.RemainingIdeas}
                        </Label>
                            <Typography variant="h6"> {t('generation.ideas-title')} </Typography>
                        
                    </Stack>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <Stack
                        spacing={2.5}
                        justifyContent="center"
                        sx={{
                            p: 2.5,
                            bgcolor: 'background.neutral',
                        }}>
                        {text && (
                            <>
                                <Box sx={{ display: 'vertical', 
                                    justifyContent: 'space-between', 
                                    border: 1, 
                                    borderRadius:1, 
                                    padding:1,
                                    bgcolor: 'background.paper'
                                }}>
                                    <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                                        {t('generation.existing-text')}
                                    </Typography>
                                    <Divider sx={{ borderStyle: 'dashed', mt:1 }} />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-all', mt:1, mb:1 }}>
                                        {text}
                                    </Typography>
                               </Box>
                            </>
                        )}
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Button
                                sx={{ ml: 1 }}
                                variant="soft"
                                color="primary"
                                size="large"
                                startIcon={<Iconify icon="eva:bulb-fill" />}
                                onClick={onIdeas}
                            >
                                {t('generation.ideas')}
                            </Button>
                            <Button
                                sx={{ ml: 1 }}
                                variant="soft"
                                color="error"
                                size="small"
                                startIcon={<Iconify icon="eva:trash-fill" />}
                                onClick={onInitializeIdeas}
                            >{/*{t('generation.empty-ideas')}*/}
                            </Button>
                        </Stack>
                            <Divider sx={{ borderStyle: 'dashed' }} />
                        <Box>
                            <Stack>
                            {isLoading && 
                                <SplashScreen message={t('generation.ideas-are-generating')} sx={{color:"red"}} />
                            }
                            {ideas.map((idea, index) => (
                                <>
                                    {/*<Typography key={index} variant="body2" sx={{ wordBreak: 'break-all' }}>*/}
                                    {/*    {idea}*/}
                                    {/*</Typography>*/}
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        size="medium"
                                        fullWidth
                                        sx={{ mt: 1, minHeight: 48, height: 100 }}
                                        onClick={() => onIdea(idea)}
                                    >
                                        {idea}
                                        {/*{t('generation.use-idea')}*/}
                                    </Button>
                                </>
                            ))}
                        </Stack>
                        </Box>
                    </Stack>
                </Scrollbar>
            </Drawer>
        </>
    );
}
 