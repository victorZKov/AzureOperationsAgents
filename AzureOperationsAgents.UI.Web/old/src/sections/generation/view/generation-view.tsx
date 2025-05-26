import Container from "@mui/material/Container";
import { useSettingsContext } from "../../../components/settings";
import { paths } from "../../../routes/paths";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { Button, Typography } from "@mui/material";
import { useLocales } from "../../../locales";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import ProgressBar from "../../../components/progress-bar";
import Iconify from "../../../components/iconify";
import Stack from "@mui/material/Stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBoolean } from "../../../hooks/use-boolean";
import {useGenerateIdeas, useGenerateImage} from "../../../api/dashboard";
import { useGetUser } from "../../../api/user";
import { enqueueSnackbar } from "src/components/snackbar";
import GenerationPrintDialog from "../generation-print-dialog";
import { useLocation } from 'react-router-dom';
import GenerationSaveDialog from "../generation-save-dialog";
import { IFileDto } from "../../../types/file";
import {useCreateFile, useGetFolders} from "../../../api/file";
import GenerationIdeasDrawer from "../generation-ideas-drawer";
import Label from "../../../components/label";
import {LoadingScreen, SplashScreen} from "../../../components/loading-screen";

const SpeechBubble = styled(Box)(({ theme }) => ({
    position: "relative",
    top: "100%",
    left: "0",
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    
    borderRadius: "40px",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    width: "calc(80% - 20px)",
    fontSize: "0.875rem",
    "&::after": {
        content: '""',
        position: "absolute",
        top: "-8px",
        left: "20px",
        borderWidth: "8px",
        borderStyle: "solid",
        borderColor: `transparent transparent ${theme.palette.grey[100]} transparent`,
    },
}));

export default function GenerationView() {
    
    const { t } = useLocales();
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [print, setPrint] = useState(false);
    const [save, setSave] = useState(false);
    const [ideas, setIdeas] = useState(false);
    const [fileName, setFileName] = useState('');
    const [showHelp, setShowHelp] = useState(false);
    const location = useLocation();
    const textFieldRef = useRef<HTMLInputElement>(null);
    
    const [ imageFilled, setImageFilled ] = useState(false);
    
    const [ currentFolder, setCurrentFolder ] = useState(0);
    const [ parentFolder, setParentFolder ] = useState<number|null>(null);

    const settings = useSettingsContext();

    const { profile } = useGetUser();

    const { generateImage, generatedImageUrl, generateImageError, generateImageLoading } = useGenerateImage();
    
    let typingTimeout: NodeJS.Timeout;
    
    let panelVisible = false;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const imageUrl = params.get('image');
        if (imageUrl) {
            if (generatedImage !== imageUrl)
                setGeneratedImage(imageUrl);
            setIsGenerated(true);
            setPrompt(params.get('description') || '');
            setFileName(params.get('name') || '');
            setImageFilled(true);
            
        }
        else {
            setImageFilled(false);
        }
    }, [location.search]);

// https://www.colorea.io/dashboard/generation?
// image=https://nedevcolst01.blob.core.windows.net/b394c934-c7e8-4772-b92a-c3bbd9016e8f-images/20250106_155137-coloreaImagen.png
// &description=&name=Polar%20bear
    const handleChangePrompt = useCallback((value: string) => {
        setPrompt(value);
        setShowHelp(false);
        
    }, []);

        
    useEffect(() => {
        if (!generatedImageUrl) return;
        console.log('GENERATION ==== Generated image:', generatedImageUrl);
        if (generatedImageUrl.imageUrl !== generatedImage)
            setGeneratedImage(generatedImageUrl.imageUrl);
        setIsGenerated(!!generatedImageUrl);
    }, [generatedImageUrl]);

    useEffect(() => {
        if (generateImageError) {
            console.error(generateImageError);
            enqueueSnackbar(generateImageError, { variant: 'error' });
        }
    }, [generateImageError]);


    const ImageBox = styled(Box)(({ theme }) => ({
        borderRadius: '10px',
        border: '1px solid',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
    }));
            
    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedImage(null);
        try {
            await generateImage({ prompt, style: 'digital-painting' });
            setIsGenerated(true);
        } catch (err) {
            console.error('Image generation failed:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrintImage = () => {
        if (generatedImage) {
            setPrint(true);
        }
    };

    const handleSaveImage = () => {
        if (generatedImage) {
            setSave(true);
        }
    }

    const createFile = useCreateFile();
    const handleSaveImageToStorage = async () => {
        setIsGenerating(true);
        setIsGenerated(false);
        if (!generatedImage) return;

        const fileToSave: IFileDto = {
            Name: fileName,
            ParentId: currentFolder || 0,
            Url: generatedImage,
            Size: 0,
            Description: prompt,
        };

        await createFile(fileToSave);
        handleInit();
    }
    
    const handleShowHelp = () => {
        const show = !panelVisible && !showHelp;
        setShowHelp(show);
    }
    
    const handleIdeas = () => {
        setIdeas(true);
        setShowHelp(false);
        panelVisible = true;
    }
    
    const handleSetIdea = (idea: string) => {
        setPrompt(idea);
        setIdeas(false);
        setShowHelp(false);
        panelVisible = false;
    }
    
    const isMobile = window.innerWidth < 768;
    
    const handleInit = () => {
        setSave(false);
        setIsGenerating(false);
        setGeneratedImage(null);
        setPrint(false);
        setIsGenerated(false);
        setPrompt('');
        setFileName('');
        setImageFilled(false);
        setIdeas(false);
    }

    return (
        <>                
            <Label
                color="secondary"
                variant="soft"
                sx={{
                    top: 30,
                    px: 0.5,
                    //left: 40,
                    height: 20,
                    position: 'relative',
                    borderBottomLeftRadius: 2,
                }}
            >
                {t('generation.remaining-images')}: {profile?.RemainingImages}
            </Label>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading={t("generation.title")}
                    links={[
                        { name: t('dashboard'), href: paths.dashboard.root },
                        { name: t("generation.title") },
                    ]}
                    sx={{
                        mb: { xs: 3, md: 5 },
                    }}
                />
                
                <Typography variant="body2" sx={{ fontSize: "1rem", fontStyle: "italic", my: { xs: 3, md: 5 } }}>
                    {t('generation.description')}
                </Typography>

                <Box sx={{ backgroundColor: "white", borderRadius: "10px" }}>
                    <TextField
                        fullWidth
                        placeholder={`${t("generation.editContent")}`}
                        inputRef={textFieldRef}
                        value={prompt}
                        variant="outlined"
                        multiline
                        rows={2}
                        onChange={(e) => handleChangePrompt(e.target.value)}
                        InputProps={{
                            readOnly: imageFilled,
                        }}
                    />
                    {!imageFilled && showHelp && (
                        <SpeechBubble>
                            <Typography variant="body2">
                                {t('generation.need-inspiration')} <span style={{fontWeight:700}}> {t('generation.panel-ideas')}</span>
                            </Typography>
                            <Button variant="text" size="small" onClick={handleShowHelp} sx={{ mt: 1, color: "lightgrey" }}>
                                {t('generation.no-help')}
                            </Button>
                            <Button variant="contained" color="success" size="small" onClick={handleIdeas} sx={{ ml:1, mt: 1, color:"white" }}>
                                {t('generation.provide-help')}
                            </Button>
                        </SpeechBubble>
                    )}
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleInit}
                    sx={{ mt: 3, mr: 2 }}
                    disabled={prompt.length === 0 || isGenerating}
                >
                    <Iconify icon="eva:plus-square-fill" /> 
                    {imageFilled && t("generation.new-image")}
                </Button>
                {!imageFilled && (
                    <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerate}
                        sx={{ mt: 3 }}
                        disabled={prompt.length === 0 || isGenerating}
                    >
                        <Iconify icon="eva:brush-fill" />
                        {isGenerating ? t("generation.generating") : t("generation.generate")}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleIdeas}
                        sx={{ mt: 3, ml: 2 }}
                        disabled={isGenerating}
                    >
                        {t("generation.panel-ideas")}
                    </Button>
                    </>
                )}
                <ImageBox>
                    {isGenerating || generateImageLoading ? (
                        <>
                            <SplashScreen message={t('generation.image-is-generating')} />
                                <Typography variant="body1" ml={2}>
                                    {t("generation.generating")}
                                </Typography>
                        </>
                    ) : generatedImage ? (
                        <Stack>
                            <Typography variant="subtitle1" align="center">
                                {fileName}
                            </Typography>

                            <Stack sx={{ my: 2 }} direction="row" alignItems="left" justifyContent="flex-end">
                                <Button
                                    color="success"
                                    sx={{ mr: 2 }}
                                    variant="contained"
                                    startIcon={<Iconify icon="eva:cloud-download-fill" />}
                                    disabled={!isGenerated}
                                    onClick={() => { if (generatedImage) window.open(generatedImage, '_blank') }}
                                >
                                    {!isMobile && t('fileManager.download')}
                                </Button>
                                {profile?.Level > 0 && (
                                    <Button
                                        color="info"
                                        sx={{ mr: 2 }}
                                        variant="contained"
                                        startIcon={<Iconify icon="eva:save-fill" />}
                                        disabled={!isGenerated}
                                        onClick={handleSaveImage}
                                    >
                                        {!isMobile && t('fileManager.save')}
                                    </Button>
                                )}
                                <Button
                                    color="primary"
                                    variant="contained"
                                    startIcon={<Iconify icon="eva:printer-fill" />}
                                    disabled={!isGenerated}
                                    onClick={handlePrintImage}
                                >
                                    {!isMobile && t('fileManager.print')}
                                </Button>
                            </Stack>

                            <img src={generatedImage} alt="Generated" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                        </Stack>
                    ) : (
                        <Typography variant="body1">
                            {t("generation.boxContent")}
                        </Typography>
                    )}
                </ImageBox>
                {generateImageError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {t("generation.error")}: {generateImageError.message}
                    </Typography>
                )}
                
            </Container>

            <GenerationPrintDialog open={print} generatedImage={generatedImage} onClose={() => setPrint(false)} />

            <GenerationSaveDialog generatedImage={generatedImage} 
                                  open={save} 
                                  onClose={() => setSave(false)}
                                  setFileName={setFileName} 
                                  fileName={fileName}
                                    currentFolder={currentFolder}
                                    setCurrentFolder={setCurrentFolder}
                                    parentFolder={parentFolder}
                                    setParentFolder={setParentFolder}
                                  saveFile={handleSaveImageToStorage}
            />

            <GenerationIdeasDrawer existingText={prompt} 
                                   open={ideas} 
                                   onClose={() => setIdeas(false)} 
                                   setIdea={handleSetIdea} />
           
        </>
    );
}