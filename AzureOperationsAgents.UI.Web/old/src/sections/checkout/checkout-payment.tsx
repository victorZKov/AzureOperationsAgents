import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import FormProvider from 'src/components/hook-form';
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutBillingInfo from './checkout-billing-info';
import {useLocales} from "../../locales";


export default function CheckoutPayment() {
  
  const { t } = useLocales();
  
  const checkout = useCheckoutContext();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      checkout.onNextStep();
      checkout.onReset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>


        <Grid xs={12} md={8}>
          <CheckoutBillingInfo billing={checkout.billing} onBackStep={checkout.onBackStep} />

          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={onSubmit}
          >
            {t('checkout-page.pay')}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
