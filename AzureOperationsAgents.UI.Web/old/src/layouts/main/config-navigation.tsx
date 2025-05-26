// routes
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  {
    title: 'Pricing',
    icon: <Iconify icon="solar:atom-bold-duotone" />,
    path: paths.pricing,
  },
  { title: 'About us', path: paths.about },
  { title: 'Contact us', path: paths.contact },
  { title: 'FAQs', path: paths.faqs },

];
