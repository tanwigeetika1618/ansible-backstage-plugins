import { useEffect, useState, useMemo } from 'react';
import {
  Header,
  Page,
  Content,
  MarkdownContent,
} from '@backstage/core-components';
import { StepForm } from './StepForm';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  scaffolderApiRef,
  type FieldExtensionOptions,
} from '@backstage/plugin-scaffolder-react';
import type { TemplateParameterSchema } from '@backstage/plugin-scaffolder-common';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import type { Theme } from '@mui/material/styles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { rootRouteRef } from '../../routes';

const headerTitleColorSx = (theme: Theme) =>
  ({
    color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
  } as const);

const headerSubtitleSx = (theme: Theme) =>
  ({
    display: 'inline-block',
    color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
    opacity: 0.8,
    maxWidth: '75ch',
    marginTop: '8px',
    fontWeight: 500,
    lineHeight: 1.57,
  } as const);

const headerTitleContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
} as const;

const backButtonContainerSx = (theme: Theme) =>
  ({
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(-1),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(-1.5),
    },
  } as const);

const backButtonSx = (theme: Theme) =>
  ({
    color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  } as const);

export const CreateTask = ({
  nativeFields,
}: { nativeFields?: FieldExtensionOptions<any, any>[] } = {}) => {
  const { namespace, templateName } = useParams<{
    namespace: string;
    templateName: string;
  }>();
  const scaffolderApi = useApi(scaffolderApiRef);
  const catalogApi = useApi(catalogApiRef);
  const rootLink = useRouteRef(rootRouteRef);
  const location = useLocation();

  const [entityTemplate, setEntityTemplate] =
    useState<TemplateParameterSchema | null>(null);
  const [templateEntity, setTemplateEntity] = useState<{
    spec?: { type?: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const initialFormData = useMemo(() => {
    const state = location.state as {
      initialFormData?: Record<string, any>;
    } | null;
    return state?.initialFormData;
  }, [location.state]);

  const finalSubmit = async (
    formData: Record<string, any>,
    secrets?: Record<string, string>,
  ) => {
    if (!namespace || !templateName) {
      throw new Error('Missing namespace or name in URL parameters');
    }

    try {
      const task = await scaffolderApi.scaffold({
        templateRef: `template:${namespace}/${templateName}`,
        values: formData,
        secrets,
      });

      // Redirect to the task details page
      navigate(
        `${rootLink()}/create/tasks/${task.taskId}${
          nativeFields ? location.search : ''
        }`,
      );
    } catch (err) {
      console.error('Error during final submit:', err); // eslint-disable-line no-console
    }
  };

  useEffect(() => {
    const fetchEntity = async () => {
      setLoading(true);
      try {
        if (!templateName || !namespace) {
          throw new Error('Missing name or namespace in URL parameters');
        }
        const templateRef = `template:${namespace}/${templateName}`;
        const response = await scaffolderApi.getTemplateParameterSchema(
          templateRef,
        );
        setEntityTemplate(response as TemplateParameterSchema);

        try {
          const entityRef = `template:${namespace}/${templateName}`;
          const entity = await catalogApi.getEntityByRef(entityRef);
          if (entity) {
            setTemplateEntity(entity);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.debug('Optional catalog entity lookup failed:', e);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch entity:', err);
        setError('Failed to fetch entity');
      } finally {
        setLoading(false);
      }
    };

    void fetchEntity();
  }, [templateName, namespace, scaffolderApi, catalogApi]);

  if (loading) {
    return (
      <Page themeId="tool">
        <Header title="Loading..." />
        <Content>
          <p>Loading entity...</p>
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="tool">
        <Header title="Error" />
        <Content>
          <p>{error}</p>
        </Content>
      </Page>
    );
  }

  if (!entityTemplate) {
    return (
      <Page themeId="tool">
        <Header title="No Data" />
        <Content>
          <p>No entity data available.</p>
        </Content>
      </Page>
    );
  }

  const [description, templateInfo] = entityTemplate.description
    ? entityTemplate.description.split('(Template Info)')
    : [];

  const handleBack = () => {
    const isExecutionEnvironment =
      templateEntity?.spec?.type?.includes('execution-environment') ?? false;

    if (isExecutionEnvironment) {
      navigate(`${rootLink()}/ee/create`);
    } else {
      navigate(`${rootLink()}`);
    }
  };

  return (
    <Page themeId="website">
      <Header
        pageTitleOverride="Create Task"
        title={
          <Box sx={headerTitleContainerSx}>
            <Box sx={backButtonContainerSx}>
              <IconButton
                onClick={handleBack}
                sx={backButtonSx}
                aria-label="go back"
                data-testid="back-button"
              >
                <ArrowBack />
              </IconButton>
            </Box>
            <Box
              component="span"
              sx={headerTitleColorSx}
              data-testid="template-task--title"
            >
              {entityTemplate.title}
            </Box>
          </Box>
        }
        subtitle={
          <Box component="span" sx={headerSubtitleSx}>
            {description}
          </Box>
        }
        style={{ background: 'inherit', paddingTop: 0 }}
      />
      <Content>
        <Grid container direction="row-reverse">
          {templateInfo && (
            <Grid item xs={12} sm={12} md={5} lg={5}>
              <Card>
                <CardHeader title="About Template" />
                <CardContent>
                  <MarkdownContent content={templateInfo} />
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sm={12}
            md={templateInfo ? 7 : 12}
            lg={templateInfo ? 7 : 12}
          >
            <StepForm
              steps={entityTemplate.steps}
              submitFunction={finalSubmit}
              initialFormData={initialFormData}
              storageKey={`${namespace}/${templateName}`}
              nativeFields={nativeFields}
            />
            <Box
              display="flex"
              justifyContent="flex-end"
              marginTop="16px"
              marginBottom={4}
            >
              <Button
                onClick={() => {
                  const isExecutionEnvironment =
                    templateEntity?.spec?.type?.includes(
                      'execution-environment',
                    ) ?? false;

                  if (isExecutionEnvironment) {
                    navigate(`${rootLink()}/ee/create`);
                  } else {
                    navigate(`${rootLink()}`);
                  }
                }}
                variant="text"
                color="primary"
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
