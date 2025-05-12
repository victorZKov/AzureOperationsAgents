import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// utils
import { fData } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import {useGetUser, useUpdateProfile} from "../../api/user";
import {useLocales} from "../../locales";
import {getCountries} from "../../assets/data";
import {api, endpoints} from "../../utils/axios";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { profile } = useGetUser();
  
  const {t} = useLocales();
  
  const countries = getCountries(t);
  
  const updateProfile = useUpdateProfile();

    const [photoURL, setPhotoURL] = useState<string | null>(
        typeof profile?.PhotoURL === 'string'
            ? profile?.PhotoURL
            : profile?.PhotoURL?.preview ?? null
    );

  const UpdateUserSchema = Yup.object().shape({
    givenName: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    email: Yup.string(),
    photoURL: Yup.mixed<any>().nullable(),
    country: Yup.string().required('Country is required'),
    address: Yup.string(),
    state: Yup.string(),
    city: Yup.string(),
    zipCode: Yup.string()
  });

  const defaultValues = {
    givenName: profile?.GivenName || '',
    surname : profile?.Surname || '',
    email: profile?.Email || '',
    photoURL: profile?.PhotoURL || null,
    country: profile?.Country || '',
    address: profile?.Address || '',
    state: profile?.State || '',
    city: profile?.City || '',
    zipCode: profile?.ZipCode || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
    const {
        setValue,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    
    useEffect(() => {
        if (!profile) return;
        if (profile.PhotoURL) {
            if (profile.PhotoURL === photoURL) return; // Skip if the URL hasn't changed
            // Check if PhotoURL is a string or a CustomFile
            const resolvedPhotoURL =
                typeof profile.PhotoURL === 'string'
                    ? profile.PhotoURL // Use directly if it's a string
                    : profile.PhotoURL.preview ?? null; // Use `preview` for CustomFile

            setPhotoURL(resolvedPhotoURL); // Assign the resolved URL to state
        }
        if (profile){
            const updatedValues = {
                givenName: profile?.GivenName || '',
                surname: profile?.Surname || '',
                email: profile?.Email || '',
                photoURL: profile?.PhotoURL || null,
                country: profile?.Country || '',
                address: profile?.Address || '',
                state: profile?.State || '',
                city: profile?.City || '',
                zipCode: profile?.ZipCode || '',
            };
            reset(updatedValues);
        }
    }, [profile, reset]);
  


    const onSubmit = handleSubmit(async (data) => {
        try {
            const result = await updateProfile(data);
            enqueueSnackbar(result.Value);
            //enqueueSnackbar(t('profile.update-success'));
            //console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    const handleDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            if (!file) return;

            // Create a FormData object to send the file
            const formData = new FormData();
            formData.append('file', file);

            try {
                const URL = endpoints.user.photo;
                const response = await api.post(URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('File uploaded:', response.data);
                const photoUrl = response.data.Value;

                // Set the URL in your form or state
                setValue('photoURL', photoUrl, { shouldValidate: true });
                setPhotoURL(photoUrl);
            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle error (e.g., show a notification)
            }
        },
        [setValue]
    );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
              <RHFUploadAvatar
                  name="photoURL"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  defaultValue={photoURL || ''} // Ensure a string is always passed
                  helperText={
                      <Typography
                          variant="caption"
                          sx={{
                              mt: 3,
                              mx: 'auto',
                              display: 'block',
                              textAlign: 'center',
                              color: 'text.disabled',
                          }}
                      >
                          {t('profile.allowed')} *.jpeg, *.jpg, *.png, *.gif
                          <br />
                          {t('max-size')} {fData(3145728)}
                      </Typography>
                  }
              />

            

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              {t('profile.delete-user')}
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
                <RHFTextField name="givenName" label={t('profile.name')}/>              
                <RHFTextField name="surname" label={t('profile.surname')}/>
                <RHFTextField name="email" label={t('profile.email')}/>
                <RHFTextField name="address" label={t('profile.address')}/>

                <RHFAutocomplete
                    name="country"
                    label={t('profile.country')}
                    options={countries.map((country) => country.label)}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => {
                        const { code, label, phone } = countries.find(
                            (country) => country.label === option
                        ) || {};
                        if (!label) return null;
                        return (
                            <li {...props} key={label}>
                                <Iconify
                                    icon={`circle-flags:${code ? code?.toLowerCase() || 'unknown' : 'unknown'}`}
                                    width={28}
                                    sx={{ mr: 1 }}
                                />
                                {label} ({code}) +{phone}
                            </li>
                        );
                    }}
                />

              <RHFTextField name="state" label={t('profile.state')}/>
              <RHFTextField name="city" label={t('profile.city')}/>
              <RHFTextField name="zipCode" label={t('profile.zip')}/>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              

              <LoadingButton 
                  color="primary" 
                  type="submit" 
                  variant="contained"                              
                  loading={isSubmitting}>
                {t('profile.save-changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
