// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// assets
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import {useLocales} from "../../locales";
import {useState} from "react";
import {useGetUser} from "../../api/user";
import Cookies from 'js-cookie';
import { useAuthContext } from 'src/auth/useAuthContext';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';


// ----------------------------------------------------------------------

type Props = CardProps & {
  card: {
    subscription: string;
    price: number;
    caption: string;
    labelAction: string;
    lists: string[];
    cadence?: string;
  };
  index: number;
};

export default function PricingCard({ card, sx, ...other }: Props) {

  const {t} = useLocales();

  const router = useRouter(); 

  const { doLogin, user } = useAuthContext();

  const { profile } = useGetUser();

  const userLevel = profile?.Level ?? 0;

  const { subscription, price, caption, lists, labelAction, cadence } = card;

  const [showCommonOptions, setShowCommonOptions] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const handleShowCommonOptions = () => {
        setShowCommonOptions(!showCommonOptions);
    };

  const free = subscription === 'free';
  const personal = subscription === 'personal';
  const professional = subscription === 'professional';
  const team = subscription === 'team';
  let labelAction1 = card.labelAction;
  if ((free && userLevel === 0) || (personal && userLevel === 1) || (professional && userLevel === 2) || (team && userLevel === 3)) {
    labelAction1 = t('pricing-plan.current-plan');
    setButtonDisabled(true);
    console.log('buttonDisabled', buttonDisabled);
  }

    const handleLoginAD = async () => {
        try {
            if (user === null) {
                await doLogin();
            }
            if (user) {
                const host = window.location.host;
                if (host === 'localhost:8032') {
                    const newLocation = `http://${host}/dashboard`;
                    window.location.href = newLocation;
                }
                else
                {
                    const newLocation = `https://${host}/dashboard`;
                    window.location.href = newLocation;
                }

            } else {
                console.log('User is still null after login attempt');
            }
        } catch (error) {
            console.error(error);
        }
    };
  
    const handleSubscribe = () => {
        console.log('handleSubscribe');
        // Save subscription type to cookie
        Cookies.set('subscriptionType', subscription, { expires: 7 });
        // Save a value in a cookie to remember to go to pay
        Cookies.set('redirectToPayment', 'true', { expires: 1 });
        handleLoginAD();
        router.push(paths.dashboard.root);

    };
  
  const renderIcon = (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box sx={{ width: 48, height: 48 }}>
        {free && <PlanFreeIcon />}
        {personal && <PlanStarterIcon />}
        {professional && <PlanPremiumIcon />}
        {team && <PlanPremiumIcon />}
      </Box>

      {free && <Label color="info">{t('pricing-plans.popular')}</Label>}
    </Stack>
  );

  const renderSubscription = (
    <Stack spacing={1}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
        {subscription}
      </Typography>
      <Typography variant="subtitle2">{caption}</Typography>
    </Stack>
  );

  const renderPrice = free ? (
      <Typography variant="h2">{t("pricing-plans.free")}</Typography>
    
  ) : (
    <Stack direction="row">
      <Typography variant="h4">€</Typography>

      <Typography variant="h2">{price}</Typography>
      <Typography
        component="span"
        sx={{
          alignSelf: 'center',
          color: 'text.disabled',
          ml: 1,
          typography: 'body2',
        }}
      >
          
              / {cadence}
          
      </Typography>
    </Stack>
  );
  const commonoptions = t('pricing-plans.options-in-free').split(',');
  
  const renderList = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box component="span" sx={{ typography: 'overline' }}>
            {t('pricing-plans.features')}
        </Box>
          {!free && (
              <Link variant="body2" color="inherit" underline="always" onClick={handleShowCommonOptions}>
                  {t('pricing-plans.all')}
              </Link>
          )}
      </Stack>
        {showCommonOptions && commonoptions.map((item) => (
            <Stack
                key={item}
                spacing={1}
                direction="row"
                alignItems="center"
                sx={{
                    typography: 'body2',
                }}
            >
                <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
                {item}
            </Stack>
        ))}
      {lists.map((item) => (
        <Stack
          key={item}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
          {item}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        borderRadius: 2,
        boxShadow: (theme) => ({
          xs: theme.customShadows.card,
          md: 'none',
        }),
        ...(personal && {
          borderTopRightRadius: { md: 0 },
          borderBottomRightRadius: { md: 0 },
        }),
        ...((personal || professional) && {
          boxShadow: (theme) => ({
            xs: theme.customShadows.card,
            md: `-40px 40px 80px 0px ${alpha(
              theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
              0.16
            )}`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {renderIcon}

      {renderSubscription}

      {renderPrice}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderList}

      <Button
        fullWidth
        size="large"
        color="primary"
        variant="contained"
        disabled={buttonDisabled}
        onClick={handleSubscribe}
      >
        {labelAction1}
      </Button>
    </Stack>
  );
}
