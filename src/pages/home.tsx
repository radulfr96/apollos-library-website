import * as React from 'react';
import {
    Typography, Grid, CardMedia, Card, Paper,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import libraryPage from '../images/homepage/libraryPage.png';
import bookListPage from '../images/homepage/bookListPage.png';
import bookPage from '../images/homepage/bookAddEditPage.png';
import authorListPage from '../images/homepage/authorListPage.png';
import authorPage from '../images/homepage/authorAddEditPage.png';
import ordersPage from '../images/homepage/ordersPage.png';

const Home = () => (
    <Grid item xs={12} sx={{ marginBottom: '100px' }}>
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
                    <Grid item xs={12}>
                        <Carousel NextIcon={<ChevronRight />} PrevIcon={<ChevronLeft />}>
                            <CardMedia src={libraryPage} component="img" />
                            <CardMedia src={ordersPage} component="img" />
                            <CardMedia src={bookListPage} component="img" />
                            <CardMedia src={bookPage} component="img" />
                            <CardMedia src={authorListPage} component="img" />
                            <CardMedia src={authorPage} component="img" />
                        </Carousel>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2} />
        </Grid>
        <Grid container spacing={4} sx={{ marginTop: '50px' }}>
            <Grid item xs={2} />
            <Grid item xs={8}>
                <Paper variant="elevation" elevation={24} sx={{ background: '#3B3BC4', paddingLeft: '20px', paddingRight: '20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Card sx={{ minHeight: '100px' }}>
                                Community Driven Content
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card sx={{ minHeight: '100px' }}>
                                Keep Track of your own library
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card sx={{ minHeight: '100px' }}>
                                Track your book spending and budget accordingly
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={2} />
        </Grid>
    </Grid>
);

export default Home;
