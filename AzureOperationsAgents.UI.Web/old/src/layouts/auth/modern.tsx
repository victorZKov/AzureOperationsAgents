// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import Badge, {badgeClasses} from "@mui/material/Badge";
import Link from "@mui/material/Link";
import {paths} from "../../routes/paths";
import Label from "../../components/label";
import {VERSION} from "../../config-global";

// ----------------------------------------------------------------------

type Props = {
  image?: string;
  children: React.ReactNode;
};

export default function AuthModernLayout({ children, image }: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
      }}
    >
        <Badge
            sx={{
                [`& .${badgeClasses.badge}`]: {
                    mt: { xs: 2, md: 8 },
                    mb: { xs: 10, md: 8 },
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
                    <Label color="info" sx={{
                        ml:-35, 
                        textTransform: 'unset', height: 22, px: 0.5 }}>
                        {VERSION}
                    </Label>
                </Link>
            }
        >
            <Logo
                sx={{
                    mt: { xs: 2, md: 8 },
                    mb: { xs: 10, md: 8 },
                }}
            />
        </Badge>
      

      <Card
        sx={{
          py: { xs: 5, md: 0 },
          px: { xs: 3, md: 0 },
          boxShadow: { md: 'none' },
          overflow: { md: 'unset' },
          bgcolor: { md: 'background.default' },
        }}
      >
        {children}
      </Card>
    </Stack>
  );

  const renderSection = (
    <Stack flexGrow={1} sx={{ position: 'relative' }}>
      <Box
        component="img"
        alt="auth"
        src={image || '/assets/background/overlay_4.jpg'}
        sx={{
          top: 16,
          left: 16,
          objectFit: 'cover',
          position: 'absolute',
          width: 'calc(100% - 32px)',
          height: 'calc(100% - 32px)',
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          position: 'absolute',
          backgroundSize: 'cover',
          opacity: { xs: 0.24, md: 0 },
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: 'url(/assets/background/overlay_2.jpg)',
        },
      }}
    >
      {renderContent}

      {mdUp && renderSection}
    </Stack>
  );
}
