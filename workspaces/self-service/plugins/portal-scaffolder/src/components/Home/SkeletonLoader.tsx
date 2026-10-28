import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';

export const SkeletonLoader = () => {
  return (
    <Card sx={{ width: '30%', height: '100%' }}>
      <CardHeader
        title={<Skeleton variant="text" width="100%" height="100%" />}
        subheader={<Skeleton variant="text" width="100%" height="100%" />}
      />
      <CardContent>
        <Skeleton variant="text" width="100%" height="100%" />
        <Skeleton variant="text" width="100%" height="100%" />
        <Skeleton variant="rectangular" width="100%" height="190px" />
        <Skeleton variant="rectangular" width="100%" height="190px" />
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          marginLeft: 1,
          marginRight: 1,
          justifyContent: 'space-between',
        }}
      >
        <Skeleton variant="circular" width="20px" height="20px" />
        <Skeleton
          variant="text"
          width="64px"
          height="50px"
          sx={{ padding: '3px 9px', borderRadius: '16px' }}
        />
      </CardActions>
    </Card>
  );
};
