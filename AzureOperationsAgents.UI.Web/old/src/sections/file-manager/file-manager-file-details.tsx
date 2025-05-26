import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
// types
import { IFile } from 'src/types/file';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail, { fileFormat } from 'src/components/file-thumbnail';
//
import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerInvitedItem from './file-manager-invited-item';
import { useLocales } from 'src/locales';
import GenerationPrintDialog from "../generation/generation-print-dialog";
import {Tooltip} from "@mui/material";

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IFile;
  favorited?: boolean;
  //
  onFavorite?: VoidFunction;
  onCopyLink: VoidFunction;
  //
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

export default function FileManagerFileDetails({
  item,
  open,
  favorited,
  //
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  ...other
}: Props) {
    
    const { t } = useLocales();
    
  const { Name, Size, Url, Type, Shared, ModifiedAt, Description } = item;

  const hasShared = false; //shared && !!shared.length;

  const toggleTags = useBoolean(true);

  const share = useBoolean();
  
  const [print, setPrint] = useState(false);

  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');

  const [tags, setTags] = useState(item.Tags?.slice(0, 3));
  

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeTags = useCallback((newValue: string[]) => {
    setTags(newValue);
  }, []);

    const renderTags = (
        <Stack spacing={1.5}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ typography: 'subtitle2' }}
            >
                {t('fileManager.tags')}
                <IconButton size="small" onClick={toggleTags.onToggle}>
                    <Iconify
                        icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                    />
                </IconButton>
            </Stack>

            {toggleTags.value && Array.isArray(item.Tags) && (
                <Autocomplete
                    multiple
                    freeSolo
                    options={item.Tags.map((option: string) => option)}
                    getOptionLabel={(option) => option}
                    defaultValue={item.Tags.slice(0, 3)}
                    value={tags}
                    onChange={(event, newValue) => {
                        handleChangeTags(newValue);
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={option}>
                            {option}
                        </li>
                    )}
                    renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                            <Chip
                                {...getTagProps({ index })}
                                size="small"
                                variant="soft"
                                label={option}
                                key={option}
                            />
                        ))
                    }
                    renderInput={(params) => <TextField {...params} placeholder={t('fileManager.add-a-tag')} />}
                />
            )}
        </Stack>
    );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
          {t('fileManager.properties')}
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                {t('fileManager.size')}
            </Box>
            {fData(Size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                {t('fileManager.modified')}
            </Box>
            {fDateTime(ModifiedAt)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                {t('fileManager.type')}
            </Box>
            {fileFormat(Type)}
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderShared = (
    <>
      {/*<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>*/}
      {/*  <Typography variant="subtitle2"> File Share With </Typography>*/}
      
      {/*  <IconButton*/}
      {/*    size="small"*/}
      {/*    color="primary"*/}
      {/*    onClick={share.onTrue}*/}
      {/*    sx={{*/}
      {/*      width: 24,*/}
      {/*      height: 24,*/}
      {/*      bgcolor: 'primary.main',*/}
      {/*      color: 'primary.contrastText',*/}
      {/*      '&:hover': {*/}
      {/*        bgcolor: 'primary.dark',*/}
      {/*      },*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Iconify icon="mingcute:add-line" />*/}
      {/*  </IconButton>*/}
      {/*</Stack>*/}

      {/*{hasShared && (*/}
      {/*  <Box sx={{ pl: 2.5, pr: 1 }}>*/}
      {/*    {shared.map((person) => (*/}
      {/*      <FileManagerInvitedItem key={person.id} person={person} />*/}
      {/*    ))}*/}
      {/*  </Box>*/}
      {/*)}*/}
    </>
  );

  const onPrint = () => {
        setPrint(true);
    }

    const onOpen = () => {
        if (Type === 'image') {
            window.open(`/dashboard/generation?image=${Url}&description=${Description}&name=${Name}`, '_self');
        }
    }
  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack direction="row" alignItems="center" 
                 justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Info </Typography>

            <Checkbox
              color="warning"
              icon={<Iconify icon="eva:star-outline" />}
              checkedIcon={<Iconify icon="eva:star-fill" />}
              checked={favorited}
              onChange={onFavorite}
            />
          </Stack>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.neutral',
            }}
          >
            <FileThumbnail
              imageView
              file={Type === 'folder' ? Type : Url}
              sx={{ width: 64, height: 64 }}
              imgSx={{ borderRadius: 1 }}
            />

            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {Name}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderTags}

            {renderProperties}
          </Stack>

          {/*{renderShared}*/}
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
            <Tooltip title={t('fileManager.delete')}>
              <IconButton
                //variant="outlined"
                color="error"
                size="large"
                //startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={onDelete}
                //sx={{ fontSize: 12 }}
                aria-label={t('fileManager.delete')}
              >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  
              </IconButton>
            </Tooltip>
            <Tooltip title={t('fileManager.print')}>
                <IconButton
                    //sx={{ ml: 1, fontSize: 12 }}
                    //variant="outlined"
                    color="primary"
                    size="large"
                    //Icon={<Iconify icon="eva:printer-fill" />}
                    onClick={onPrint}
                    aria-label={t('fileManager.print')}
                >
                    <Iconify icon="eva:printer-fill" />
                    
                </IconButton>
            </Tooltip>
            <Tooltip title={t('fileManager.open-image')}>
                <IconButton
                    //sx={{ ml: 1,fontSize: 12 }}
                    //variant="soft"
                    color="primary"
                    size="large"
                    // startIcon={<Iconify icon="eva:image-2-fill" />}
                    onClick={onOpen}
                    aria-label={t('fileManager.open-image')}
                >
                    <Iconify icon="eva:image-2-fill" />
                </IconButton>
            </Tooltip>
        </Box>
      </Drawer>

      <FileManagerShareDialog
        open={share.value}
        shared={Shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={onCopyLink}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

        <GenerationPrintDialog open={print} generatedImage={Url} onClose={() => setPrint(false)} />
    </>
  );
}
