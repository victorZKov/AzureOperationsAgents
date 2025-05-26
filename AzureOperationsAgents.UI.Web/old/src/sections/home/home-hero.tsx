import {m, useScroll} from 'framer-motion';
import {useCallback, useEffect, useRef, useState} from 'react';
// @mui
import {alpha, styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
//import Link from '@mui/material/Link';
import {Link} from "react-router-dom";

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// routes
import {paths} from 'src/routes/paths';

// hooks
import {useResponsive} from 'src/hooks/use-responsive';
// theme
import {bgBlur, bgGradient, textGradient} from 'src/theme/css';
// layouts
import {HEADER} from 'src/layouts/config-layout';
// components
import Iconify from 'src/components/iconify';
import {RouterLink} from 'src/routes/components';
import {MotionContainer, varFade} from 'src/components/animate';
import {useLocales} from "../../locales";
import {useAuthContext} from 'src/auth/useAuthContext';
import {VERSION} from "../../config-global";
import {LoginButton} from "../../layouts/_common";

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_3.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    marginTop: HEADER.H_DESKTOP_OFFSET,
  },
}));

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  marginBottom: 24,
  letterSpacing: 8,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${64 / 16}rem`,
  fontFamily: "'Barlow', sans-serif",
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 16}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  top: -80,
  width: 480,
  right: -80,
  height: 480,
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

type StyledPolygonProps = {
  opacity?: number;
  anchor?: 'left' | 'right';
};

const StyledPolygon = styled('div')<StyledPolygonProps>(
  ({ opacity = 1, anchor = 'left', theme }) => ({
    ...bgBlur({
      opacity,
      color: theme.palette.background.default,
    }),
    zIndex: 9,
    bottom: 0,
    height: 80,
    width: '50%',
    position: 'absolute',
    clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
    ...(anchor === 'left' && {
      left: 0,
      ...(theme.direction === 'rtl' && {
        transform: 'scale(-1, 1)',
      }),
    }),
    ...(anchor === 'right' && {
      right: 0,
      transform: 'scaleX(-1)',
      ...(theme.direction === 'rtl' && {
        transform: 'scaleX(1)',
      }),
    }),
  })
);

// ----------------------------------------------------------------------

export default function HomeHero() {

  const { t } = useLocales();

  const { doLogin, user } = useAuthContext();

    const handleLogin = async () => {
        try {
            if (user === null) {
                await doLogin();
            }
            if (user) {
                const host = window.location.host;
                if (host === 'localhost:8032') {
                    window.location.href = `http://${host}/dashboard`;
                }
                else 
                {
                    window.location.href = `https://${host}/dashboard`;
                }
                
            } else {
                console.log('User is still null after login attempt');
            }
        } catch (error) {
            console.error(error);
        }
    };

  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const heroRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  const isLight = theme.palette.mode === 'light';

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 60 * 4,
    repeat: Infinity,
  } as const;

  const opacity = 1 - percent / 100;

  const hide = percent > 120;

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        mx: 'auto',
        maxWidth: 480,
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        },
      }}
    >
      <m.div variants={varFade().in}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
          }}
        >
          {t("landing.title")}
        </Typography>
            <Typography
                variant="h2"
                sx={{
                    textAlign: 'center',
                }}
            >
          {t("landing.title2")}
        </Typography>
      </m.div>

      {/*<m.div variants={varFade().in}>*/}
      {/*  <StyledTextGradient*/}
      {/*    animate={{ backgroundPosition: '200% center' }}*/}
      {/*    transition={{*/}
      {/*      repeatType: 'reverse',*/}
      {/*      ease: 'linear',*/}
      {/*      duration: 20,*/}
      {/*      repeat: Infinity,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {t("product-name")}*/}
      {/*  </StyledTextGradient>*/}
      {/*</m.div>*/}
        
        <m.div variants={varFade().in}>
            <Typography variant="body2" sx={{textAlign: 'center'}}>
                {t("landing.slogan")}
            </Typography>
        </m.div>

        

        <m.div variants={varFade().in}>
            <Stack spacing={1.5} direction={{xs: 'column-reverse', sm: 'row'}} sx={{mb: 5}}>
                <Stack alignItems="center" spacing={2}>
                {user ? (
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        {t('welcome')} <br /> {user?.displayName}
                    </Typography>
                ) : (
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        
                    </Typography>
              )}
                    
            <LoginButton />
                  
            
          </Stack>


        </Stack>
      </m.div>
 
      {/*<Stack spacing={3} sx={{ textAlign: 'center' }}>*/}
      {/*  <m.div variants={varFade().in}>*/}
      {/*    <Typography variant="overline" sx={{ opacity: 0.4 }}>*/}
      {/*        {VERSION}:{t('landing.available-on')}*/}
      {/*    </Typography>*/}
      {/*  </m.div>*/}
      
      {/*  */}
      {/*</Stack>*/}
    </Stack>
  );

  const renderSlides = (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        height: '150%',
        position: 'absolute',
        opacity: opacity > 0 ? opacity : 0,
        transform: `skew(${-16 - percent / 24}deg, ${4 - percent / 16}deg)`,
        ...(theme.direction === 'rtl' && {
          transform: `skew(${16 + percent / 24}deg, ${4 + percent / 16}deg)`,
        }),
      }}
    >

    </Stack>
  );

  const renderPolygons = (
    <>
      <StyledPolygon />
      <StyledPolygon anchor="right" opacity={0.48} />
      <StyledPolygon anchor="right" opacity={0.48} sx={{ height: 48, zIndex: 10 }} />
      <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
    </>
  );

  const renderEllipses = (
    <>
      {mdUp && <StyledEllipseTop />}
      <StyledEllipseBottom />
    </>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <StyledWrapper>
          <Container component={MotionContainer} sx={{ height: 1 }}>
            <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
              <Grid xs={12} md={6}>
                {renderDescription}
              </Grid>

              {mdUp && <Grid md={6}>{renderSlides}</Grid>}
            </Grid>
          </Container>

          {renderEllipses}
        </StyledWrapper>
      </StyledRoot>

      {mdUp && renderPolygons}

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
