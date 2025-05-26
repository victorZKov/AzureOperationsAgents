// @mui
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// types
import { IUserAccountBillingHistory } from 'src/types/user';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useLocales } from '../../locales';

// ----------------------------------------------------------------------

type Props = {
    invoices: IUserAccountBillingHistory[];
};

export default function AccountBillingHistory({ invoices = [] }: Props) {
    const { t } = useLocales();
    const showMore = useBoolean();
    console.log('incoming invoices: ', invoices);
    // Ensure invoices is always an array
    const invoiceArray = Array.isArray(invoices) ? invoices : [];
    console.log('Processed Invoices (invoiceArray):', invoiceArray);

    // Determine the invoices to display
    const displayedInvoices = showMore.value ? invoiceArray : invoiceArray.slice(0, 8);


    console.log('Displayed Invoices: ', displayedInvoices);

    return (
        <Card>
            {/* Header */}
            <CardHeader title={t('pricing-plans.invoice-history')} />

            {/* Invoice List */}
            <Stack spacing={1.5} sx={{ px: 3, pt: 3 }}>
                {displayedInvoices.map((invoice) => (
                    <Stack key={invoice.Id} direction="row" alignItems="center">
                        <Link color="inherit" underline="always" variant="body2" href={invoice.FileURL} target="_blank">
                        <ListItemText
                            primary={invoice.InvoiceNumber}
                            secondary={fDate(invoice.CreatedAt)}
                            primaryTypographyProps={{
                                typography: 'body2',
                            }}
                            secondaryTypographyProps={{
                                mt: 0.5,
                                component: 'span',
                                typography: 'caption',
                                color: 'text.disabled',
                            }}
                        />
                        </Link>
                        <Typography variant="body2" sx={{ textAlign: 'right', ml: 2 }}>
                             {invoice.Price} €
                        </Typography>
                        
                        
                    </Stack>
                ))}
            </Stack>

            {/* Divider */}
            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* Show More / Show Less Button */}
            <Stack alignItems="flex-start" sx={{ p: 2 }}>
                <Button
                    size="small"
                    color="inherit"
                    startIcon={
                        <Iconify
                            icon={showMore.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                        />
                    }
                    onClick={showMore.onToggle}
                >
                    {showMore.value ? t('pricing-plans.show-less') : t('pricing-plans.show-more')}
                </Button>
            </Stack>
        </Card>
    );
}
