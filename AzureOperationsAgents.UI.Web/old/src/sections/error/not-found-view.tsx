import { m } from 'framer-motion';
// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
// assets
import { PageNotFoundIllustration } from 'src/assets/illustrations';
import {useLocales} from "../../locales";
import {useGetUser} from "../../api/user";

// ----------------------------------------------------------------------

export default function NotFoundView() {
    
    const { t } = useLocales();
    
    const { profile } = useGetUser();
    
    
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
            {t('notFound.title')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
            {t('notFound.subTitle')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <PageNotFoundIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>
        {!profile ?
      <Button component={RouterLink} href="/" size="large" variant="contained">
          {t('notFound.goHome')}
      </Button>
:
        <Button component={RouterLink} href="/dashboard" size="large" variant="contained">
            {t('notFound.goDashboard')}
        </Button>
        }
    </MotionContainer>
  );
}
