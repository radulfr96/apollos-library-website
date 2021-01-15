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
import { Author } from '../../interfaces/author';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import CountryTypedown from '../../components/shared/countryTypedown';
import Country from '../../interfaces/country';

interface AuthorProps {
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

interface AuthorState {
    author: Author;
    countries: Array<Country>;
    newAuthor: boolean;
}

interface AuthorParams {
    id: string | undefined;
}

class AuthorsPage extends React.Component<
    AuthorProps
    & WithStyles<typeof useStyles>
    & RouteProps
    & WithSnackbarProps
    & RouteComponentProps<AuthorParams>
    , AuthorState> {
    constructor(props: any) {
        super(props);
        this.updateAuthor = this.updateAuthor.bind(this);
        this.addAuthor = this.addAuthor.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            countries: [],
            author: {
                authorID: 0,
                firstname: '',
                middlename: '',
                lastname: '',
                description: '',
                countryID: '',
            },
            newAuthor: false,
        };
    }

    componentDidMount() {
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== null) {
            const { id } = this.props.match.params;

            Axios.get(`/api/author/${id}`)
                .then((response) => {
                    this.setState({
                        author: response.data.author,
                        newAuthor: false,
                    });
                });
        } else {
            this.setState({
                ...this.state,
                newAuthor: true,
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
            author: {
                ...prevState.author,
                [key]: value,
            },
        });
    }

    updateAuthor(author: Author, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/author/', author)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Update successful');
                                this.props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar('Unable to update author invalid input');
                            } else {
                                this.renderErrorSnackbar('Unable to update author please contact admin');
                            }
                        });
                }
            });
    }

    addAuthor(author: Author, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/author/', author)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Add successful');
                                this.props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar('Unable to add author, invalid input');
                            } else {
                                this.renderErrorSnackbar('Unable to add author please contact admin');
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
        if (!this.state.newAuthor && this.state.author.authorID < 1) {
            return (<CircularProgress />);
        }

        return (
            <Grid item xs={6} container justify="center">
                <Grid item xs={12}>
                    {
                        !this.state.newAuthor && (
                            <PageHeading headingText="Author Details" />
                        )
                    }
                    {
                        this.state.newAuthor && (
                            <PageHeading headingText="New Author" />
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <Formik
                        initialValues={this.state.author}
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                        validationSchema={
                            yup.object().shape({
                                firstname: yup.string()
                                    .required('An author must have a firstname or alias'),
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
                                        !this.state.newAuthor && (
                                            <Grid item xs={12}>
                                                <InputTextField
                                                    label="Author ID"
                                                    required
                                                    type="text"
                                                    keyName="authorID"
                                                    value={values.authorID}
                                                    onChange={handleChange}
                                                    error={!!(errors.authorID)}
                                                    errorMessage={errors.authorID}
                                                    readonly
                                                />
                                            </Grid>
                                        )
                                    }

                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Firstname"
                                            required
                                            type="text"
                                            keyName="firstname"
                                            value={values.firstname}
                                            onChange={handleChange}
                                            error={!!(errors.firstname)}
                                            errorMessage={errors.firstname}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Middlename"
                                            type="text"
                                            keyName="middlename"
                                            value={values.middlename}
                                            onChange={handleChange}
                                            error={!!(errors.middlename)}
                                            errorMessage={errors.middlename}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Lastname"
                                            type="text"
                                            keyName="lastname"
                                            value={values.lastname}
                                            onChange={handleChange}
                                            error={!!(errors.lastname)}
                                            errorMessage={errors.lastname}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CountryTypedown
                                            label="Country *"
                                            type="text"
                                            required
                                            keyName="countryID"
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
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Description"
                                            type="text"
                                            keyName="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            error={!!(errors.description)}
                                            errorMessage={errors.description}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                        {!this.state.newAuthor && (
                                            <Button
                                                className={this.props.classes.formButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        this.updateAuthor(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Update
                                            </Button>
                                        )}
                                        {this.state.newAuthor && (
                                            <Button
                                                className={this.props.classes.formButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.addAuthor(values, validateForm);
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
                                                this.props.history.push('/authors');
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

export default compose<AuthorProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(AuthorsPage);
