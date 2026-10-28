import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { MarkdownContent } from '@backstage/core-components';

import { CollectionReadmeCardProps } from './types';
import { useCollectionsStyles } from './styles';

export const CollectionReadmeCard = ({
  readmeContent,
  isLoading = false,
  isHtml = false,
}: CollectionReadmeCardProps) => {
  const classes = useCollectionsStyles();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box className={classes.readmeLoading}>
          <CircularProgress size={32} />
        </Box>
      );
    }

    if (readmeContent) {
      if (isHtml) {
        return (
          <Box
            className={classes.readmeHtmlContent}
            dangerouslySetInnerHTML={{ __html: readmeContent }}
          />
        );
      }
      return <MarkdownContent content={readmeContent} />;
    }

    return (
      <Box className={classes.readmeEmpty}>
        <Typography variant="body2" color="text.secondary">
          No README content available for this collection.
        </Typography>
      </Box>
    );
  };

  return (
    <Card className={classes.readmeCard} variant="outlined">
      <Box className={classes.readmeCardHeader}>
        <DescriptionOutlinedIcon style={{ fontSize: '1.25rem' }} />
        <Typography className={classes.readmeCardTitle}>README</Typography>
      </Box>

      <Box className={classes.readmeCardContent}>{renderContent()}</Box>
    </Card>
  );
};
