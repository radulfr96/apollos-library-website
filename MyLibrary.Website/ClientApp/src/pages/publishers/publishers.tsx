import * as React from 'react';
import {
    withStyles, Grid, WithStyles, Fab, createStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { compose } from 'recompose';
import { withRouter, RouteProps, RouteComponentProps } from 'react-router';
import { PublisherTableItem } from '../../interfaces/publisherTableItem';
import { Publisher } from '../../interfaces/publisher';
import PageHeading from '../../components/shared/PageHeading';
import PublishersTable from '../../components/PublishersTable';
import { AppContext } from '../../Context';

interface PublishersProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = createStyles({
    addPublisherButton: {
        marginTop: '10px',
        float: 'right',
    },
    navLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
    },
});

interface PublishersState {
    publishers: Array<PublisherTableItem>;
}

export class Publishers extends React.Component<
    PublishersProps
    & WithStyles<typeof useStyles>
    & RouteProps
    & RouteComponentProps
    & WithSnackbarProps
    , PublishersState> {
    constructor(props: any) {
        super(props);
        this.deletePublisher = this.deletePublisher.bind(this);
        this.getPubishers = this.getPubishers.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            publishers: [],
        };
    }

    componentDidMount() {
        this.getPubishers();
    }

    getPubishers() {
        Axios.get('/api/publisher')
            .then((response) => {
                const listItems = new Array<PublisherTableItem>();

                response.data.publishers.array.forEach((publisher: Publisher) => {
                    listItems.push({
                        publisherId: publisher.publisherId,
                        name: publisher.name,
                        country: publisher.country.name,
                    });
                });

                this.setState({
                    publishers: response.data.publishers,
                });
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    this.setState({
                        publishers: [],
                    });
                }
            });
    }

    deletePublisher(id: string): void {
        Axios.delete(`api/publisher/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    this.renderSuccessSnackbar('Delete successful');
                    this.getPubishers();
                }
            })
            .catch(() => {
                this.renderErrorSnackbar('Unable to delete publisher please contact admin');
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
                    <PageHeading headingText="Publishers" />
                </Grid>
                {
                    this.context.isAdmin() && (
                        <Grid item xs={12}>
                            <PublishersTable
                                publishers={this.state.publishers}
                                deletePublisher={this.deletePublisher}
                            />
                        </Grid>
                    )
                }

                <Grid item xs={12}>
                    <Fab
                        color="primary"
                        aria-label="add"
                        className={this.props.classes.addPublisherButton}
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

Publishers.contextType = AppContext;

export default compose<PublishersProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(Publishers);
