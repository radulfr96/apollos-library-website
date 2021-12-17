import React, { useContext, useEffect, useState } from 'react';
import {
    Grid, Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Axios from 'axios';
import { useHistory } from 'react-router';
import { WithSnackbarProps } from 'notistack';
import { PublisherListItem } from '../../interfaces/publisherListItem';
import PageHeading from '../../components/shared/PageHeading';
import PublishersTable from '../../components/PublishersTable';
import { AppContext } from '../../Context';

interface PublishersState {
    publishers: Array<PublisherListItem>;
}

const Publishers = (props: WithSnackbarProps) => {
    const [publisherState, setPublisherState] = useState<PublishersState>({
        publishers: [],
    });
    const history = useHistory();
    const context = useContext(AppContext);

    const { enqueueSnackbar } = props;

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

    const getPubishers = () => {
        Axios.get('/api/publisher')
            .then((response) => {
                setPublisherState({
                    ...publisherState,
                    publishers: response.data.publishers,
                });
            });
    };

    const deletePublisher = (id: number): void => {
        Axios.delete(`api/publisher/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getPubishers();
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to delete publisher please contact admin');
            });
    };

    useEffect(() => {
        getPubishers();
    });

    return (
        <Grid item xs={5} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Publishers" />
            </Grid>
            {
                context.isAdmin() && (
                    <Grid item xs={12}>
                        <PublishersTable
                            publishers={publisherState.publishers}
                            deletePublisher={deletePublisher}
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
                        history.push('addpublisher');
                    }}
                >
                    <Add />
                </Fab>
            </Grid>
        </Grid>
    );
};

export default Publishers;
