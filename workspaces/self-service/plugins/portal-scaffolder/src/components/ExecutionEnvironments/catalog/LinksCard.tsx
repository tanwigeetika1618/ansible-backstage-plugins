import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import GetAppIcon from '@mui/icons-material/GetApp';

const linkTextSx = {
  color: 'inherit',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    textDecoration: 'underline',
    transform: 'scale(1.03)',
  },
} as const;

interface LinksCardProps {
  onDownloadArchive: () => void;
}

export const LinksCard: React.FC<LinksCardProps> = ({ onDownloadArchive }) => {
  const links = [
    {
      icon: <GetAppIcon />,
      text: 'Download EE files',
      onClick: onDownloadArchive,
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: '16px', borderColor: '#D3D3D3' }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            margin: '6px 0 13px 10px',
          }}
        >
          Links
        </Typography>
        <Divider sx={{ margin: '0 -16px 12px' }} />

        {links.map(item => (
          <Box
            key={item.text}
            display="flex"
            alignItems="center"
            onClick={item.onClick}
            sx={{
              gap: 1.5,
              marginLeft: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            {item.icon}
            <Typography variant="body1" sx={linkTextSx}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
