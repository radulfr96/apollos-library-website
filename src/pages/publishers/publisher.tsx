import * as React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    withStyles, Theme, Grid, WithStyles, Button, CircularProgress,
} from '@material-ui/core';
import Axios from 'axios';
import { withRouter, RouteComponentProps, RouteProps } from 'react-router';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import compose from 'recompose/compose';
import { Publisher } from '../../interfaces/publisher';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import CountryTypedown from '../../components/shared/countryTypedown';
import Country from '../../interfaces/country';

interface PublisherProps {
    classes: any;
}

const useStyles = (theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
    formButton: {
        marginRight: '10px',
    },
    publisherIdField: {
        marginBottom: '10px',
    },
});

interface PublisherState {
    publisher: Publisher;
    countries: Array<Country>;
    newPublisher: boolean;
}

interface PublisherParams {
    id: string | undefined;
}

class PublisherPage extends React.Component<
    PublisherProps
    & WithStyles<typeof useStyles>
    & RouteProps
    & WithSnackbarProps
    & RouteComponentProps<PublisherParams>
    , PublisherState> {
    constructor(props: any) {
        super(props);
        this.updatePublisher = this.updatePublisher.bind(this);
        this.addPublisher = this.addPublisher.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            countries: [],
            publisher: {
                publisherId: 0,
                name: '',
                countryID: '',
                website: '',
                streetAddress: '',
                city: '',
                postcode: '',
                state: '',
            },
            newPublisher: false,
        };
    }

    componentDidMount() {
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== null) {
            const { id } = this.props.match.params;

            Axios.get(`/api/publisher/${id}`)
                .then((response) => {
                    this.setState({
                        publisher: response.data.publisher,
                        newPublisher: false,
                    });
                });
        } else {
            this.setState({
                ...this.state,
                newPublisher: true,
            });
        }

        Axios.get('/api/reference/countries')
            .then((response) => {
                this.setState({
                    countries: response.data.countries,
                });
            });
    }

    onChange(key: string, value: any): void {
        const prevState = this.state;
        this.setState({
            ...this.state,
            publisher: {
                ...prevState.publisher,
                [key]: value,
            },
        });
    }

    updatePublisher(publisher: Publisher, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/publisher/', publisher)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Update successful');
                                this.props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar('Unable to update publisher invalid input');
                            } else {
                                this.renderErrorSnackbar('Unable to update publisher please contact admin');
                            }
                        });
                }
            });
    }

    addPublisher(publisher: Publisher, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/publisher/', publisher)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Add successful');
                                this.props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar('Unable to add publisher, invalid input');
                            } else {
                                this.renderErrorSnackbar('Unable to add publisher please contact admin');
                            }
                        });
                }
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
        if (!this.state.newPublisher && this.state.publisher.publisherId < 1) {
            return (<CircularProgress />);
        }

        return (
            <Grid item xs={6} container justify="center">
                <Grid item xs={12}>
                    {
                        !this.state.newPublisher && (
                            <PageHeading headingText="Publisher Details" />
                        )
                    }
                    {
                        this.state.newPublisher && (
                            <PageHeading headingText="New Publisher" />
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <Formik
                        initialValues={this.state.publisher}
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                        validationSchema={
                            yup.object().shape({
                                name: yup.string()
                                    .required('A publisher must have a name'),
                            })
                        }
                    >
                        {({
                            values,
                            errors,
                            handleChange,
                            setFieldValue,
                            validateForm,
                        }) => (
                                <Grid container item xs={12}>

                                    {
                                        !this.state.newPublisher && (
                                            <Grid item xs={12}>
                                                <InputTextField
                                                    label="Publisher Id"
                                                    required
                                                    type="text"
                                                    keyName="publisherId"
                                                    value={values.publisherId}
                                                    onChange={handleChange}
                                                    error={!!(errors.publisherId)}
                                                    errorMessage={errors.publisherId}
                                                    readonly
                                                />
                                            </Grid>
                                        )
                                    }

                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Name"
                                            required
                                            type="text"
                                            keyName="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            error={!!(errors.name)}
                                            errorMessage={errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Website"
                                            type="text"
                                            keyName="website"
                                            value={values.website}
                                            onChange={handleChange}
                                            error={!!(errors.website)}
                                            errorMessage={errors.website}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Street Address"
                                            type="text"
                                            keyName="streetAddress"
                                            value={values.streetAddress}
                                            onChange={handleChange}
                                            error={!!(errors.streetAddress)}
                                            errorMessage={errors.streetAddress}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="City/Town"
                                            type="text"
                                            keyName="city"
                                            value={values.city}
                                            onChange={handleChange}
                                            error={!!(errors.city)}
                                            errorMessage={errors.city}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Postcode/Zip Code"
                                            type="text"
                                            keyName="postcode"
                                            value={values.postcode}
                                            onChange={handleChange}
                                            error={!!(errors.postcode)}
                                            errorMessage={errors.postcode}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="State/Province"
                                            type="text"
                                            keyName="state"
                                            value={values.state}
                                            onChange={handleChange}
                                            error={!!(errors.state)}
                                            errorMessage={errors.state}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CountryTypedown
                                            label="Country"
                                            type="text"
                                            keyName="countryID"
                                            required
                                            countries={this.state.countries}
                                            value={values.countryID}
                                            onChange={(e: any) => {
                                                setFieldValue('countryID', this.state.countries.find((c) => c.name
                                                    === e.target.innerText)?.countryID);
                                            }}
                                            error={!!(errors.countryID)}
                                            errorMessage={errors.countryID}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                        {!this.state.newPublisher && (
                                            <Button
                                                className={this.props.classes.formButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        this.updatePublisher(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Update
                                            </Button>
                                        )}
                                        {this.state.newPublisher && (
                                            <Button
                                                className={this.props.classes.formButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        this.addPublisher(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Add
                                            </Button>
                                        )}

                                        <Button
                                            className={this.props.classes.formButton}
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                this.props.history.push('/publishers');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                    </Formik>
                </Grid>
            </Grid>
        );
    }
}

export default compose<PublisherProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(PublisherPage);
