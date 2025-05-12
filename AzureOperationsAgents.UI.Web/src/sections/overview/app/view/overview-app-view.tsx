// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import { _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
import { MaintenanceIllustration } from 'src/assets/illustrations';
//
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import {useAuthContext} from "../../../../auth/useAuthContext";
import {useLocales} from "../../../../locales";
import {useEffect, useState} from "react";
import {useGetStorage} from "../../../../api/file";
import FileWidget from "../../../file-manager/file-widget";
import FileStorageOverview from "../../../file-manager/file-storage-overview";
import {Box} from "@mui/material";
import {useGetDashboard, useGetLatestImages} from "../../../../api/dashboard";
import { enqueueSnackbar } from 'src/components/snackbar';
import {ILatestImage, Series, SeriesData} from "../../../../types/dashboard";
import {SplashScreen} from "../../../../components/loading-screen";
import {Link} from "react-router-dom";
import {paths} from "../../../../routes/paths";
import {useGetUser} from "../../../../api/user";

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useAuthContext();
  const { profile } = useGetUser();
  const settings = useSettingsContext();
  const theme = useTheme();
  const { dashboard, dashboardError } = useGetDashboard();
  const { latestImages, latestImagesError } = useGetLatestImages();
  const {t} = useLocales();
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      console.log('user', user);
      console.log('user username', user.name);
      setUsername(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      console.log('profile', profile);
      console.log('profile username', profile.GivenName);
      setUsername(profile.GivenName);
    }
  }, [profile]);

  const [GB, setGB] = useState(0);
  
  const [usedGB, setUsedGB] = useState(0);
  
  const [difference, setDifference] = useState('0%');
  
  const [imagesSeries, setImagesSeries] = useState([
    {
        year: "",
        data: [
            {
          name: "",
          data: [0]
        }
        ],
        comparison: 0
    }
  ]);
  
  const [percOcupancy, setPercOcupancy] = useState(0);
  
  const [totalImages, setTotalImages] = useState(0);
  
  const [availableImages, setAvailableImages] = useState(0);
  
  const [usedImages, setUsedImages] = useState(0);
  
  const [totalImagesPercent, setTotalImagesPercent] = useState(0);
  

  
  const [_latestImages, setLatestImages] = useState<Array<ILatestImage> | null >(null);
  
  const [transformedCategories, setTransformedCategories] = useState<string[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [waitingMessage, setWaitingMessage] = useState<string>('Loading...');
  
  useEffect(() => {
    if ((dashboardError) && (dashboardError.length > 0)) {
      console.error(t('server-error'), dashboardError);
      enqueueSnackbar(t('server-error'), { variant: 'error' });
      setWaitingMessage(t('server-error'));
    }
  }, [dashboardError]);

  useEffect(() => {
  if (dashboard) {
    const dashboard1 = dashboard.Value;
    const totalSpace = dashboard1?.TotalSpace || 0;
    const usedSpace = dashboard1?.UsedSpace || 0;
    const totalImages = dashboard1?.TotalImages || 0;
    const usedImages = dashboard1?.UsedImages || 0;
    const series = dashboard1?.Series || [];

    setPercOcupancy(totalSpace ? Number(((usedSpace / 1024 / 1024) / totalSpace).toFixed(6)) : 0);
    setGB(totalSpace);
    setUsedGB(usedSpace);
    setTotalImages(totalImages - usedImages);
    setAvailableImages(totalImages - usedImages);
    setTotalImagesPercent(totalImages ? (usedImages / totalImages) * 100 : 0);
    setUsedImages(usedImages);

    const comparisonValue = series[0]?.Comparison || 100;
    setDifference(comparisonValue + '%');

    const transformedCategoriesValues = series[0]?.Data?.map((dataItem: SeriesData) => dataItem.Name) || [];
    setTransformedCategories(transformedCategoriesValues);

    const transformedSeries = series.map((item: Series) => ({
      year: item.Year,
      data: [
        {
          name: t('analytics.images'),
          data: item.Data?.map((dataItem: SeriesData) => dataItem.Data[0] || 0) || [],
        },
      ],
      comparison: item.Comparison,
    }));

    setImagesSeries(transformedSeries);
    setWaitingMessage(t('analytics.createnew'));
    setIsLoaded(true);
  } else {
    setPercOcupancy(0);
    setGB(0);
    setUsedGB(0);
    setTotalImages(0);
    setAvailableImages(10);
    setTotalImagesPercent(0);
    setUsedImages(0);
    setTransformedCategories([]);
    setImagesSeries([
      {
        year: "2025",
        data: [
          {
            name: "",
            data: [0]
          }
        ],
        comparison: 0
      }
    ]);
    setIsLoaded(false);
  }
  
}, [dashboard]);

  useEffect(() => {
    if (!latestImages) return;
    const latestImages1 = latestImages.Value;
    setLatestImages(latestImages1);
    }, [latestImages]);
  
  useEffect(() => {

    if (latestImagesError) {
      console.error(latestImagesError);
      enqueueSnackbar(latestImagesError, { variant: 'error' });
    }
  }, [latestImagesError]);
  
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {isLoaded && (
          <AppWelcome
            title={`${t("analytics.welcomeback")} 👋 \n ${username}`}
            description={t("analytics.createnew")}
            img={<SeoIllustration />}
            action={
              // <Button variant="contained" color="primary"
              //         onClick={() => {
              //           console.log('Create new');
              //           window.location.href = '/dashboard/generation';
              //           }}
              // >
              //   {t("analytics.gotocreate")}
              // </Button>
              <Box sx={{padding: 1, borderRadius: 5, bgcolor: '#7635dc', color: 'white'}}>
                <Link to={paths.dashboard.generation} style={{ textDecoration: 'none', cursor:'pointer', color: 'white', fontWeight: 'bold'}}

                >
                  {t("analytics.gotocreate")}
                </Link>
              </Box>
            }
          />
              )}
          {!isLoaded && (
              // <AppWelcome
              //     title={`${t("analytics.welcomeback")} 👋 \n ${user?.displayName}`}
              //     description={waitingMessage}
              //     img={<MaintenanceIllustration />}
              //     action={
              //       <Button variant="text" color='inherit' disabled={true} >
              //       </Button>
              //     }
              // />
              <SplashScreen message={waitingMessage} />
        
          )}
        </Grid>

        <Grid xs={12} md={4}>
          {_latestImages && (
          <AppFeatured list={_latestImages} />
            )}
        </Grid>


        <Grid xs={12} md={4} lg={4}>
          <AppCurrentDownload
            title={t("analytics.totalgenerated")}
            chart={{
              series: [
                { label: t("analytics.created") + " " + usedImages, value: usedImages },
                { label: t("analytics.available") + " " + totalImages, value: totalImages },
              ],
            }}
          />
        </Grid>
        
        <Grid xs={12} md={2} lg={2}>
          <FileStorageOverview
              total={GB}
              chart={{
                series: percOcupancy,
              }}
              data={[
                {
                  name: t("analytics.images"),
                  usedStorage: usedGB,
                  filesCount: usedImages,
                  icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
                }
              ]}
          />
          
        </Grid>

        {imagesSeries && (
        <Grid xs={12} md={6} lg={6}>
          {imagesSeries && (
              <Grid xs={12} md={8} lg={8}>
                <AppAreaInstalled
                    title={t("analytics.monthlygenerated")}
                    subheader={`(${difference}) ${t("analytics.lastyeardifference")}`}
                    chart={{
                      categories: transformedCategories, 
                      series: imagesSeries, 
                    }}
                />
              </Grid>
          )}
        </Grid>
        )}
      </Grid>
    </Container>
  );
}
