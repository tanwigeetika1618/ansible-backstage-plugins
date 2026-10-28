/*
 * Copyright 2024 The Ansible plugin Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { forwardRef, useState } from 'react';
import OpenInNew from '@mui/icons-material/OpenInNew';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { useAnalytics } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Slide from '@mui/material/Slide';
import type { SlideProps } from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

type IProps = {
  handleClose: () => void;
  open: boolean;
};

const SlideTransition = forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RatingsFeedbackModal(props: Readonly<IProps>) {
  const analytics = useAnalytics();

  const [ratings, setRatings] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [shareFeedback, setShareFeedback] = useState<boolean>(false);

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>(
    'Thank you for sharing your feedback!',
  );
  const [helpAnchorEl, setHelpAnchorEl] = useState<HTMLElement | null>(null);

  const checkDisabled = () => {
    return !ratings || !feedback || !shareFeedback;
  };

  const sendFeedback = () => {
    analytics.captureEvent('feedback', 'sentiment', {
      attributes: {
        type: 'sentiment',
        ratings: ratings,
        feedback,
      },
    });
    setSnackbarMsg('Thank you for sharing your ratings and feedback');
    setShowSnackbar(true);
    const clearFeedback = setTimeout(() => {
      setRatings(0);
      setFeedback('');
      setShareFeedback(false);
      clearTimeout(clearFeedback);
    }, 500);
  };

  const handleHelpClick = (event: React.MouseEvent<HTMLElement>) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };

  return (
    <div data-testid="ratings-feedback-modal">
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        TransitionComponent={SlideTransition}
      >
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Share Your Valuable Feedback
            <Tooltip title="Feedback Requirements">
              <IconButton
                size="small"
                onClick={handleHelpClick}
                sx={{ padding: '4px' }}
                data-testid="feedback-help-icon"
              >
                <HelpOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <div>
            <FormControl fullWidth>
              <div
                style={{ marginTop: '10px', marginBottom: '10px' }}
                data-testid="user-ratings"
              >
                <Typography
                  component="div"
                  id="modal-modal-description"
                  sx={{ marginTop: '2px' }}
                >
                  <Typography>
                    How was your experience?{' '}
                    <sup style={{ fontWeight: 600 }}>*</sup>
                  </Typography>
                  <Rating
                    name="user-ratings"
                    value={ratings}
                    onChange={(e, newRatings) => {
                      e.stopPropagation();
                      if (newRatings) setRatings(newRatings);
                    }}
                    sx={{ marginTop: '10px' }}
                  />
                </Typography>
              </div>
            </FormControl>
            <Divider />
            <FormControl fullWidth>
              <div style={{ marginTop: '15px' }} data-testid="tell-us-why">
                <TextField
                  multiline
                  variant="outlined"
                  aria-required
                  required
                  minRows={10}
                  id="feedback"
                  label="Tell us why?"
                  placeholder="Enter feedback"
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  fullWidth
                />
              </div>
            </FormControl>
          </div>
          <FormControl>
            <FormControlLabel
              sx={{ marginTop: '10px' }}
              aria-required
              control={
                <Checkbox
                  data-testid="sentiment-checkbox"
                  sx={{ margin: '0 8px' }}
                  checked={shareFeedback}
                  onChange={e => setShareFeedback(e.target.checked)}
                  aria-label="I understand that feedback is shared with Red Hat."
                />
              }
              label={
                <span style={{ fontSize: 14 }}>
                  I understand that feedback is shared with Red Hat.
                </span>
              }
            />
            <div style={{ fontSize: 14 }}>
              Red Hat uses your feedback to help improve our products and
              services.
              <br /> For more information, please review&nbsp;
              <Link to="https://www.redhat.com/en/about/privacy-policy">
                Red Hat's Privacy Statement{' '}
                <OpenInNew fontSize="small" sx={{ fontSize: '14px' }} />
              </Link>
            </div>

            <div style={{ marginTop: '10px', marginBottom: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={checkDisabled()}
                onClick={sendFeedback}
                data-testid="sentiment-submit-btn"
              >
                Submit
              </Button>
            </div>
          </FormControl>
        </DialogContent>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={showSnackbar}
          onClose={() => setShowSnackbar(false)}
          autoHideDuration={3000}
          message={snackbarMsg}
        />
        <Popover
          open={Boolean(helpAnchorEl)}
          anchorEl={helpAnchorEl}
          onClose={handleHelpClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          data-testid="feedback-help-popover"
        >
          <div style={{ padding: '16px', maxWidth: '300px' }}>
            <Typography
              variant="subtitle2"
              sx={{ marginBottom: '8px', fontWeight: 600 }}
            >
              Feedback Requirements
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '12px' }}>
              To share feedback, please provide:
            </Typography>
            <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '4px' }}>
                <Typography variant="body2">A rating (1-5 stars)</Typography>
              </li>
              <li style={{ marginBottom: '4px' }}>
                <Typography variant="body2">Detailed feedback text</Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Consent to share with Red Hat
                </Typography>
              </li>
            </ul>
            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
              <strong>Note:</strong> Please ensure any ad-blockers are disabled
              to share feedback properly.
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
              For more information about how we use your feedback:
            </Typography>
            <Link
              to="https://www.redhat.com/en/about/privacy-policy"
              target="_blank"
            >
              Red Hat Privacy Policy{' '}
              <OpenInNew fontSize="small" sx={{ fontSize: '14px' }} />
            </Link>
          </div>
        </Popover>
      </Dialog>
    </div>
  );
}
