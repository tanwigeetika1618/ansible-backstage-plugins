import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { SystemStyleObject, Theme } from '@mui/system';
import { PAGE_SIZE_OPTIONS, resolvePageLimit } from './constants';

const rootSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mt: 3,
  pt: 2,
  borderTop: theme => `1px solid ${(theme as Theme).palette.divider}`,
  gap: 2,
  flexWrap: 'wrap',
};

const summarySx: SystemStyleObject<Theme> = {
  color: 'text.secondary',
  fontSize: '0.8125rem',
  letterSpacing: '0.01em',
};

const controlsSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
} as const;

const pageSizeSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
} as const;

const pageSizeLabelSx: SystemStyleObject<Theme> = {
  color: 'text.secondary',
  fontSize: '0.8125rem',
  whiteSpace: 'nowrap',
};

const pageSizeSelectSx: SystemStyleObject<Theme> = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'text.primary',
  minWidth: 40,
  '& .MuiSelect-select': {
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '4px',
    paddingRight: '24px',
  },
  '&:before, &:after': {
    display: 'none',
  },
};

const dividerSx: SystemStyleObject<Theme> = {
  width: 1,
  alignSelf: 'stretch',
  minHeight: 20,
  backgroundColor: theme => (theme as Theme).palette.divider,
};

const navSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.25,
} as const;

const pageIndicatorSx: SystemStyleObject<Theme> = {
  fontSize: '0.8125rem',
  color: 'text.secondary',
  minWidth: 52,
  textAlign: 'center',
  userSelect: 'none',
  fontVariantNumeric: 'tabular-nums',
};

type TemplatesPaginationProps = {
  totalCount: number;
  pageLimit: number;
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (offset: number) => void;
  onPageSizeChange: (limit: number) => void;
};

export const TemplatesPagination = ({
  totalCount,
  pageLimit,
  page,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}: TemplatesPaginationProps) => {
  const selectedPageSize = resolvePageLimit(pageLimit);
  const singlePage = totalPages <= 1;

  return (
    <Box sx={rootSx} data-testid="templates-pagination">
      <Typography sx={summarySx} component="span">
        {totalCount === 1
          ? '1 template'
          : `${startIndex}–${endIndex} of ${totalCount} templates`}
      </Typography>

      <Box sx={controlsSx}>
        <Box sx={pageSizeSx}>
          <Typography
            sx={pageSizeLabelSx}
            component="span"
            id="templates-page-size-label"
          >
            Per page
          </Typography>
          <Select
            value={selectedPageSize}
            onChange={event => {
              onPageSizeChange(Number(event.target.value));
            }}
            variant="standard"
            disableUnderline
            sx={pageSizeSelectSx}
            renderValue={String}
            inputProps={{
              'aria-label': 'Templates per page',
              'aria-labelledby': 'templates-page-size-label',
            }}
            data-testid="templates-page-size-select"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <MenuItem key={size} value={size} dense>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={dividerSx} aria-hidden />
        <Box sx={navSx}>
          <IconButton
            size="small"
            sx={{ padding: '6px' }}
            disabled={singlePage || page <= 0}
            onClick={() => onPageChange((page - 1) * pageLimit)}
            aria-label="Previous page"
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={pageIndicatorSx}
            component="span"
            data-testid="templates-page-indicator"
          >
            {page + 1} / {totalPages}
          </Typography>
          <IconButton
            size="small"
            sx={{ padding: '6px' }}
            disabled={singlePage || page + 1 >= totalPages}
            onClick={() => onPageChange((page + 1) * pageLimit)}
            aria-label="Next page"
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
