import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  title?: string;
  //
  onCreate?: () => void;
  onUpdate?: VoidFunction;
  //
  folderName?: string;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
}

export default function FileManagerNewFolderDialog({
  title = 'Upload Files',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  ...other
}: Props) {
  
  const {t} = useLocales();
  
  const [files, setFiles] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleUpload = () => {
    onClose();
    console.info('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleSave = () => {
    if (onCreate) {
      onCreate();
    } else if (onUpdate) {
      onUpdate();
    }
    onClose(); // Close the dialog
  };

  const handleCancel = () => {
    onClose(); // Close the dialog on cancel
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {t('fileManager.newFolder')} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label={t('fileManager.folder-name')}
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        {/*<Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />*/}
      </DialogContent>

      <DialogActions>
        {/* Cancel button */}
        <Button variant="outlined" color="inherit" onClick={handleCancel}>
          {t('fileManager.cancel')}
        </Button>

        {/* Save button */}
        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Button
              color="primary"
              variant="contained"
              onClick={handleSave}
          >
            {t('fileManager.save')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
