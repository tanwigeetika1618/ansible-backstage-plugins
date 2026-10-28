import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { SystemStyleObject, Theme } from '@mui/system';

const aboutCardSx: SystemStyleObject<Theme> = {
  borderRadius: '12px',
  border: theme => `1px solid ${(theme as Theme).palette.divider}`,
};

const aboutCardContentSx: SystemStyleObject<Theme> = {
  padding: theme => (theme as Theme).spacing(2.5),
};

const aboutCardHeaderSx: SystemStyleObject<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

const aboutCardTitleSx = {
  fontWeight: 600,
  fontSize: '1.25rem',
} as const;

const aboutCardDividerSx: SystemStyleObject<Theme> = {
  mx: -2.5,
  my: 2,
};

const linkRowSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 1.5,
  '&:last-child': {
    mb: 0,
  },
};

const linkSx = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
} as const;

interface ResourcesCardProps {}

/**
 * Card with View in source and readme.md links.
 */
export const ResourcesCard: React.FC<ResourcesCardProps> = () => {
  return (
    <Card sx={aboutCardSx} variant="outlined">
      <CardContent sx={aboutCardContentSx}>
        <Box sx={aboutCardHeaderSx}>
          <Typography sx={aboutCardTitleSx}>Resources</Typography>
        </Box>

        <Divider sx={aboutCardDividerSx} />

        <Box sx={{ marginLeft: '10px' }}>
          <Box sx={linkRowSx}>
            <OpenInNewIcon fontSize="small" color="primary" />
            <Link
              href="https://red.ht/ee_assembly-intro-to-builder"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="primary"
              sx={linkSx}
            >
              Introduction to automation execution environments
            </Link>
          </Box>
          <Box sx={linkRowSx}>
            <OpenInNewIcon fontSize="small" color="primary" />
            <Link
              href="https://red.ht/self-service-create-ee-definitions"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="primary"
              sx={linkSx}
            >
              Create execution environment definitions in self-service
              automation portal
            </Link>
          </Box>
          <Box sx={linkRowSx}>
            <OpenInNewIcon fontSize="small" color="primary" />
            <Link
              href="https://red.ht/ee_assembly-using-builder"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="primary"
              sx={linkSx}
            >
              Build execution environment images with Ansible Builder
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
