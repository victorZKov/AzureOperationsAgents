// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// types
import { ICheckoutItem } from 'src/types/checkout';
// components
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
//
import CheckoutCartProduct from './checkout-cart-product';
import {useLocales} from "../../locales";


type Props = {
  products: ICheckoutItem[];
  onDelete: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
};

export default function CheckoutCartProductList({
  products,
  onDelete,
  //onIncreaseQuantity,
  //onDecreaseQuantity,
}: Props) {

  const { t } = useLocales();
  // ----------------------------------------------------------------------

  const TABLE_HEAD = [
    { id: 'product', label: t('checkout-page.product') },
    { id: 'price', label: t('checkout-page.price') },
    //{ id: 'quantity', label: '' },
    { id: 'totalAmount', label: t('checkout-page.total-price'), align: 'right' },
    { id: '' },
  ];

// ----------------------------------------------------------------------

  
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 550 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row) => (
              <CheckoutCartProduct
                key={row.id}
                row={row}
                onDelete={() => onDelete(row.id)}
                //onDecrease={() => onDecreaseQuantity(row.id)}
                //onIncrease={() => onIncreaseQuantity(row.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
