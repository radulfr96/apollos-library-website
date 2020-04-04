import * as React from 'react';
import {
    withStyles, Grid, WithStyles, Fab, createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { compose } from 'recompose';
import { withRouter, RouteProps, RouteComponentProps } from 'react-router';
import { Genre } from '../../interfaces/genre';
import PageHeading from '../../components/shared/PageHeading';
import GenresTable from '../../components/GenresTable';

interface GenresProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = createStyles({
    addGenreButton: {
        marginTop: '10px',
        float: 'right',
    },
    navLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
    },
});

interface GenresState {
    genres: Array<Genre>;
}

export class Genres extends React.Component<
    GenresProps
    & WithStyles<typeof useStyles>
    & RouteProps
    & RouteComponentProps
    & WithSnackbarProps
    , GenresState> {
    constructor(props: any) {
        super(props);
        this.deleteGenre = this.deleteGenre.bind(this);
        this.getGenres = this.getGenres.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            genres: [],
        };
    }

    componentDidMount() {
        this.getGenres();
    }

    getGenres() {
        Axios.get('/api/genre')
            .then((response) => {
                this.setState({
                    genres: response.data.genres,
                });
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    this.setState({
                        genres: [],
                    });
                }
            });
    }

    deleteGenre(id: string): void {
        Axios.delete(`api/genre/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    this.renderSuccessSnackbar('Delete successful');
                    this.getGenres();
                }
            })
            .catch(() => {
                this.renderErrorSnackbar('Unable to delete genre please contact admin');
            });
    }

    renderErrorSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    renderSuccessSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    renderWarningSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

    render() {
        return (
            <Grid item xs={5} container justify="center">
                <Grid item xs={12}>
                    <PageHeading headingText="Genres" />
                </Grid>
                <Grid item xs={12}>
                    <GenresTable genres={this.state.genres} deleteGenre={this.deleteGenre} />
                </Grid>
                <Grid item xs={12}>
                    <Fab
                        color="primary"
                        aria-label="add"
                        className={this.props.classes.addGenreButton}
                        onClick={() => {
                            this.props.history.push('addgenre');
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Grid>
            </Grid>
        );
    }
}

export default compose<GenresProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(Genres);
