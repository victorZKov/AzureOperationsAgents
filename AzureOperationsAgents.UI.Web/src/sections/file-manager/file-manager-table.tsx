// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';
// types
import { IFile } from 'src/types/file';
// components
import Iconify from 'src/components/iconify';
import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import FileManagerTableRow from './file-manager-table-row';
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: IFile[];
  notFound: boolean;
  dataFiltered: IFile[];
  onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
    onClickFolder: (id: string) => void;
};

export default function FileManagerTable({
  table,
  tableData,
  notFound,
  onDeleteRow,
  dataFiltered,
  onOpenConfirm,
    onClickFolder,
}: Props) {
  //console.log(tableData);
  const theme = useTheme();
  const {t} = useLocales();
  const TABLE_HEAD = [
    { id: 'name', label: t("fileManager.name" ), width: 360 },
    { id: 'size', label: t("fileManager.size" ), width: 120 },
    { id: 'type', label: t("fileManager.type"), width: 120 },
    { id: 'modifiedAt', label: t("fileManager.modified"), width: 140 },
    { id: 'shared', label: t("fileManager.shared"), align: 'right', width: 140 },
    { id: '', width: 88 },
  ];

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const denseHeight = dense ? 58 : 78;

  
  const handleClickItem = (id: string) => {
    const item = tableData.find((row) => row.Id === id);
    if (item) {
      if (item.Type === 'folder') {
        onClickFolder(id);
      }
      
    }
  }
  
  const handleDoubleClick = (id: string) => {
    const item = tableData.find((row) => row.Id === id);
    if (item) {
      console.log("ITEM +> ", item);
      if (item.Type === 'image') {
        window.open(`/dashboard/generation?image=${item.Url}&description=${item.Description}&name=${item.Name}`, '_self');
      }
    }
  }
  
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          m: theme.spacing(-2, -3, -3, -3),
        }}
      >
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row) => row.Id)
            )
          }
          action={
            <>
              <Tooltip title="Share">
                <IconButton color="primary">
                  <Iconify icon="solar:share-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton color="primary" onClick={onOpenConfirm}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            right: 24,
            width: 'auto',
            borderRadius: 1.5,
          }}
        />

        <TableContainer
          sx={{
            p: theme.spacing(0, 3, 3, 3),
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
            }}
          >
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.Id)
                )
              }
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <FileManagerTableRow
                    key={row.Id}
                    row={row}
                    selected={selected.includes(row.Id)}
                    onSelectRow={() => onSelectRow(row.Id)}
                    onDeleteRow={() => onDeleteRow(row.Id)}
                    small={false}
                    onDoubleClick={() => handleDoubleClick(row.Id)}
                    onClick={() => handleClickItem(row.Id)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}
