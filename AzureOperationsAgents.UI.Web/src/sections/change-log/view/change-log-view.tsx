import {useLocales} from "../../../locales";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import { DataGrid } from '@mui/x-data-grid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  version: string,
  date: string,
  changes: string,
) {
  return { version, date, changes };
}

const rows = [
  createData('0.0.1', '2025-01-01', 'Initial release'),
];
export default function ChangeLogView() {
  const {t} = useLocales();

  return (
    <Container maxWidth="md">
      <Box sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {`${t('changeLog')}`}
        </Typography>
        <Divider sx={{ mb: 2 }} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Changes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.version}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.version}
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.changes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      </Box>
    </Container>
  );
}
