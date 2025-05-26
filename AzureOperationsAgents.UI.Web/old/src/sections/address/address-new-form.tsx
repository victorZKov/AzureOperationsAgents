import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// types
import { IAddressItem } from 'src/types/address';
// assets
//import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from 'src/components/hook-form';
import {useLocales} from "../../locales";
import {getCountries} from "../../assets/data";
// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (address: IAddressItem) => void;
};

export default function AddressNewForm({ open, onClose, onCreate }: Props) {
  
  const {t} = useLocales();
  const countries = getCountries(t);
  //console.log(countries);
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required(t('checkout-page.name-required')),
    //phoneNumber: Yup.string().required('Phone number is required'),
        country: Yup.string().required(t('checkout-page.country-required')),
    // not required
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    addressType: Yup.string(),
    zipCode: Yup.string(),
    primary: Yup.boolean(),
  });

  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
    primary: true,
    phoneNumber: '',
    addressType: 'Home',
    country: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({
        name: data.name,
        //phoneNumber: data.phoneNumber,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        addressType: data.addressType,
        primary: data.primary,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('checkout-page.new-address')}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{mt:1}}>

            <RHFTextField name="name" label={t('checkout-page.full-name')} />
            <RHFTextField name="address" label={t('checkout-page.address')} />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="city" label={t('checkout-page.city')} />

              <RHFTextField name="state" label={t('checkout-page.state')} />

              <RHFTextField name="zipCode" label={t('checkout-page.zip')} />
            </Box>

            <RHFAutocomplete
              name="country"
              label={t('checkout-page.country')}
              options={countries.map((country) => country.label)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const { code, label, phone } = countries.filter(
                  (country) => country.label === option
                )[0];

                if (!label) {
                  return null;
                }

                return (
                  <li {...props} key={label}>
                    <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    />
                    {label} ({code}) +{phone}
                  </li>
                );
              }}
            />

            <RHFCheckbox name="primary" label={t('checkout-page.use-address-by-default')} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {t('checkout-page.cancel')}
          </Button>

          <LoadingButton color="primary" type="submit" variant="contained" 
                         loading={isSubmitting}
                         onClick={onSubmit}
          >
            {t('checkout-page.invoice-to-this-address')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
