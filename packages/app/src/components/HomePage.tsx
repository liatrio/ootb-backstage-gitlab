
import { Typography, Container, Box, Card, CardContent, CardActions, Button, Grid, Divider } from '@material-ui/core';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AppsIcon from '@material-ui/icons/Apps';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Link as RouterLink } from 'react-router-dom';

const options = [
  {
    title: 'Set up Infrastructure',
    description: 'Provision and manage EK8s clusters and infrastructure components.',
    icon: <SettingsEthernetIcon fontSize="large" color="primary" />,
    link: '/catalog?filters[kind]=component&filters[tags]=ek8s',
    button: 'View EK8s Components',
  },
  {
    title: 'Set up New Deployment',
    description: 'Deploy using FlowKit deployment templates for streamlined CI/CD.',
    icon: <RocketLaunchIcon fontSize="large" color="primary" />,
    link: '/create?filters[tags]=flowkit&filters[tags]=deploy',
    button: 'View Deployment Templates',
  },
  {
    title: 'Set up New App',
    description: 'Bootstrap a new application using FlowKit app templates.',
    icon: <AppsIcon fontSize="large" color="primary" />,
    link: '/create?filters[tags]=flowkit&filters[tags]=app',
    button: 'View App Templates',
  },
];

const HomePage = () => (
  <Container maxWidth="xl">
    <Box mt={8} textAlign="center">
      <Typography variant="h2" gutterBottom>
        Welcome to Out of the Box Developer Portal
      </Typography>
      <Typography variant="h6" color="textSecondary" paragraph>
        What do you want to do today?
      </Typography>
    </Box>
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Divider style={{ width: '100%' }} />
      <ArrowDownwardIcon color="action" style={{ margin: 16 }} />
      <Box width="100%" maxWidth="1600px" mx="auto">
        <Grid container spacing={4} justifyContent="center" alignItems="stretch" direction="row">
          {options.map(option => (
            <Grid item xs={12} sm={6} md={4} key={option.title} style={{ display: 'flex' }}>
              <Card elevation={4} style={{ marginBottom: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent style={{ textAlign: 'center', wordBreak: 'break-word', flexGrow: 1 }}>
                  {option.icon}
                  <Typography variant="h5" gutterBottom style={{ wordBreak: 'break-word' }}>{option.title}</Typography>
                  <Typography variant="body1" color="textSecondary" style={{ wordBreak: 'break-word' }}>{option.description}</Typography>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                  <Button
                    component={RouterLink}
                    to={option.link}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    {option.button}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  </Container>
);

export default HomePage;
