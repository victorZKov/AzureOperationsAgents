import React, { useState, useEffect, useCallback } from 'react';
import { useLocales } from "../../locales";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IFile, IFileFilters, IFileFilterValue, IFolder } from "../../types/file";
import { useGetFolders } from "../../api/file";
import TableContainer from "@mui/material/TableContainer";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import { tableCellClasses } from "@mui/material/TableCell";
import { emptyRows, getComparator, TableEmptyRows, TableHeadCustom, TableNoData, useTable } from "../../components/table";
import TableBody from "@mui/material/TableBody";
import FileManagerTableRow from "../file-manager/file-manager-table-row";
import { fTimestamp } from "../../utils/format-time";
import { fileFormat } from "../../components/file-thumbnail";
import TextField from "@mui/material/TextField";
import { useGetUser } from "../../api/user";
import { Stack } from '@mui/system';
import { Typography } from "@mui/material";
import {getRandomWords} from "../../utils/randomName";

interface Props {
    generatedImage: string | null;
    open: boolean;
    onClose: VoidFunction;
    setFileName: (fileName: string) => void;
    fileName: string;
    saveFile: VoidFunction;
    currentFolder: number;
    setCurrentFolder: (folder: number) => void;
    parentFolder: number | null;
    setParentFolder: (folder: number | null) => void;
}

const defaultFilters: IFileFilters = {
    name: '',
    type: [],
    startDate: null,
    endDate: null,
};

export default function GenerationSaveDialog({
                                                 generatedImage,
                                                 open,
                                                 onClose,
                                                 setFileName,
                                                 fileName,
                                                 saveFile,
                                                 currentFolder,
                                                 setCurrentFolder,
                                                 parentFolder,
                                                 setParentFolder,
                                             }: Props) {

    const { t } = useLocales();
    const { profile } = useGetUser();
    const theme = useTheme();
    
    if (!fileName || fileName.length === 0) {
        setFileName(getRandomWords(3).join('-'));
    }
    
    const TABLE_HEAD = [
        { id: 'name', label: t("fileManager.name"), width: 360 },
        { id: 'modifiedAt', label: t("fileManager.modified"), width: 140 },
    ];

    const rootFolder: IFolder = {
        Id: '0',
        Owner: '',
        ParentId: -1,
        Name: t("fileManager.root"),
        Size: 0,
        Url: '',
        CreatedAt: new Date(),
        ModifiedAt: new Date(),
        IsFavorited: false,
        children: [],
    };

    const { folders, foldersLoading, foldersError, foldersValidating, foldersEmpty } = useGetFolders(currentFolder.toString());

    useEffect(() => {
        if (!folders) {
            _allFiles = [rootFolder];
            return;
        }
        setFolders(folders);
        _allFiles = [rootFolder, ...(folders || [])];
        setTableData(_allFiles);
    }, [folders]);

    const [folderSelected, setFolderSelected] = useState(true);
    const [currentFolderName, setCurrentFolderName] = useState('');
    const [_folders, setFolders] = useState<Array<IFolder> | null>([]);
    let _allFiles: any[] | (() => any[]) = [];
    const [tableData, setTableData] = useState(_allFiles);
    const table = useTable({ defaultRowsPerPage: 10 });
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('Name');
    const [selected, setSelected] = useState<string>('0');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dense, setDense] = useState(false);
    const denseHeight = dense ? 58 : 78;
    const [filters, setFilters] = useState(defaultFilters);

    const canReset = !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);
    const dateError = filters.startDate && filters.endDate ? filters.startDate.getTime() > filters.endDate.getTime() : false;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
        dateError,
    });

    const handleFilters = useCallback(
        (name: string, value: IFileFilterValue) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleSave = () => {
        console.log('Save image', selected, generatedImage);
        console.log('Current folder: ', currentFolder);
        saveFile();
        onClose();
    }

    const onSelectedRow = (id: string) => {
        console.log('Selected row: ', id);
        setSelected('');
        setSelected(id);
        setFolderSelected(true);
        setCurrentFolder(Number(id));
        console.log('Selected folder: ', id);
        let folder = _folders?.find((folder) => folder.Id === id);
        console.log('Selected folder: ', folder);
        setCurrentFolderName(_folders?.find((folder) => folder.Id === id)?.Name || '');
    };

    const onSort = (id: string) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
    }

    const onChangeFileName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    }

    const handleOnClicked = (id: string) => {
        console.log('Clicked row: ', id);
        setCurrentFolder(Number(id));
        setSelected(id);
        console.log('Selected folder: ', id);
        let folder = _folders?.find((folder) => folder.Id === id);
        console.log('Selected folder: ', folder);
        setCurrentFolderName(_folders?.find((folder) => folder.Id === id)?.Name || '');
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
                {t('fileManager.save-image')}
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
                <Stack direction="row" spacing={2} sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                        {t('fileManager.selected-folder')}: <Typography variant="h4">{currentFolderName}</Typography>
                    </Typography>
                    <TextField
                        fullWidth
                        label={t('fileManager.file-name')}
                        value={fileName}
                        onChange={onChangeFileName}
                        sx={{ mb: 3, flex: 1 }}
                    />
                </Stack>
                <TableContainer sx={{
                    p: theme.spacing(0, 3, 3, 3),
                }}>
                    <Table
                        size={dense ? 'small' : 'medium'}
                        sx={{
                            minWidth: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '0 16px',
                        }}
                    >
                        <TableHeadCustom
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={tableData.length}
                            numSelected={selected ? 1 : 0}
                            onSort={onSort}
                            onSelectAllRows={() => { }}
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
                                        selected={selected === row.Id}
                                        onSelectRow={() => onSelectedRow(row.Id)}
                                        onDeleteRow={() => { }}
                                        small={true}
                                        onDoubleClick={() => onSelectedRow(row.Id)}
                                        onClick={() => { handleOnClicked(row.Id) }}
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
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={!folderSelected || fileName.length === 0}
                >
                    {t('fileManager.save')}
                </Button>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    {t('fileManager.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function applyFilter({
                         inputData,
                         comparator,
                         filters,
                         dateError,
                     }: {
    inputData: IFile[];
    comparator: (a: any, b: any) => number;
    filters: IFileFilters;
    dateError: boolean;
}) {
    const { name, type, startDate, endDate } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (file) => file.Name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }

    if (type.length) {
        inputData = inputData.filter((file) => type.includes(fileFormat(file.Type)));
    }

    if (!dateError) {
        if (startDate && endDate) {
            inputData = inputData.filter(
                (file) =>
                    fTimestamp(file.CreatedAt) >= fTimestamp(startDate) &&
                    fTimestamp(file.CreatedAt) <= fTimestamp(endDate)
            );
        }
    }

    return inputData;
}