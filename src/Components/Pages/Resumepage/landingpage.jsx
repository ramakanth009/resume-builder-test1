// LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Grid, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 0',
  },
  button: {
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const LandingPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const experienceLevels = [
    { path: '/fresher', title: 'Fresher', range: '0-6 months experience', color: 'primary' },
    { path: '/entry-level', title: 'Entry Level', range: '6 months - 3 years experience', color: 'success' },
    { path: '/mid-level', title: 'Mid Level', range: '3-6 years experience', color: 'secondary' },
    { path: '/senior', title: 'Senior', range: '6+ years experience', color: 'error' }
  ];

  const handleNavigation = (path) => {
    const level = path.substring(1); // Remove the leading slash
    navigate(path, { state: { experienceLevel: level } });
  };

  return (
    <Container>
      <Box className={classes.root}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Select Your Experience Level
        </Typography>
        <Grid container spacing={3} maxWidth="md">
          {experienceLevels.map((level) => (
            <Grid item xs={12} sm={6} key={level.path}>
              <Button
                variant="contained"
                color={level.color}
                onClick={() => handleNavigation(level.path)}
                fullWidth
                className={classes.button}
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  {level.title}
                </Typography>
                <Typography variant="body2">
                  {level.range}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default LandingPage;