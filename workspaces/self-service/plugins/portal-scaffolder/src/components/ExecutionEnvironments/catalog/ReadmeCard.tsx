import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { MarkdownContent } from '@backstage/core-components';

const scrollAreaSx = {
  maxHeight: '58vh',
  overflowY: 'auto',
  paddingRight: 1,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#bfbfbf',
    borderRadius: '4px',
  },
} as const;

interface ReadmeCardProps {
  readmeContent: string;
}

export const ReadmeCard: React.FC<ReadmeCardProps> = ({ readmeContent }) => {
  return (
    <Box flex={1} sx={{ minHeight: 0 }}>
      <Card
        variant="outlined"
        sx={{ borderRadius: '16px', borderColor: '#D3D3D3' }}
      >
        <CardContent sx={{ flex: 1, minHeight: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              marginBottom: 1.5,
            }}
          >
            README
          </Typography>
          <Box sx={scrollAreaSx}>
            <MarkdownContent
              className="readme-markdown-scroll"
              content={readmeContent}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
