import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IPaymentCard } from 'src/types/payment';
import { IAddressItem } from 'src/types/address';
// assets
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
//
import { AddressListDialog } from '../address';
import PaymentCardListDialog from '../payment/payment-card-list-dialog';
import {useLocales} from "../../locales";
import {Typography} from "@mui/material";
import {useUpgradePlan} from "../../api/user";
import {useSnackbar} from "../../components/snackbar";

// ----------------------------------------------------------------------

type Props = {
  cardList: IPaymentCard[];
  addressBook: IAddressItem[];
  plans: {
    subscription: string;
    price: number;
    primary: boolean;
  }[];
};

export default function AccountBillingPlan({ cardList, addressBook, plans }: Props) {
    
    const {t} = useLocales();

    const { enqueueSnackbar } = useSnackbar();
    
    const upgradePlan  = useUpgradePlan();

  const [selectedPlan, setSelectedPlan] = useState('');

const handleSelectPlan = useCallback(
  (newValue: string) => {
    const currentPlan = plans.filter((plan) => plan.primary)[0].subscription;
    if (currentPlan !== newValue && newValue !== t('pricing-plans.team')) {
      setSelectedPlan(newValue);
    }
  },
  [plans, t]
);
  
    const handleCancelPlan = useCallback(() => {
        //console.log("CANCEL PLAN");
        setSelectedPlan('');
    }, []);

    const handleUpgradePlan = useCallback(async () => {
        console.log("UPGRADE PLAN");
        try {
            const result = await upgradePlan(selectedPlan);
            console.log("UPGRADE PLAN RESULT => ", result);
            if(result.StatusCode === 400){
                enqueueSnackbar(result.Value, { variant: 'error' });
            }
            if (result.StatusCode === 200 && result.Value) {
                window.open(result.Value, '_blank');
            }
        } catch (error) {
            console.error('Failed to upgrade plan:', error);
        }
        setSelectedPlan('');
    }, [selectedPlan, upgradePlan]);


  const renderPlans = plans.map((plan) => (
    <Grid xs={12} md={4} key={plan.subscription}>
      <Stack
        component={Paper}
        variant="outlined"
        
        onClick={() => handleSelectPlan(plan.subscription)}
        sx={{
          p: 2.5,
          position: 'relative',
          cursor: 'pointer',
          ...(plan.primary && {
            opacity: 0.48,
            cursor: 'default',
          }),
          ...(plan.subscription === selectedPlan && {
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
          }),
        }}
      >
        {plan.primary && (
          <Label
            color="info"
            startIcon={<Iconify icon="eva:star-fill" />}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
              {t('pricing-plans.current-plan')}
          </Label>
        )}

        <Box sx={{ width: 48, height: 48 }}>
            {/*{plan.subscription}*/}
          {plan.subscription === t('pricing-plans.free') && <PlanFreeIcon />}
          {plan.subscription === t('pricing-plans.personal') && <PlanStarterIcon />}
          {plan.subscription === t('pricing-plans.professional') && <PlanPremiumIcon />}
            {plan.subscription === t('pricing-plans.team') &&
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}> 
                {t('coming-soon')}
            </Typography>
                }
        </Box>

        <Box
          sx={{
            typography: 'subtitle2',
            mt: 2,
            mb: 0.5,
            textTransform: 'capitalize',
          }}
        >
          {plan.subscription}
        </Box>

        <Stack direction="row" alignItems="center" sx={{ typography: 'h4' }}>
          {plan.price || '0'}

          {!!plan.price && (
            <Box component="span" sx={{ typography: 'body2', color: 'text.disabled', ml: 0.5 }}>
                {t('pricing-plans.slash-month')}
            </Box>
          )}

        </Stack>
      </Stack>
    </Grid>
  ));

  return (
    <>
      <Card>
        <CardHeader title="Plan" />

        <Grid container spacing={2} sx={{ p: 3 }}>
          {renderPlans}
        </Grid>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3 }}>
          <Button variant="outlined"
                  disabled={!selectedPlan}
                    onClick={handleCancelPlan}
          >
              {t('pricing-plans.cancel-plan')}
          </Button>
          <Button color="primary" 
                  variant="contained"
                  disabled={!selectedPlan}
                  onClick={handleUpgradePlan}
          >
              {t('pricing-plans.upgrade-plan')}
          </Button>
        </Stack>
      </Card>

     
    </>
  );
}
