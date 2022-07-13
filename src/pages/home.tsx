import * as React from 'react';
import { Typography, Grid, CardMedia } from '@mui/material';
import libraryPage from '../images/homepage/libraryPage.png';
import bookListPage from '../images/homepage/bookListPage.png';
import bookPage from '../images/homepage/bookAddEditPage.png';
import authorListPage from '../images/homepage/authorListPage.png';
import authorPage from '../images/homepage/authorAddEditPage.png';
import ordersPage from '../images/homepage/ordersPage.png';

const Home = () => (
    <Grid container spacing={2}>
        <Grid item xs={2} />
        <Grid item xs={8}>
            <Grid container spacing={4}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography variant="h2">
                        Welcome to Apollo&apos;s Library
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography>
                        Apollo&apos;s Library is a site where book lovers
                        can keep track of their own personal library.
                        They will also be able to keep track of their purchase history in order to adjust
                        their book spending budget as much as needed.
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <CardMedia src={libraryPage} component="img" />
                </Grid>
                <Grid item xs={4}>
                    <CardMedia src={ordersPage} component="img" />
                </Grid>
                <Grid item xs={4}>
                    <CardMedia src={bookListPage} component="img" />
                </Grid>
                <Grid item xs={4}>
                    <CardMedia src={bookPage} component="img" />
                </Grid>
                <Grid item xs={4}>
                    <CardMedia src={authorListPage} component="img" />
                </Grid>
                <Grid item xs={4}>
                    <CardMedia src={authorPage} component="img" />
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={2} />
    </Grid>
);

export default Home;
