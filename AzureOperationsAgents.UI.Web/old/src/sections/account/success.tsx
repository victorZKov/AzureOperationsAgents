import { m } from 'framer-motion';
// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
// assets
import { OrderCompleteIllustration } from 'src/assets/illustrations';
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

export default function Success({ isProfile }: { isProfile: boolean }) {
    
    const { t } = useLocales();
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
            {!isProfile ? t('checkout-page.payment-success') : t('profile.profile-created')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
            {!isProfile ? t('checkout-page.payment-success-description') : t('profile.profile-created-description')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <OrderCompleteIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
          {t('checkout-page.return-to-shop')}
      </Button>
    </MotionContainer>
  );
}
