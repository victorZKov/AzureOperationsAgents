import { useScroll } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeMinimal from '../home-minimal';
import HomePricing from '../home-pricing';
import HomeAdvertisement from '../home-advertisement';
import HomeBenefits from "../home-benefits";
import {useAuthContext} from "../../../auth/useAuthContext";
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

type StyledPolygonProps = {
  anchor?: 'top' | 'bottom';
};

const StyledPolygon = styled('div')<StyledPolygonProps>(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));

// ----------------------------------------------------------------------

export default function HomeView() {
    
    const {user} = useAuthContext();
    const navigate = useNavigate();
    
    if (user) {
        console.log('*************************************************************** user in home', user);
        navigate('/dashboard');
    }
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        {/*<HomeMinimal />*/}
        {/*  */}
        {/*  <HomeBenefits />*/}

        {/*<HomeHugePackElements />*/}

        {/*<Box sx={{ position: 'relative' }}>*/}
        {/*  <StyledPolygon />*/}
        {/*  <HomeForDesigner />*/}
        {/*  <StyledPolygon anchor="bottom" />*/}
        {/*</Box>*/}
        
        {/*<HomeDarkMode />*/}
        
        {/*<HomeColorPresets />*/}
        
        {/*<HomeCleanInterfaces />*/}

        {/*<HomePricing />*/}

        {/*<HomeLookingFor />*/}

        {/*<HomeAdvertisement />*/}
      </Box>
    </>
  );
}
