import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ImportStepper } from '@backstage/plugin-catalog-import';

export const CatalogImport = () => {
  return (
    <Page themeId="tools">
      <Header
        pageTitleOverride="Register Components"
        title={
          <Typography
            component="span"
            sx={theme => ({
              color:
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.87)'
                  : '#ffffff',
            })}
          >
            Add Template
          </Typography>
        }
        subtitle={
          <Typography
            component="span"
            sx={theme => ({
              display: 'inline-block',
              color:
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.87)'
                  : '#ffffff',
              opacity: 0.8,
              maxWidth: '75ch',
              marginTop: '8px',
              fontWeight: 500,
              lineHeight: 1.57,
            })}
          >
            Add a new template to the catalog for users in your AAP organization
            to use.
          </Typography>
        }
        style={{ background: 'inherit' }}
      />
      <Content>
        <Grid container spacing={2} direction="row-reverse">
          <Grid item xs={12} md={4} lg={6} xl={8}>
            <InfoCard
              title="About"
              titleTypographyProps={{ component: 'h3' }}
              deepLink={{
                title: 'View template YAML example',
                link: 'https://red.ht/portal_template_example',
              }}
            >
              <Typography variant="body2" paragraph>
                Import custom templates. Provide the URL to the existing
                Template YAML file hosted in a source code repository. The
                import process will analyze the file(s), and add them to
                automation portal. Please remember that managing these custom
                templates will require automation portal RBAC rules.{' '}
                <a
                  href="https://red.ht/self-service-add-template_self-service-working-tem"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'underline' }}
                >
                  Learn more about configuring RBAC rules for external templates
                  in our documentation.
                </a>
              </Typography>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={8} lg={6} xl={4}>
            <ImportStepper />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
