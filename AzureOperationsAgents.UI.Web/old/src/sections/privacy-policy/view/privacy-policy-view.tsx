import {useLocales} from "../../../locales";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Divider from "@mui/material/Divider";

export default function PrivacyPolicyView() {
  const {t} = useLocales();

  return (
    <Container maxWidth="md">
      <Box sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {`${t('privacyPolicy')}`}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {`${t('thePrivacyPolicy')}`}
        </Typography>
      </Box>
    </Container>
  );
}
