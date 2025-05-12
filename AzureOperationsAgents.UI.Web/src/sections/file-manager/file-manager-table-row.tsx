import { format } from 'date-fns';
import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fData } from 'src/utils/format-number';
// types
import {IFile, IFileManager} from 'src/types/file';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FileThumbnail from 'src/components/file-thumbnail';
//
import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerFileDetails from './file-manager-file-details';
import {useLocales} from "../../locales";
import {
    useMarkFileAsFavorite,
    useMarkFileAsNotFavorite,
    useMarkFolderAsFavorite,
    useMarkFolderAsNotFavorite, useSendLink
} from "../../api/file";

// ----------------------------------------------------------------------

type Props = {
  row: IFileManager | IFile;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  small: boolean;
  onDoubleClick: VoidFunction;
  onClick: VoidFunction;
};

export default function FileManagerTableRow({ row, selected, onSelectRow, onDeleteRow, small, onDoubleClick, onClick }: Props) {
  const theme = useTheme();

  const { t } = useLocales();

  const { Id, Name, Size, Type, ModifiedAt, Shared, IsFavorited } = row;
  
  const sendLink = useSendLink();
  
  if (row.Id === '0') {
      row.Type = 'folder';
    }

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const favorite = useBoolean(IsFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();
  
  const handleSendInvite = useCallback(async (emailSend: any) => {
        try {
            console.log('handleSendInvite');
            const response = await sendLink(emailSend);
            return response.data;
        } catch (error) {
            console.error('Failed to send invite:', error);
            throw error;
        }
    }, [sendLink]);

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("entered email: ", event.target.value);
    setInviteEmail(event.target.value);
    const emailSend = {
        "fileId": row.Id,
        "email": event.target.value
    }
    console.log(emailSend);
    
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      if (!small) {
          if (row.Type === 'folder') {
              onClick();
          }
          if (row.Name !== t('fileManager.root')) {
            details.onTrue();
          }
          
      }
      else {
          onClick();
      }
    },
    doubleClick: onDoubleClick,
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar(t("fileManager.copied"), { variant: 'success' });
    copy(row.Url);
  }, [copy, enqueueSnackbar, row.Url]);

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

    const markAsFavorite = useMarkFileAsFavorite();
    const markAsNotFavorite = useMarkFileAsNotFavorite();

    const setAsFavorite = useCallback(async (fileId: string) => {
            favorite.onTrue();
            enqueueSnackbar(t('fileManager.added-to-favorites'));
            await markAsFavorite(fileId);
        }
        , [enqueueSnackbar, favorite]);

    const setAsNotFavorite = useCallback(async (fileId: string) => {
            favorite.onFalse();
            enqueueSnackbar(t('fileManager.removed-from-favorites'));
            await markAsNotFavorite(fileId);
        }
        , [enqueueSnackbar, favorite]);


    const markFolderAsFavorite = useMarkFolderAsFavorite();
    const markFolderAsNotFavorite = useMarkFolderAsNotFavorite();

    const setFolderAsFavorite = useCallback(async (folderId: string) => {
            favorite.onTrue();
            enqueueSnackbar(t('fileManager.added-to-favorites'));
            await markFolderAsFavorite(folderId);
        }
        , [enqueueSnackbar, favorite]);

    const setFolderAsNotFavorite = useCallback(async (folderId: string) => {
            favorite.onFalse();
            enqueueSnackbar(t('fileManager.removed-from-favorites'));
            await markFolderAsNotFavorite(folderId);
        }
        , [enqueueSnackbar, favorite]);

    const setFavorite = async () => {
        console.log('setFavorite');
        if (favorite.value) {
            favorite.onFalse();
            if (Type === 'folder') {
                console.log('setFolderAsNotFavorite');
                await setFolderAsNotFavorite(Id);
            }
            else {
                console.log('setAsNotFavorite');
                await setAsNotFavorite(Id);
            }
        } else {
            if (Type === 'folder') {
                console.log('setFolderAsFavorite');
                await setFolderAsFavorite(Id);
            }
            else {
                console.log('setAsFavorite');
                await setAsFavorite(Id);
            }
        }
    }
    
    const handleOpenFile = () => {
        if (row.Type === 'image') {
            window.open(`/dashboard/generation?image=${row.Url}&description=${row.Description}&name=${row.Name}`, '_self');
        }
    }
    
  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell padding="checkbox">
            { row.Id !== '0' && (
          <Checkbox
            checked={selected}
            onDoubleClick={onDoubleClick}
            onClick={onSelectRow}
          />
                )}
        </TableCell>

        <TableCell onClick={handleClick}>
            
          <Stack direction="row" alignItems="center" spacing={2}>
              {row.Name === t('fileManager.root') ? (
              <Iconify icon="eva:corner-left-up-fill" sx={{ width: 36, height: 36 }} />
              ) : ( 
            <FileThumbnail file={Type} sx={{ width: 36, height: 36 }} />
                  )
                }
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {Name}
            </Typography>
          </Stack>
        </TableCell>
          {!small && (row.Name !== t('fileManager.root')) &&  (
          <>
              <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                {fData(Size)}
              </TableCell>
               
              <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                {Type}
              </TableCell>
                  
              <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                      <ListItemText
                          primary={ModifiedAt ? format(new Date(ModifiedAt), 'dd MMM yyyy') : 'Invalid date'}
                          secondary={ModifiedAt ? format(new Date(ModifiedAt), 'p') : ''}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{
                              mt: 0.5,
                              component: 'span',
                              typography: 'caption',
                          }}
                      />
              </TableCell>
          </>
      )}
        <TableCell align="right" onClick={handleClick}>
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': {
                  fontSize: 12,
                },
              },
            }}
          >
            {Shared &&
              Shared.map((person) => (
                <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
              ))}
          </AvatarGroup>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
            {!small && (row.Name !== t('fileManager.root')) && (
                <>
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorite.value}
            onChange={setFavorite}
            sx={{ p: 0.75 }}
          />
            
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
                </>
            )}
        </TableCell>
      </TableRow>

        {!small && (row.Name !== t('fileManager.root')) && (
        
          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            arrow="right-top"
            sx={{ width: 160 }}
          >
              <MenuItem
                  onClick={() => {
                        popover.onClose();
                        handleOpenFile();
                  }}
                  >
                    <Iconify icon="eva:image-2-fill" />
                    {t("fileManager.open-image")}
                  </MenuItem>
            <MenuItem
              onClick={() => {
                popover.onClose();
                handleCopy();
              }}
            >
              <Iconify icon="eva:link-2-fill" />
              {t("fileManager.copy-link")}
            </MenuItem>
    
            <MenuItem
              onClick={() => {
                popover.onClose();
                share.onTrue();
              }}
            >
              <Iconify icon="solar:share-bold" />
              {t("fileManager.share")}
            </MenuItem>
    
            <Divider sx={{ borderStyle: 'dashed' }} />
    
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              {t("fileManager.delete")}
            </MenuItem>
          </CustomPopover>
            )}
      <FileManagerFileDetails
        item={row}
        favorited={favorite.value}
        onFavorite={setFavorite}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={Shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
        sendInvite={handleSendInvite}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
