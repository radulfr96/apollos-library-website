import React, { useContext, useEffect, useState } from 'react';
import {
    Grid, Fab, CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import PageHeading from '../../components/shared/PageHeading';
import BusinesssTable from '../../components/BusinessTable';
import { AppContext } from '../../Context';
import ConfigHelper from '../../config/configHelper';
import BusinessListItem from '../../interfaces/businessListItem';

interface BusinessesState {
    businesses: Array<BusinessListItem>;
}

const Businesss = () => {
    const [businessState, setBusinessState] = useState<BusinessesState>({
        businesses: [],
    });
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const store = useStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { enqueueSnackbar } = useSnackbar();

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

    const getPubishers = () => new Promise<void>((resovle) => {
        Axios.get(`${configHelper.apiUrl}/api/business`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setBusinessState({
                    ...businessState,
                    businesses: response.data.businesses,
                });
                resovle();
            });
    });

    const deleteBusiness = (id: number): void => {
        Axios.delete(`${configHelper.apiUrl}/api/business/${id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getPubishers();
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to delete business please contact admin');
            });
    };

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        getPubishers()
            .then(() => {
                setIsLoading(false);
            });
    });

    if (isLoading) {
        return (<CircularProgress />);
    }
    return (
        <Grid item xs={5} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Businesses" />
            </Grid>
            {
                context.isAdmin() && (
                    <Grid item xs={12}>
                        <BusinesssTable
                            businesses={businessState.businesses}
                            deleteBusiness={deleteBusiness}
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
                        store.dispatch(push('/addbusiness'));
                    }}
                >
                    <Add />
                </Fab>
            </Grid>
        </Grid>
    );
};

export default Businesss;
