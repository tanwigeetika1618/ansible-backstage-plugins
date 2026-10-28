import { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { formatRelativeTime } from '../../utils/timeUtils';

const options = [
  {
    label: 'Organizations, Users, and Teams',
    value: 'orgsUsersTeams',
  },
  {
    label: 'Job Templates',
    value: 'templates',
  },
];

export interface SyncConfirmationDialogProps {
  id: string;
  keepMounted: boolean;
  value: string[];
  open: boolean;
  syncStatus?: {
    orgsUsersTeams: { lastSync: string | null };
    jobTemplates: { lastSync: string | null };
  };
  onClose: (value?: string[]) => void;
}

export const SyncConfirmationDialog = (props: SyncConfirmationDialogProps) => {
  const { onClose, value: valueProp, open, syncStatus, ...other } = props;
  const [value, setValue] = useState<string[]>(valueProp);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setValue(checked ? [...value, name] : value.filter(v => v !== name));
  };

  return (
    <Dialog
      maxWidth="md"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        AAP synchronization options
      </DialogTitle>
      <DialogContent dividers>
        {options.map(option => {
          const lastSync =
            option.value === 'orgsUsersTeams'
              ? syncStatus?.orgsUsersTeams.lastSync
              : syncStatus?.jobTemplates.lastSync;

          return (
            <div
              key={option.value}
              style={{ marginBottom: '8px', width: '100%' }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value.includes(option.value)}
                    onChange={handleChange}
                    name={option.value}
                    value={option.value}
                  />
                }
                label={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '6px',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {option.label}
                    </span>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.6rem',
                        fontStyle: 'italic',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {formatRelativeTime(lastSync || null)}
                    </Typography>
                  </div>
                }
              />
            </div>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
