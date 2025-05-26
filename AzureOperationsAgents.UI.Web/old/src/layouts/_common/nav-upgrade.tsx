// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import {useAuthContext} from "../../auth/useAuthContext";
import { useSnackbar } from 'src/components/snackbar';
import {useEffect, useState} from "react";
import {useGetUser} from "../../api/user";
import {Link} from "react-router-dom";

// ----------------------------------------------------------------------

export default function NavUpgrade() {

  const { t } = useLocales();
  const { user } = useAuthContext();
  const { profile, userError } = useGetUser();
  
  
  const { enqueueSnackbar } = useSnackbar();
    
  const [level, setLevel] = useState('free');
  const [username, setUsername] = useState<string | null>(null);
  
  const [remainingImages, setRemainingImages] = useState(0);
  
  useEffect(() => {
    if (userError) {
      console.error(userError);
        enqueueSnackbar(userError, { variant: 'error' });
    }
  }
  , [userError]);
  
  useEffect(() => {
    if (profile) {
        if (profile.Level === 0) {
            setLevel('free');
        } else if (profile?.Level === 1) {
            setLevel('pers');
        } else if (profile?.Level === 2) {
            setLevel('pro');
        } else if (profile?.Level === 3) {
            setLevel('team');
        } else {
            setLevel('free');
        }
        setRemainingImages(profile.RemainingImages);
        setUsername(profile.GivenName);
    }
    }, [profile]);
  
  const tab = `${paths.dashboard.user.account}?tab=billing`;
  
  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 48, height: 48 }} />
          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
              {t(level)}({remainingImages})
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {username}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

          { level !== 'pro' && (
              <Box sx={{border: 1, borderColor:'purple', padding: 1, borderRadius: 5, bgcolor: '#7635dc', color: 'white'}}>
              <Link to={tab} style={{ textDecoration: 'none', cursor:'pointer', color: 'white', fontWeight: 'bold'}}
                    
              >
                  {level === 'free' ? t('upgrade_to_pers') : level === 'pers' ? t('upgrade_to_pro') : t('upgrade_to_team')}
              </Link>
              </Box>
            )}
            {/*<Button color="primary" */}
            {/*        variant="contained" */}
            {/*        onClick={() => {*/}
            {/*            console.log('Upgrade');*/}
            {/*            window.location.href = `${paths.dashboard.user.account}?tab=billing`;*/}
            {/*            */}
            {/*        }}*/}
            {/*>*/}
          {/*{level === 'free' ? t('upgrade_to_pers') : level === 'pers' ? t('upgrade_to_pro') : t('upgrade_to_team')}*/}
            {/*</Button>*/}
          {/*)}*/}
      </Stack>
    </Stack>
  );
}
