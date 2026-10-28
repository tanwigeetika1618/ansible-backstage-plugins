import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import Typography from '@mui/material/Typography';
import Star from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';
import useAsync from 'react-use/esm/useAsync';
import { InfoCard, Link } from '@backstage/core-components';
import { rootRouteRef } from '../../../routes';

export const YellowStar: React.ComponentType = styled(Star)({
  color: '#f3ba37',
});

export const Favourites = () => {
  const catalogApi = useApi(catalogApiRef);
  const rootLink = useRouteRef(rootRouteRef);
  const {
    value: entities,
    loading,
    error,
  } = useAsync(() => {
    return catalogApi.getEntities({ filter: [{ 'metadata.tags': 'ansible' }] });
  }, []);
  const { isStarredEntity } = useStarredEntities();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const starredEntities = entities?.items.filter(entity =>
    isStarredEntity(entity),
  );

  const getStarredList = () =>
    starredEntities?.map(entity => (
      <li
        key={entity.metadata.uid ?? entity.metadata.name}
        style={{ marginBottom: '22px' }}
      >
        <Typography variant="body1" sx={{ display: 'flex' }}>
          <Typography
            component="span"
            sx={{ float: 'left', marginRight: '10px' }}
          >
            <YellowStar />
          </Typography>
          <Typography component="span">
            <Typography component="span">
              <Link
                to={`${
                  entity.kind === 'Template'
                    ? `${rootLink()}/create/templates/default/${entity.metadata.name}`
                    : `${rootLink()}/catalog/default/component/${entity.metadata.name}`
                }`}
              >
                {entity.metadata.name}
              </Link>
              <br />
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              sx={theme => ({
                color:
                  theme.palette.mode === 'light'
                    ? '#757575'
                    : 'currentColor',
              })}
            >
              {entity.kind}
            </Typography>
          </Typography>
        </Typography>
      </li>
    ));

  return (
    <InfoCard title="Starred Ansible Items">
      {starredEntities && starredEntities?.length > 0 ? (
        <ul
          style={{ listStyle: 'none', paddingLeft: 10 }}
          data-testid="starred-list"
        >
          {getStarredList()}
        </ul>
      ) : (
        <Typography
          sx={theme => ({
            color:
              theme.palette.mode === 'light' ? '#757575' : 'currentColor',
          })}
          data-testid="no-starred-list"
        >
          Click the star beside an Ansible entity name to add it to this list!
        </Typography>
      )}
    </InfoCard>
  );
};
