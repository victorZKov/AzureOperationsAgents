// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgBlur } from 'src/theme/css';
// routes
import { paths } from 'src/routes/paths';
// components
import Logo from 'src/components/logo';
import Label from 'src/components/label';
//
import { HEADER } from '../config-layout';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
//
import {SettingsButton, HeaderShadow, LoginButton, LanguagePopover} from '../_common';
import {VERSION} from "../../config-global";
import {useLocales} from "../../locales";
import Iconify from "../../components/iconify";
import {useAuthContext} from "../../auth/useAuthContext";

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();
  const {t} = useLocales();
  const {user} = useAuthContext();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

    const navConfig = [
        {
            title: t('main-menu.home'),
            icon: <Iconify icon="solar:home-2-bold-duotone" />,
            path: '/',
        },
        // {
        //     title: t('main-menu.pricing'),
        //     icon: <Iconify icon="solar:atom-bold-duotone" />,
        //     path: paths.pricing,
        // },
        // { title: t('main-menu.about'), path: paths.about },
        // { title: t('main-menu.contact'), path: paths.contact },
        // { title: t('main-menu.faqs'), path: paths.faqs },

    ];
    
  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
            badgeContent={
              <Link
                href={paths.changelog}
                target="_blank"
                rel="noopener"
                underline="none"
                sx={{ ml: 1 }}
              >
                {/*<Label color="info" sx={{ml:11, textTransform: 'unset', height: 22, px: 0.5 }}>*/}
                {/*  {VERSION}*/}
                {/*</Label>*/}
              </Link>
            }
          >
            <Logo />
          </Badge>
          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} data={navConfig} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>

            <LanguagePopover />

            {(mdUp && !user) && <LoginButton />}

            {/*<SettingsButton*/}
            {/*  sx={{*/}
            {/*    ml: { xs: 1, md: 0 },*/}
            {/*    mr: { md: 2 },*/}
            {/*  }}*/}
            {/*/>*/}

            {!mdUp && <NavMobile offsetTop={offsetTop} data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
