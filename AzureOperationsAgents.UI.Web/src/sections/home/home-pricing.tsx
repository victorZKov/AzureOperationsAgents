import { useState, useCallback } from 'react';
import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';

// components
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

export default function HomePricing() {
    const {t} = useLocales();

    const _homePlans = [...Array(3)].map((_, index) => ({
        license: [t('pricing-plans.free'), t('pricing-plans.personal'), t('pricing-plans.team')][index],
        commons: ['One user', '10 free images', '12 months of support'],
        options: [
            'JavaScript version',
            'TypeScript version',
            'Design Resources',
            'Commercial applications',
        ],
        icons: [
            '/assets/icons/platforms/ic_figma.svg',
            '/assets/icons/platforms/ic_js.svg',
            '/assets/icons/platforms/ic_ts.svg',
        ],
    }));
    
    const licenseFree = {
        license: t('pricing-plans.free'),
        commons: t('pricing-plans.common-options').split(','),
        options: [],
        icons: [],
    }
    const licensePersonal = {
        license: t('pricing-plans.personal'),
        commons: t('pricing-plans.common-options').split(','),
        options: t('pricing-plans.personal-options').split(','),
        icons: [],
    }
    
    const licenseProfessional = {
        license: t('pricing-plans.professional'),
        commons: t('pricing-plans.common-options').split(','),
        options: t('pricing-plans.professional-options').split(','),
        icons: [],
    }
    
    const licenseTeam = {
        license: t('pricing-plans.team'),
        commons: t('pricing-plans.common-options').split(','),
        options: t('pricing-plans.team-options').split(','),
        icons: [],
    }
    
  const mdUp = useResponsive('up', 'md');

  const [currentTab, setCurrentTab] = useState('Standard');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderDescription = (
    <Stack spacing={3} sx={{ mb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
            {t('pricing-plans.title')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography variant="h2">
            {t('pricing-plans.description1')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
            {t('pricing-plans.description2')}
        </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <>
      {mdUp ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          sx={{
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
            <PlanCard
                key={t('pricing-plans.free')}
                plan={licenseFree}
                sx={{
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
            />
            <PlanCard
                key={t('pricing-plans.personal')}
                plan={licensePersonal}
                sx={{
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
            />
            <PlanCard
                key={t('pricing-plans.professional')}
                plan={licenseProfessional}
                sx={{
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
            />
            <PlanCard
                key={t('pricing-plans.team')}
                plan={licenseTeam}
                sx={{
                    borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
            />
        </Box>
      ) : (
        <>
          <Stack alignItems="center" sx={{ mb: 5 }}>
              <PlanCard
                  key={t('pricing-plans.free')}
                  plan={licenseFree}
                  sx={{
                      borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
              />
              <PlanCard
                  key={t('pricing-plans.personal')}
                  plan={licensePersonal}
                  sx={{
                      borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
              />
              <PlanCard
                  key={t('pricing-plans.professional')}
                  plan={licenseProfessional}
                  sx={{
                      borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
              />
              <PlanCard
                  key={t('pricing-plans.team')}
                  plan={licenseTeam}
                  sx={{
                      borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
              />
          </Stack>

          <Box
            sx={{
              borderRadius: 2,
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
             
          </Box>
        </>
      )}

      <m.div variants={varFade().in}>
        <Box
          sx={{
            textAlign: 'center',
            mt: {
              xs: 5,
              md: 10,
            },
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography variant="h4">{t('pricing-plans.still-have-questions')}</Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
                {t('pricing-plans.describe-your-issue')}
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Button
              color="inherit"
              size="large"
              variant="contained"
              href="mailto:support@minimals.cc?subject=[Feedback] from Customer"
            >
                {t('pricing-plans.contact-us')}
            </Button>
          </m.div>
        </Box>
      </m.div>
    </>
  );

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Container component={MotionViewport}>
        {renderDescription}

        {renderContent}
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

interface PlanCardProps extends StackProps {
  plan: {
    license: string;
    commons: string[];
    options: string[];
    icons: string[];
  };
}

function PlanCard({ plan, sx, ...other }: PlanCardProps) {
    
    const {t} = useLocales();
    
  const { license, commons, options, icons } = plan;

  const standard = license === 'Standard';

  const plus = license === 'Standard Plus';

  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        pt: 10,
        ...(plus && {
          borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...sx,
        }),
      }}
      {...other}
    >
      <Stack spacing={2}>
        <Typography variant="overline" component="div" sx={{ color: 'text.disabled' }}>
            {t('pricing-plans.license')}
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <Typography variant="h4">{license}</Typography>
          <Box
            sx={{
              left: 0,
              bottom: 4,
              width: 40,
              height: 8,
              opacity: 0.48,
              bgcolor: 'error.main',
              position: 'absolute',
              ...(standard && { bgcolor: 'primary.main' }),
              ...(plus && { bgcolor: 'warning.main' }),
            }}
          />
        </Box>
      </Stack>

      {standard ? (
        <Box component="img" src={icons[1]} sx={{ width: 20, height: 20 }} />
      ) : (
        <Stack direction="row" spacing={2}>
          {icons.map((icon) => (
            <Box component="img" key={icon} src={icon} sx={{ width: 20, height: 20 }} />
          ))}
        </Stack>
      )}

      <Stack spacing={2.5}>
        {commons.map((option) => (
          <Stack key={option} spacing={1} direction="row" alignItems="center">
            <Iconify icon="eva:checkmark-fill" width={16} />
            <Typography variant="body2">{option}</Typography>
          </Stack>
        ))}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {options.map((option, optionIndex) => {
          const disabled =
            (standard && optionIndex === 1) ||
            (standard && optionIndex === 2) ||
            (standard && optionIndex === 3) ||
            (plus && optionIndex === 3);

          return (
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{
                ...(disabled && { color: 'text.disabled' }),
              }}
              key={option}
            >
              <Iconify icon={disabled ? 'mingcute:close-line' : 'eva:checkmark-fill'} width={16} />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          );
        })}
      </Stack>

      <Stack alignItems="flex-end">
        <Button
          color="inherit"
          size="small"
          target="_blank"
          rel="noopener"
          href={paths.pricing}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
            {t('pricing-plans.learn-more')}
        </Button>
      </Stack>
    </Stack>
  );
}
