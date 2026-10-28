import { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CreateComponentIcon from '@mui/icons-material/AddCircleOutline';
import { Header, Page, HeaderTabs, Content } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';

import { rootRouteRef } from '../../routes';
import { CreateContent } from './create/CreateContent';
import { EntityCatalogContent } from './catalog/CatalogContent';

const tabWithIconSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
} as const;

export const EEHeader = () => {
  const headerTitle = (
    <Typography
      variant="h4"
      component="h1"
      sx={{ fontWeight: 'bold', fontSize: '2rem' }}
    >
      Execution Environments definition files
    </Typography>
  );

  return (
    <Header
      title={headerTitle}
      pageTitleOverride="Execution Environments Definition Files"
      style={{
        fontFamily: 'Red Hat Text',
        color: 'white',
        paddingBottom: '16px',
      }}
    />
  );
};

const tabs = [
  { id: 0, label: 'Catalog', icon: <CategoryOutlinedIcon />, path: 'catalog' },
  { id: 1, label: 'Create', icon: <CreateComponentIcon />, path: 'create' },
];

const getTabIndexFromPath = (pathname: string): number => {
  if (pathname.includes('/ee/create')) return 1;
  return 0;
};

export const EETabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rootLink = useRouteRef(rootRouteRef);

  const selectedTab = useMemo(
    () => getTabIndexFromPath(location.pathname),
    [location.pathname],
  );

  useEffect(() => {
    const tabIndex = (location.state as { tabIndex?: number })?.tabIndex;
    if (tabIndex !== undefined) {
      const tab = tabs[tabIndex];
      if (tab) {
        navigate(`${rootLink()}/ee/${tab.path}`, {
          replace: true,
          state: {},
        });
      }
    }
  }, [location.state, navigate, rootLink]);

  const onTabSelect = useCallback(
    (index: number) => {
      const tab = tabs[index];
      if (tab) {
        navigate(`${rootLink()}/ee/${tab.path}`);
      }
    },
    [navigate, rootLink],
  );

  const handleTabSwitch = useCallback(
    (index: number) => {
      onTabSelect(index);
    },
    [onTabSelect],
  );

  const content = useMemo(() => {
    if (selectedTab === 1) {
      return <CreateContent key="create" />;
    }
    return <EntityCatalogContent key="catalog" onTabSwitch={handleTabSwitch} />;
  }, [selectedTab, handleTabSwitch]);

  return (
    <Page themeId="app">
      <EEHeader />
      <HeaderTabs
        selectedIndex={selectedTab}
        onChange={onTabSelect}
        tabs={
          tabs.map(({ label, icon }) => ({
            id: label.toLowerCase(),
            label: (
              <Box sx={tabWithIconSx}>
                {icon}
                {label}
              </Box>
            ),
          })) as any
        }
      />
      <Content>{content}</Content>
    </Page>
  );
};
