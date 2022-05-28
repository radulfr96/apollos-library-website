import { Add } from '@mui/icons-material';
import { Fab, Grid } from '@mui/material';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import LibraryTable from '../../components/LibraryTable';
import PageHeading from '../../components/shared/PageHeading';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../context';
import LibraryEntryListItem from '../../interfaces/libraryEntryListItem';

interface LibraryState {
    entries: Array<LibraryEntryListItem>,
}

const LibraryPage = () => {
    const [libraryState, setLibraryState] = useState<LibraryState>({
        entries: [],
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

    const getLibrary = () => {
        Axios.get(`${configHelper.apiUrl}/api/library`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setLibraryState({ ...libraryState, entries: response.data.libraryEntries });
            });
    };

    const deleteEntry = (id: number): void => {
        Axios.delete(`${configHelper.apiUrl}/api/library/${id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getLibrary();
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to delete entry please contact admin');
            });
    };

    useEffect(() => {
        getLibrary();
    });

    return (
        <Grid item xs={5} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Your Library" />
            </Grid>
            {
                context.isAdmin() && (
                    <Grid item xs={12}>
                        <LibraryTable
                            entries={libraryState.entries}
                            deleteEntry={deleteEntry}
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
                        store.dispatch(push('/addentry'));
                    }}
                >
                    <Add />
                </Fab>
            </Grid>
        </Grid>
    );
};

export default LibraryPage;
