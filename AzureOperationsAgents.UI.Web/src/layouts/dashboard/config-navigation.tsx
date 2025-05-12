import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import {useGetUser} from "../../api/user";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const { profile } = useGetUser();
  const userLevel = profile?.Level ?? 0;
  

  const data = useMemo(
      () => [
        {
          subheader: t('overview'),
          items: [
            {
              title: t('dashboard'),
              path: paths.dashboard.root,
              icon: ICONS.dashboard,
            },
          ],
        },
        {
          subheader: t('management'),
          items: [
            {
              title: t('agents.title'),
              path: paths.dashboard.agents,
              icon: ICONS.product,
            },
            ...(userLevel > 0 || true
                ? [
                  {
                    title: t('audit.title'),
                    path: paths.dashboard.audit,
                    icon: ICONS.folder,
                  },
                ]
                : []),
            ...(userLevel > 0 || true
                ? [
                  {
                    title: t('chat.title'),
                    path: paths.dashboard.chat,
                    icon: ICONS.folder,
                  },
                ]
                : []),
          ],
        },
      ],
      [t, userLevel]
  );

  return data;
}