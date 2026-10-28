import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LinkIcon from '@mui/icons-material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CodeIcon from '@mui/icons-material/Code';

import { CollectionResourcesCardProps } from './types';
import { useCollectionsStyles } from './styles';
import { isGitHubUrl } from './collectionResourceUrls';

const getLinkIcon = (title: string, url: string) => {
  const titleLower = title.toLowerCase();

  if (titleLower.includes('readme')) {
    return DescriptionOutlinedIcon;
  }
  if (titleLower.includes('doc') || titleLower.includes('documentation')) {
    return MenuBookOutlinedIcon;
  }
  if (titleLower.includes('github') || isGitHubUrl(url)) {
    return GitHubIcon;
  }
  if (titleLower.includes('issue') || titleLower.includes('bug')) {
    return BugReportOutlinedIcon;
  }
  if (titleLower.includes('home') || titleLower.includes('homepage')) {
    return HomeOutlinedIcon;
  }
  if (
    titleLower.includes('source') ||
    titleLower.includes('code') ||
    titleLower.includes('repository')
  ) {
    return CodeIcon;
  }
  return LinkIcon;
};

export const CollectionResourcesCard = ({
  entity,
}: CollectionResourcesCardProps) => {
  const classes = useCollectionsStyles();

  const entityLinks = entity.metadata.links || [];

  const spec = entity.spec || {};
  const readmeUrl =
    typeof spec.collection_readme_url === 'string'
      ? spec.collection_readme_url
      : undefined;

  const hasReadmeLink = entityLinks.some(link => {
    const title = link.title?.toLowerCase() || '';
    return title.includes('readme');
  });

  const mappedLinks = entityLinks.map(link => ({
    title: link.title || 'Link',
    url: link.url,
    icon: link.icon,
  }));

  const allLinks =
    readmeUrl && !hasReadmeLink
      ? [...mappedLinks, { title: 'README', url: readmeUrl }]
      : mappedLinks;

  if (allLinks.length === 0) {
    return null;
  }

  return (
    <Card className={classes.resourcesCard} variant="outlined">
      <CardContent className={classes.resourcesCardContent}>
        <Typography className={classes.resourcesCardTitle}>
          Resources
        </Typography>

        {allLinks.map((link, index) => {
          const IconComponent = getLinkIcon(link.title, link.url);
          return (
            <Link
              key={`${link.url}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.resourceLink}
              underline="none"
            >
              <IconComponent className={classes.resourceLinkIcon} />
              <Box>
                <Typography className={classes.resourceLinkText}>
                  {link.title}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
};
