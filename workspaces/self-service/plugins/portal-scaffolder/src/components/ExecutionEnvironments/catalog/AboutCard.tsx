import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { keyframes } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from 'react';
import { Entity } from '@backstage/catalog-model';
import { getEntityEEDefinitionUrl } from './helpers';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const rotateSx = {
  animation: `${spin} 1s linear infinite`,
} as const;

const descriptionExpandSx = {
  color: 'primary',
  cursor: 'pointer',
  fontWeight: 600,
} as const;

const sourceLinkRowSx = {
  display: 'flex',
  alignItems: 'center',
  gridGap: 8,
  marginBottom: 1,
  '&:last-child': { marginBottom: 0 },
} as const;

const aboutCardSx = (theme: Theme) =>
  ({
    borderRadius: '12px',
    border: `1px solid ${theme.palette.divider}`,
  } as const);

const aboutCardContentSx = (theme: Theme) =>
  ({
    padding: theme.spacing(2.5),
  } as const);

const aboutCardHeaderSx = (theme: Theme) =>
  ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  } as const);

const aboutCardTitleSx = {
  fontWeight: 600,
  fontSize: '1.25rem',
} as const;

const aboutCardActionsSx = (theme: Theme) =>
  ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  } as const);

const aboutCardLabelSx = (theme: Theme) =>
  ({
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    marginBottom: theme.spacing(0.5),
  } as const);

const aboutCardValueSx = {
  fontSize: '0.875rem',
  wordBreak: 'break-word',
} as const;

const aboutCardSectionSx = (theme: Theme) =>
  ({
    marginTop: theme.spacing(2),
  } as const);

const aboutSourceIconSx = {
  fontSize: '0.875rem',
  flexShrink: 0,
} as const;

const aboutCardDividerSx = (theme: Theme) =>
  ({
    margin: theme.spacing(2, -2.5),
  } as const);

const aboutCardTagSx = (theme: Theme) =>
  ({
    borderRadius: '6px',
    borderColor: theme.palette.divider,
    textTransform: 'none',
    fontSize: '0.75rem',
    padding: theme.spacing(0.25, 1),
  } as const);

const aboutSourceLinkSx = (theme: Theme) =>
  ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    '&:hover': { textDecoration: 'underline' },
  } as const);

interface AboutCardProps {
  entity: Entity;
  ownerName: string | null;
  baseImageName: string | null;
  sourceLocationUrl: string | null;
  isRefreshing: boolean;
  isDownloadExperience: boolean;
  onRefresh: () => void;
}

export const AboutCard: React.FC<AboutCardProps> = ({
  entity,
  ownerName,
  baseImageName,
  sourceLocationUrl,
  isRefreshing,
  isDownloadExperience,
  onRefresh,
}) => {
  const theme = useTheme();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const scmProvider =
    entity?.metadata?.annotations?.['ansible.io/scm-provider']
      ?.toString()
      .toLowerCase() ?? '';
  let sourceLabel = 'Source';
  if (scmProvider.includes('github')) sourceLabel = 'GitHub';
  else if (scmProvider.includes('gitlab')) sourceLabel = 'GitLab';
  const description =
    entity?.metadata?.description ??
    entity?.metadata?.title ??
    'No description available.';
  const showReadMore = description.length > 150;

  return (
    <Card sx={aboutCardSx} variant="outlined">
      <CardContent sx={aboutCardContentSx}>
        <Box sx={aboutCardHeaderSx}>
          <Typography sx={aboutCardTitleSx}>About</Typography>
          {!isDownloadExperience && (
            <Box sx={aboutCardActionsSx}>
              <Tooltip title="Refresh">
                <IconButton
                  size="small"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh"
                >
                  <AutorenewIcon
                    sx={isRefreshing ? rotateSx : undefined}
                    style={{ color: '#757575' }}
                  />
                </IconButton>
              </Tooltip>
              {getEntityEEDefinitionUrl(entity) && (
                <IconButton
                  size="small"
                  component="a"
                  href={getEntityEEDefinitionUrl(entity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Edit definition"
                >
                  <EditIcon style={{ color: theme.palette.primary.main }} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>

        {/* Description - inline expand when > 150 chars, no TechDocs link */}
        <Box>
          <Typography sx={aboutCardLabelSx}>Description</Typography>
          <Typography sx={aboutCardValueSx}>
            {showReadMore && !descriptionExpanded
              ? `${description.slice(0, 150)}...`
              : description}
          </Typography>
          {showReadMore && (
            <>
              {descriptionExpanded ? (
                <Link
                  component="button"
                  variant="body2"
                  sx={descriptionExpandSx}
                  onClick={() => setDescriptionExpanded(false)}
                >
                  Read less
                </Link>
              ) : (
                <Link
                  component="button"
                  variant="body2"
                  sx={descriptionExpandSx}
                  onClick={() => setDescriptionExpanded(true)}
                >
                  Read more
                </Link>
              )}
            </>
          )}
        </Box>

        {/* Owner */}
        <Box sx={aboutCardSectionSx}>
          <Typography sx={aboutCardLabelSx}>Owner</Typography>
          <Typography sx={aboutCardValueSx}>{ownerName}</Typography>
        </Box>

        {/* Base image */}
        <Box sx={aboutCardSectionSx}>
          <Typography sx={aboutCardLabelSx}>Base image</Typography>
          <Typography sx={aboutCardValueSx}>{baseImageName ?? '—'}</Typography>
        </Box>

        {/* Source - hidden when download-experience is true; label by SCM, View in source + readme.md like Resources card */}
        {!isDownloadExperience && (
          <Box sx={aboutCardSectionSx}>
            <Typography sx={aboutCardLabelSx}>Source</Typography>
            {sourceLocationUrl ? (
              <Box sx={sourceLinkRowSx}>
                <Link
                  href={sourceLocationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={aboutSourceLinkSx}
                >
                  <span>{sourceLabel}</span>
                  <OpenInNewIcon sx={aboutSourceIconSx} />
                </Link>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={aboutCardDividerSx} />

        {/* Tags */}
        <Box marginTop={2}>
          <Typography sx={aboutCardLabelSx}>Tags</Typography>
          <Box sx={{ display: 'flex', gap: 1, marginTop: 1, flexWrap: 'wrap' }}>
            {Array.isArray(entity?.metadata?.tags) &&
            entity.metadata?.tags?.length > 0 ? (
              entity.metadata?.tags?.map((t: string) => (
                <Button
                  key={t}
                  variant="outlined"
                  size="small"
                  sx={aboutCardTagSx}
                  disabled
                >
                  {t}
                </Button>
              ))
            ) : (
              <Typography sx={aboutCardValueSx} color="text.secondary">
                No tags
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
