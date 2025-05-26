// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// components
import { useSettingsContext } from 'src/components/settings';
//
import { useCheckoutContext } from '../context';
import CheckoutCart from '../checkout-cart';
import CheckoutSteps from '../checkout-steps';
import CheckoutPayment from '../checkout-payment';
import CheckoutOrderComplete from '../checkout-order-complete';
import CheckoutBillingAddress from '../checkout-billing-address';
import { useLocales } from 'src/locales';
import {useAuthContext} from "../../../auth/useAuthContext";

// ----------------------------------------------------------------------

type CheckoutViewProps = {
  subscriptionType: string;
  usery: any; // Replace with proper user type if available
};

export default function CheckoutView({ subscriptionType, usery }: CheckoutViewProps) {

  const { t } = useLocales();
  const { user } = useAuthContext();
  
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  console.log('Subscription Type:', subscriptionType);
  console.log('Profile:', user?.homeAccountId);
  console.log('checkout', checkout);
  
  const PRODUCT_CHECKOUT_STEPS = [t('checkout-page.cart'), t('checkout-page.billing-details'), t('checkout-page.payment')];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        {t('checkout-page.title')}
      </Typography>

      <Grid container justifyContent={checkout.completed ? 'center' : 'flex-start'}>
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={checkout.activeStep} steps={PRODUCT_CHECKOUT_STEPS} />
        </Grid>
      </Grid>

      {checkout.completed ? (
        <CheckoutOrderComplete
          open={checkout.completed}
          onReset={checkout.onReset}
          onDownloadPDF={() => {}}
        />
      ) : (
        <>
          {checkout.activeStep === 0 && <CheckoutCart subscription={subscriptionType} />}

          {checkout.activeStep === 1 && <CheckoutBillingAddress />}

          {checkout.activeStep === 2 && checkout.billing && <CheckoutPayment />}
        </>
      )}
    </Container>
  );
}
