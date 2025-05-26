import {Card, CardContent, Typography, Grid, Box, Divider} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';

export const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const examples = [
        {
            title: t("example1Title"),
            description: t("example1Description"),
            action: () => handleNavigation("/example1")
        },
        {
            title: t("example2Title"),
            description: t("example2Description"),
            action: () => handleNavigation("/example2")
        },
        {
            title: t("example3Title"),
            description: t("example3Description"),
            action: () => handleNavigation("/example3")
        },
        {
            title: t("example4Title"),
            description: t("example4Description"),
            action: () => handleNavigation("/example4")
        }
    ];

    return (
        <Box textAlign="center" mt={4}>
            <Typography variant="h4" gutterBottom>
                {t("welcomeMessage")}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {t("homepageDescription")}
            </Typography>
            <Box mt={2}>
                <Link to="/settings" style={{ textDecoration: 'none', margin: '0 10px' }}>
                    <Button variant="outlined" color="secondary">
                        {t("configureSettings")}
                    </Button>
                </Link>
                <Link to="/chat" style={{ textDecoration: 'none', margin: '0 10px' }}>
                    <Button variant="contained" color="primary">
                        {t("startChat")}
                    </Button>
                </Link>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Grid container spacing={2} justifyContent="center" mt={8}>
                {examples.map((example, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {example.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {example.description}
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={example.action}
                                >
                                    {t("learnMore")}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
