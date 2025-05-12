// @mui
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// types
import { IFileShared } from 'src/types/file';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import FileManagerInvitedItem from './file-manager-invited-item';
import {useLocales} from "../../locales";

// ----------------------------------------------------------------------

type Props = DialogProps & {
  inviteEmail?: string;
  shared?: IFileShared[] | null;
  onCopyLink?: VoidFunction;
  onChangeInvite?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sendInvite?: (emailsend: any) => void;
  open: boolean;
  onClose: VoidFunction;
};

export default function FileManagerShareDialog({
  shared,
  inviteEmail,
  onCopyLink,
  onChangeInvite,
  sendInvite,
  open,
  onClose,
  ...other
}: Props) {
  const hasShared = shared && !!shared.length;
  
  const { t } = useLocales();

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> {t('fileManager.share')} </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        {onChangeInvite && (
          <TextField
            fullWidth
            value={inviteEmail}
            placeholder="Email"
            onChange={onChangeInvite}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="inherit"
                    variant="contained"
                    // disabled={!inviteEmail}
                      disabled={true}
                    sx={{ mr: -0.75 }}
                    onClick={sendInvite}
                  >
                      {/*{t('fileManager.send-invite')}*/}
                      {t('coming-soon')}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}

        {hasShared && (
          <Scrollbar sx={{ maxHeight: 60 * 6 }}>
            <List disablePadding>
              {shared.map((person) => (
                <FileManagerInvitedItem key={person.id} person={person} />
              ))}
            </List>
          </Scrollbar>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onCopyLink && (
          <Button startIcon={<Iconify icon="eva:link-2-fill" />} onClick={onCopyLink}>
              {t('fileManager.copy-link')}
          </Button>
        )}

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
              {t('fileManager.close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
