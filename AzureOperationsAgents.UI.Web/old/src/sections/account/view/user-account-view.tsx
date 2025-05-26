import {useState, useCallback, useEffect} from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useLocation, useNavigate } from 'react-router-dom';
// _mock
import {  _userPayment,  _userAddressBook } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../account-general';
import AccountBilling from '../account-billing';
import {useLocales} from "../../../locales";
import {useGetInvoices, useGetUser} from "../../../api/user";


export default function AccountView() {

    const {t} = useLocales();
    const { profile } = useGetUser();
    const invoices = useGetInvoices();
    const location = useLocation();
    const navigate = useNavigate();
    const settings = useSettingsContext();

    const _userPlans = [
        {
            subscription: t('pricing-plans.free'),
            price: 0,
            primary: false,
        }
    ];

    const [userPlans, setUserPlans] = useState(_userPlans);

    const TABS = [
        {
            value: 'general',
            label: t('profile.general'),
            icon: <Iconify icon="solar:user-id-bold" width={24} />,
        },
        {
            value: 'billing',
            label: t('profile.billing'),
            icon: <Iconify icon="solar:bill-list-bold" width={24} />,
        },
    ];

    useEffect(() => {
        if (!profile) return;

        const usPl = [
            {
                subscription: t('pricing-plans.free'),
                price: 0,
                primary: profile.Level === 0,
            },
            {
                subscription: t('pricing-plans.personal'),
                price: 2.90,
                primary: profile.Level === 1,
            },
            {
                subscription: t('pricing-plans.professional'),
                price: 9.90,
                primary: profile.Level === 2,
            },
            {
                subscription: t('pricing-plans.team'),
                price: 12.90,
                primary: profile.Level === 3,
            },
        ];
        setUserPlans(usPl);
    }, [profile, t]);

    // Get initial tab from URL and maintain it in state
    const queryParams = new URLSearchParams(location.search);
    const [currentTab, setCurrentTab] = useState(queryParams.get('tab') || 'general');

    // Update URL when tab changes
    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
        const newParams = new URLSearchParams(location.search);
        newParams.set('tab', newValue);
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    }, [location, navigate]);

    // Sync tab state with URL on location change
    useEffect(() => {
        const tab = queryParams.get('tab');
        if (tab && TABS.some(t => t.value === tab)) {
            setCurrentTab(tab);
        }
    }, [location.search]);


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t('profile.account')}
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t('user'), href: paths.dashboard.user.account },
                    { name: t('profile.profile') },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            >
                {TABS.map((tab) => (
                    <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
                ))}
            </Tabs>

            {currentTab === 'general' && <AccountGeneral />}

            {currentTab === 'billing' && (
                <AccountBilling
                    plans={userPlans}
                    cards={_userPayment}
                    invoices={invoices.invoices}
                    addressBook={_userAddressBook}
                />
            )}
        </Container>
    );
}
