import * as Yup from 'yup';
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import {useLocales} from "../../locales";
import {getCountries} from "../../assets/data";
import {useCreateProfile}from "../../api/user";
import {yupResolver} from "@hookform/resolvers/yup";
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'src/components/snackbar';
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import {Stack} from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import Iconify from "../../components/iconify";

const Register: React.FC = () => {
  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const countries = getCountries(t);
  const createProfile = useCreateProfile();

  const CreateUserSchema = Yup.object().shape({
    firstName: Yup.string().required(t('profile.name-required')),
    lastName: Yup.string().required(t('profile.surname-required')),
    email: Yup.string().email(t('profile.email-invalid')).required(t('profile.email-required')),
    password: Yup.string()
        .required(t('auth.password-required'))
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            t('auth.password-invalid')
        ),
    confirmPassword: Yup.string().required(t('auth.password-mismatch')),
    country: Yup.string().required(t('profile.country-required')),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  };

  const methods = useForm({
    resolver: yupResolver(CreateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createProfile(data);
      enqueueSnackbar(t('profile.profile-created'), { variant: 'success' });
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('profile.profile-created-failed'), { variant: 'error' });
      alert(t('profile.profile-created-failed')+' '+error);
    }
  });

  return (
    <Container>
        <Typography variant="h4" paragraph>
            {t('profile.create-profile')}
        </Typography>
      <Box minHeight="50vh"  >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center">
            <Grid xs={12} sm={6}>
              <Card sx={{ p: 3, minHeight: '400px', maxWidth:'100%' }}>
                <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns="repeat(1, 1fr)">
                  <RHFTextField
                    name="firstName"
                    label={t('profile.name')}
                    fullWidth
                  />
                  <RHFTextField
                    name="lastName"
                    label={t('profile.surname')}
                    fullWidth
                  />
                  <RHFTextField
                    name="email"
                    label={t('profile.email')}
                    fullWidth
                  />
                  <RHFTextField
                    name="password"
                    label={t('auth.password')}
                    type="password"
                    fullWidth
                  />
                  <RHFTextField
                    name="confirmPassword"
                    label={t('auth.confirm-password')}
                    type="password"
                    fullWidth
                  />
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
                </Box>
                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    color="primary"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {t('profile.save-changes')}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default Register;