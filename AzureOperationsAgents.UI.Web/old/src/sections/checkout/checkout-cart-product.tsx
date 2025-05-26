// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { fCurrency } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import { ICheckoutItem } from 'src/types/checkout';

// ----------------------------------------------------------------------

type Props = {
  row: ICheckoutItem;
  onDelete: VoidFunction;
  //onDecrease: VoidFunction;
  //onIncrease: VoidFunction;
};

export default function CheckoutCartProduct({ row, onDelete }: Props) {
  const { name, price, coverUrl, quantity } = row;

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar variant="rounded" alt={name} src={coverUrl} sx={{ width: 64, height: 64, mr: 2 }} />

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 140 }}>
            {name}
          </Typography>

          {/*<Stack*/}
          {/*  direction="row"*/}
          {/*  alignItems="center"*/}
          {/*  sx={{ typography: 'body2', color: 'text.secondary' }}*/}
          {/*>*/}
          {/*  size: <Label sx={{ ml: 0.5 }}> {size} </Label>*/}
          {/*  <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />*/}
          {/*  <ColorPreview colors={colors} />*/}
          {/*</Stack>*/}
        </Stack>
      </TableCell>

      <TableCell>{fCurrency(price)}</TableCell>

      {/*<TableCell>*/}
      {/*  <Box sx={{ width: 88, textAlign: 'right' }}>*/}
      {/*    <IncrementerButton*/}
      {/*      quantity={quantity}*/}
      {/*      onDecrease={onDecrease}*/}
      {/*      onIncrease={onIncrease}*/}
      {/*      disabledDecrease={quantity <= 1}*/}
      {/*      disabledIncrease={quantity >= available}*/}
      {/*    />*/}
      
      {/*    <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 1 }}>*/}
      {/*      available: {available}*/}
      {/*    </Typography>*/}
      {/*  </Box>*/}
      {/*</TableCell>*/}

      <TableCell align="right">{fCurrency(price * quantity)}</TableCell>

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
