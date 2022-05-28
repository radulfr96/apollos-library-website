import { Add } from '@mui/icons-material';
import { Fab, Grid } from '@mui/material';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import SeriesTable from '../../components/SeriesTable';
import PageHeading from '../../components/shared/PageHeading';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../context';
import { SeriesListItem } from '../../interfaces/seriesListItem';

interface SeriesState {
    series: Array<SeriesListItem>;
}

const SeriesListPage = () => {
    const [seriesState, setSeriesState] = useState<SeriesState>({
        series: [],
    });

    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const store = useStore();

    const renderErrorSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const getSeries = () => {
        Axios.get(`${configHelper.apiUrl}/api/series`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setSeriesState({ ...seriesState, series: response.data.series });
            });
    };

    const deleteSeries = (id: number): void => {
        Axios.delete(`${configHelper.apiUrl}/api/series/${id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getSeries();
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to delete series please contact admin');
            });
    };

    useEffect(() => {
        getSeries();
    });

    return (
        <Grid item xs={5} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Series" />
            </Grid>
            {
                context.isAdmin() && (
                    <Grid item xs={12}>
                        <SeriesTable
                            series={seriesState.series}
                            deleteSeries={deleteSeries}
                        />
                    </Grid>
                )
            }

            <Grid item xs={12}>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        marginTop: '10px',
                        float: 'right',
                    }}
                    onClick={() => {
                        store.dispatch(push('/addseries'));
                    }}
                >
                    <Add />
                </Fab>
            </Grid>
        </Grid>
    );
};

export default SeriesListPage;
