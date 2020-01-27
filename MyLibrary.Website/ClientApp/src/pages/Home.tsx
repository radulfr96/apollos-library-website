import * as React from 'react';
import { Typography, withStyles, Grid } from '@material-ui/core';

const styles = () => ({
});

interface HomeProps {
  classes: any,
}

class Home extends React.Component<HomeProps> {

  render() {
    const { classes } = this.props;

    return (
      <Grid item container xs={12}>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.title}>
            Welcome to My Library
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            My Library is a site where book lovers can keep track of their own personable library. You 
            will also be able to keep track of their purchase history in order to adjust their book spending 
            budget as much as needed.
          </Typography>
        </Grid>
      </Grid>
    );
  }
};

export default withStyles(styles, { withTheme: true })(Home);
