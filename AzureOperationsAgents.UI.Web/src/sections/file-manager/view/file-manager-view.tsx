import React, {useState, useCallback, useEffect} from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// utils
import { fTimestamp } from 'src/utils/format-time';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
// types
import {IFile, IFileFilters, IFileFilterValue, IFolder} from 'src/types/file';
//
import FileManagerTable from '../file-manager-table';
import FileManagerFilters from '../file-manager-filters';
import FileManagerGridView from '../file-manager-grid-view';
import FileManagerFiltersResult from '../file-manager-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import {paths} from "../../../routes/paths";
import {useLocales} from "../../../locales";
import {useCreateFolder, useGetFiles, useGetFolders} from "../../../api/file";
import {mutate} from "swr";
import {endpoints} from "../../../utils/axios";
import Label from "../../../components/label";
import {useGetUser} from "../../../api/user";

// ----------------------------------------------------------------------

const defaultFilters: IFileFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function FileManagerView() {
    const {t} = useLocales();

    const { profile } = useGetUser();
    
// ----------------------------------------------------------------------
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
// ----------------------------------------------------------------------
  
  const [ currentFolder, setCurrentFolder ] = useState(0);
  
  const [ parentFolder, setParentFolder ] = useState<number|null>(0);

  const { folders, foldersLoading, foldersError, foldersEmpty } = useGetFolders(currentFolder.toString());

  const { filesFromDb, filesLoading, filesError, filesEmpty } = useGetFiles(currentFolder.toString());

  const [_folders, setFolders] = useState<Array<IFolder>|null>([]);
  
  const [_files, setFilesFromDb] = useState<Array<IFile>|null>([]);

  let _allFiles: any[] | (() => any[]) = [];

  const [tableData, setTableData] = useState(_allFiles);

  const [upload, setUpload] = useState(false);
  
  const [newFolderName, setNewFolderName] = useState('');
  
    const handleNewFolder = () => {
        setUpload(true);
    };

    const createFolder = useCreateFolder();
    
    const handleCreateFolder = async () => {
        try {
            await createFolder({ name: newFolderName });
            setUpload(false);
            // Force refresh folders
            mutate(endpoints.folder.list);
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    }
    
    const handleChangeFolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewFolderName(event.target.value);
    }

    useEffect(() => {
        const updatedData = [rootFolder, ...(folders || []), ...(filesFromDb || [])];
        setTableData(updatedData);
    }, [folders, filesFromDb]);

    const handleChangeFolder = (folderId: string) => {
        //console.log('FILE MANAGER CHANGE FOLDER handleChangeFolder', folderId);
        setCurrentFolder(Number(folderId)); 
    };
    
  // useEffect(() => {
  //   if (folders)
  //       setFolders(folders);
  //   if (filesFromDb)
  //       setFilesFromDb(filesFromDb);
  //
  //   _allFiles = [...(folders || []), ...(filesFromDb || [])];
  //  
  //   setTableData(_allFiles); 
  //  
  //   console.log('_allFiles', _allFiles);
  //
  // }, [folders, filesFromDb]);
  
  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const [view, setView] = useState('list');


  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

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

  const handleDeleteItem = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const FILE_TYPE_OPTIONS = [
      t('fileManager.folder'),
        t('fileManager.image'),
      ];
  
  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />

      <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );
  

  return (
    <>
      <Label
          color="secondary"
          variant="soft"
          sx={{
            top: 30,
            px: 0.5,
            //left: 40,
            height: 20,
            position: 'relative',
            borderBottomLeftRadius: 2,
          }}
      >
        {t('generation.remaining-images')}: {profile?.RemainingImages}
      </Label>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t("file_manager")}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t("file_manager") },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Typography variant="body2" sx={{ fontSize:"1rem", fontStyle: "italic", my: { xs: 3, md: 5 } }}>
          {t('fileManager.description')}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="left">
          {/*<Typography variant="h4">{t("fileManager.title")}</Typography>*/}
          {/*   Comment as we don't allow to upload data*/}
          {/*<Button sx={{mr:2}}*/}
          {/*  variant="contained"*/}
          {/*  startIcon={<Iconify icon="eva:cloud-upload-fill" />}*/}
          {/*  onClick={upload.onTrue}*/}
          {/*>*/}
          {/*  {t('fileManager.upload')}*/}
          {/*</Button>*/}
          <Button
              color="primary"
            variant="contained"
            startIcon={<Iconify icon="eva:folder-add-fill" />}
            onClick={handleNewFolder}
          >
            {t('fileManager.newFolder')}
          </Button>
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title={t('fileManager.no-data')}
            sx={{
              py: 10,
            }}
          />
        ) : (
          <>
            {view === 'list' ? (
              <FileManagerTable
                table={table}
                tableData={tableData}
                dataFiltered={dataFiltered}
                onDeleteRow={handleDeleteItem}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
                onClickFolder={handleChangeFolder}
              />
            ) : (
              <FileManagerGridView
                table={table}
                data={tableData}
                dataFiltered={dataFiltered}
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
              />
            )}
          </>
        )}
      </Container>

      <FileManagerNewFolderDialog open={upload} onClose={() => setUpload(false)} onCreate={handleCreateFolder}
      onChangeFolderName={handleChangeFolderName}                            
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t("fileManager.delete")}
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            {t("fileManager.delete")}
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

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
