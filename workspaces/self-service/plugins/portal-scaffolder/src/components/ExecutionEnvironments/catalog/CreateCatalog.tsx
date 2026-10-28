import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { SystemStyleObject, Theme } from '@mui/system';
import eeIllustration from '../../../../images/ee-illustration.png';

const containerPaddingSx = {
  paddingTop: '90px',
  paddingLeft: '30px',
} as const;

const leftColumnSx: SystemStyleObject<Theme> = {
  maxWidth: 680,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  minHeight: '60vh',
  pl: 4,
};

const titleSx: SystemStyleObject<Theme> = {
  color: 'text.primary',
  mb: 2,
  fontWeight: 300,
  fontSize: '40px',
  lineHeight: '40px',
  letterSpacing: '0px',
};

const descriptionSx: SystemStyleObject<Theme> = {
  color: 'text.secondary',
  fontSize: 16,
  lineHeight: 1.6,
  mb: 3,
  mt: 3,
  width: '100%',
};

const buttonContainerSx: SystemStyleObject<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  '& > *:not(:first-of-type)': {
    ml: 2,
  },
};

const createButtonSx: SystemStyleObject<Theme> = {
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  px: 4,
  py: 2,
  borderRadius: '999px',
  textTransform: 'none',
  fontSize: 16,
  boxShadow: '0 6px 18px rgba(11,95,255,0.18)',
  '&:hover': {
    backgroundColor: 'primary.dark',
    color: 'primary.contrastText',
  },
  height: 40,
  minHeight: 40,
};

const linkSx: SystemStyleObject<Theme> = {
  color: 'primary.main',
  fontSize: 14,
  mt: 3,
  mb: 3,
  display: 'inline-block',
};

export const CreateCatalog = ({
  onTabSwitch,
}: {
  onTabSwitch: (index: number) => void;
}) => {
  return (
    <div data-testid="catalog-content">
      <Grid
        container
        spacing={4}
        alignItems="center"
        sx={containerPaddingSx}
      >
        {/* Left column */}
        <Grid item xs={12} md={6}>
          <Box sx={leftColumnSx}>
            <Typography variant="h3" component="h1" sx={titleSx}>
              No Execution Environment definition files, yet
            </Typography>

            <Typography variant="body1" sx={descriptionSx}>
              Get started with Execution Environment (EE) to ensure your
              playbooks run the same way, every time. Choose a recommended
              preset of a EE definition or start from scratch for full control.
              <br />
              Once your definition is saved, we'll walk you through building the
              EE.
            </Typography>

            <Box sx={buttonContainerSx}>
              <Button
                variant="contained"
                size="large"
                onClick={() => onTabSwitch(1)}
                sx={createButtonSx}
              >
                Create Execution Environment definition file
              </Button>

              <Link
                href="https://red.ht/self-service_build_and_use_ee_definition"
                underline="hover"
                sx={linkSx}
                target="_blank"
                rel="noopener noreferrer"
              >
                How to build and use Execution Environment from definition files
              </Link>
            </Box>
          </Box>
        </Grid>

        {/* Right column (illustration) */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ textAlign: 'center' }}
        >
          <Box
            component="img"
            src={eeIllustration}
            alt="Execution environment illustration"
            sx={theme => ({
              width: '320px',
              maxWidth: '100%',
              display: 'inline-block',
              [theme.breakpoints.up('md')]: {
                width: '520px',
              },
            })}
          />
        </Grid>
      </Grid>
    </div>
  );
};
