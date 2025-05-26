// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import EmptyContent from 'src/components/empty-content';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';
import {useLocales} from "../../locales";
import {useEffect, useState} from "react";

// ----------------------------------------------------------------------
type CheckoutCartProps = {
    subscription: string;
    };

export default function CheckoutCart({ subscription }: CheckoutCartProps) {

    const { t } = useLocales();
    const [yearly, setYearly] = useState(false);

// ----------------------------------------------------------------------
    const _pricingPlans = [

        {
            subscription: t('pricing-plans.free'),
            price: 0,
            caption: t('pricing-plans.for-3-months'),
            cadence: yearly ? t('pricing-plans.year') : t('pricing-plans.month'),
        },
        {
            subscription: t('pricing-plans.personal'),
            price: yearly ? (29-2.9) : 2.90,
            caption: t('pricing-plans.save-5-year'),
            cadence: yearly ? t('pricing-plans.year') : t('pricing-plans.month'),
        },
        {
            subscription: t('pricing-plans.professional'),
            price: yearly ? (99-9.9) : 9.90,
            caption: t('pricing-plans.save-19-year'),
            cadence: yearly ? t('pricing-plans.year') : t('pricing-plans.month'),
        },
        {
            subscription: t('pricing-plans.team'),
            price: yearly ? (129-12.9) : 12.90,
            caption: t('pricing-plans.save-25-year'),
            cadence: yearly ? t('pricing-plans.year') : t('pricing-plans.month'),
        }
    ];
// ----------------------------------------------------------------------
    
    const product = _pricingPlans
        .find((plan) => plan.subscription === subscription);
  const checkout = useCheckoutContext();
  
  const empty = !checkout.items.length;

  const items = checkout.items;
  
  const productInItems = items.find((item) => item.name === product?.subscription);

useEffect(() => {
    if (!productInItems) {
        if (product) {
            checkout.onAddToCart({
                id: product.subscription,
                name: product.subscription + " " + product.cadence,
                price: product.price,
                quantity: 1,
                subTotal: product.price,
            });
        }
    }
}, [productInItems, product, checkout]);
  
  
  
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                  {t('checkout-page.cart')}
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({checkout.totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title={t('checkout-page.cart-is-empty')}
              description={t('checkout-page.cart-is-empty-description')}
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={checkout.items}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={()=>{}}
              onDecreaseQuantity={()=>{}}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.pricing}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
            {t('checkout-page.return-to-shop')}
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        <Button
          fullWidth
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          disabled={empty}
          onClick={checkout.onNextStep}
        >
            {t('checkout-page.check-out')}
        </Button>
      </Grid>
    </Grid>
  );
}
