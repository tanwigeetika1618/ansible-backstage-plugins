import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { FavoriteEntity } from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { usePermission } from '@backstage/plugin-permission-react';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { rootRouteRef } from '../../../routes';

export function WizardCard({
  template,
}: Readonly<{ template: TemplateEntityV1beta3 }>) {
  const theme = useTheme();
  const navigate = useNavigate();
  const rootLink = useRouteRef(rootRouteRef);
  const namespace = template?.metadata?.namespace ?? 'default';
  const name = template?.metadata?.name ?? '';
  const { allowed: canCreateTask } = usePermission({
    permission: taskCreatePermission,
  });

  const chooseWizardItem = () =>
    navigate(`${rootLink()}/create/templates/${namespace}/${name}`);

  const onTemplateClick = () =>
    navigate(`${rootLink()}/catalog/${namespace}/${name}`);

  return (
    <Card data-testid={`${namespace}-${name}`}>
      <CardHeader
        title={
          <Link
            data-testid="template--title"
            onClick={onTemplateClick}
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            {template?.metadata?.title}
          </Link>
        }
        subheader={template?.spec?.type?.toString()}
        action={<FavoriteEntity entity={template} style={{ padding: 0 }} />}
        style={{ padding: 16 }}
      />
      <Divider />
      <CardContent>
        <div className="description">
          <Typography
            style={{
              marginBottom: '16px',
            }}
            data-testid="template--description"
          >
            {(template?.metadata?.description?.trim().length &&
              template?.metadata?.description) || (
              <Typography style={{ color: 'rgba(119, 119, 109, 1)' }}>
                No description available
              </Typography>
            )}
          </Typography>
        </div>
        <Divider />
        {(template?.metadata?.tags ?? []).length > 0 && (
          <div className="tags" data-testid="template--tags">
            <div style={{ marginTop: 8 }}>
              {template?.metadata?.tags?.map(tag => (
                <Chip
                  label={tag}
                  key={tag}
                  size="small"
                  data-testid={`template-tags--${tag}`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardActions
        disableSpacing
        style={{
          marginLeft: 1,
          marginRight: 1,
          justifyContent: 'space-between',
        }}
      >
        <div className="owner">
          {template?.spec?.owner && (
            <div>
              <PersonIcon
                fontSize="small"
                style={{ position: 'relative', top: 4 }}
              />
              <Typography
                component="span"
                style={{
                  color:
                    theme.palette.mode === 'light'
                      ? '#181818'
                      : 'rgba(255, 255, 255, 0.70)',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '24px',
                  marginBottom: '16px',
                }}
              >
                {template.spec.owner}
              </Typography>
            </div>
          )}
        </div>
        {canCreateTask ? (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            data-testid="template-card-actions--create"
            onClick={chooseWizardItem}
          >
            Start
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
}
