import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import type { SystemStyleObject, Theme } from '@mui/system';
import type { ParsedEEDefinition } from '../../../utils/eeDefinitionUtils';

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

const aboutCardDescriptionSx: SystemStyleObject<Theme> = {
  color: 'text.secondary',
  fontSize: '0.875rem',
  mb: 2,
};

const aboutCardDividerSx: SystemStyleObject<Theme> = {
  mx: -2.5,
  my: 2,
};

const aboutCardLabelSx: SystemStyleObject<Theme> = {
  color: 'text.secondary',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  mb: 0.5,
};

const aboutCardSectionSx: SystemStyleObject<Theme> = {
  mt: 2,
};

const aboutCardValueSx = {
  fontSize: '0.875rem',
  wordBreak: 'break-word',
} as const;

function maskEEBuilderTokens(value: string): string {
  return value.replace(/\$\{[^}]+\}/g, 'token');
}

/**
 * Extracts the `org/repo` path from a tokenized SCM git URL
 * (e.g. `https://${TOKEN}@github.com/org/repo`).
 * Returns the original value unchanged when it isn't a URL.
 */
function formatCollectionName(name: string): string {
  try {
    const url = new URL(maskEEBuilderTokens(name));
    const urlPath = url.pathname.replace(/^\//, '').replace(/\.git$/, '');
    return urlPath || name;
  } catch {
    return name;
  }
}

/**
 * Formats the version suffix for display.
 * SCM collections (`type: 'git'`) show `(ref)`, e.g. `(main)`.
 * Regular collections show `vX.Y.Z`.
 */
function formatCollectionVersion(
  version: string | undefined,
  type: string | undefined,
): string {
  if (!version) return '';
  return type === 'git' ? ` (${version})` : ` v${version}`;
}

interface DefinedContentCardProps {
  parsedDefinition: ParsedEEDefinition | null;
}

/**
 * Card showing explicitly added collections, Python requirements (pip), and system packages
 * from the entity descriptor (spec.definition). Shows each section when present, or "From <file>"
 * when a file reference is used, otherwise "None".
 */
export const DefinedContentCard: React.FC<DefinedContentCardProps> = ({
  parsedDefinition,
}) => {
  const collections =
    parsedDefinition?.collections && parsedDefinition.collections.length > 0
      ? parsedDefinition.collections
      : null;
  const pythonPackages =
    parsedDefinition?.pythonPackages &&
    parsedDefinition.pythonPackages.length > 0
      ? parsedDefinition.pythonPackages
      : null;
  const systemPackages =
    parsedDefinition?.systemPackages &&
    parsedDefinition.systemPackages.length > 0
      ? parsedDefinition.systemPackages
      : null;

  return (
    <Card sx={aboutCardSx} variant="outlined">
      <CardContent sx={aboutCardContentSx}>
        <Box sx={aboutCardHeaderSx}>
          <Typography sx={aboutCardTitleSx}>Defined Content</Typography>
        </Box>

        <Divider sx={aboutCardDividerSx} />

        <Typography sx={aboutCardDescriptionSx}>
          Shows explicitly added collections, python requirements, and system
          packages only.
        </Typography>

        <Box sx={aboutCardSectionSx}>
          <Typography sx={aboutCardLabelSx}>
            Collections ({collections?.length || 0}):
          </Typography>
          <Box sx={{ mb: 1.5 }}>
            {collections && collections.length > 0 ? (
              collections.map(c => (
                <Typography key={c.name} variant="body2">
                  {formatCollectionName(c.name)}
                  {formatCollectionVersion(c.version, c.type)}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            )}
          </Box>

          <Box sx={aboutCardSectionSx}>
            <Typography sx={aboutCardLabelSx}>
              Python requirements ({pythonPackages?.length || 0}):
            </Typography>
            {pythonPackages && pythonPackages.length > 0 ? (
              pythonPackages.map(p => (
                <Typography key={p} sx={aboutCardValueSx}>
                  {p}
                </Typography>
              ))
            ) : (
              <Typography sx={aboutCardValueSx}>None</Typography>
            )}
          </Box>

          <Box sx={aboutCardSectionSx}>
            <Typography sx={aboutCardLabelSx}>
              System Packages ({systemPackages?.length || 0}):
            </Typography>
            {systemPackages && systemPackages.length > 0 ? (
              systemPackages.map(p => (
                <Typography key={p} sx={aboutCardValueSx}>
                  {p}
                </Typography>
              ))
            ) : (
              <Typography sx={aboutCardValueSx}>None</Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
