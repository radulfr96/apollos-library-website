import * as React from 'react';
import {
    withStyles, Grid, WithStyles, Fab, createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { compose } from 'recompose';
import { withRouter, RouteProps, RouteComponentProps } from 'react-router';
import { AuthorListItem } from '../../interfaces/authorListItem';
import PageHeading from '../../components/shared/PageHeading';
import AuthorsTable from '../../components/AuthorsTable';
import { AppContext } from '../../Context';

interface AuthorsProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = createStyles({
    addAuthorButton: {
        marginTop: '10px',
        float: 'right',
    },
    navLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
    },
});

interface AuthorsState {
    authors: Array<AuthorListItem>;
}

export class Authors extends React.Component<
    AuthorsProps
    & WithStyles<typeof useStyles>
    & RouteProps
    & RouteComponentProps
    & WithSnackbarProps
    , AuthorsState> {
    constructor(props: any) {
        super(props);
        this.deleteAuthor = this.deleteAuthor.bind(this);
        this.getAuthors = this.getAuthors.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            authors: [],
        };
    }

    componentDidMount() {
        this.getAuthors();
    }

    getAuthors() {
        Axios.get('/api/author')
            .then((response) => {
                this.setState({
                    authors: response.data.authors,
                });
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    this.setState({
                        authors: [],
                    });
                }
            });
    }

    deleteAuthor(id: string): void {
        Axios.delete(`api/author/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    this.renderSuccessSnackbar('Delete successful');
                    this.getAuthors();
                }
            })
            .catch(() => {
                this.renderErrorSnackbar('Unable to delete author please contact admin');
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
                    <PageHeading headingText="Authors" />
                </Grid>
                {
                    this.context.isAdmin() && (
                        <Grid item xs={12}>
                            <AuthorsTable
                                authors={this.state.authors}
                                deleteAuthor={this.deleteAuthor}
                            />
                        </Grid>
                    )
                }

                <Grid item xs={12}>
                    <Fab
                        color="primary"
                        aria-label="add"
                        className={this.props.classes.addAuthorButton}
                        onClick={() => {
                            this.props.history.push('addpublisher');
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Grid>
            </Grid>
        );
    }
}

Authors.contextType = AppContext;

export default compose<AuthorsProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(Authors);
