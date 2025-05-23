// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
// _mock
import { _addressBooks } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import { AddressNewForm, AddressItem } from '../address';
import {useState} from "react";
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  
  const {t} = useLocales();
  
  const checkout = useCheckoutContext();

  const addressForm = useBoolean();
  const [address, setAddress] = useState(null);

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {/*{ address && (*/}
          
          {/*  <AddressItem*/}
          {/*    key={address.id}*/}
          {/*    address={address}*/}
          {/*    action={*/}
          {/*      <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>*/}
          {/*        /!*{!address.primary && (*!/*/}
          {/*        /!*  <Button size="small" color="error" sx={{ mr: 1 }}>*!/*/}
          {/*        /!*    {t('checkout-page.delete-address')}*!/*/}
          {/*        /!*  </Button>*!/*/}
          {/*        /!*)}*!/*/}
          {/*        <Button*/}
          {/*          variant="outlined"*/}
          {/*          size="small"*/}
          {/*          onClick={() => checkout.onCreateBilling(address)}*/}
          {/*        >*/}
          {/*          {t('checkout-page.invoice-to-this-address')}*/}
          {/*        </Button>*/}
          {/*      </Stack>*/}
          {/*    }*/}
          {/*    sx={{*/}
          {/*      p: 3,*/}
          {/*      mb: 3,*/}
          {/*      borderRadius: 2,*/}
          {/*      boxShadow: (theme) => theme.customShadows.card,*/}
          {/*    }}*/}
          {/*  />*/}
          
          {/*    )}*/}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              {t('checkout-page.back-to-cart')}
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('checkout-page.new-address')}
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
          />
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={checkout.onCreateBilling}
      />
    </>
  );
}
