/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    withStyles, createStyles, WithStyles, Theme, TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Axios from 'axios';
import Country from '../../interfaces/country';

interface CountryTypedownProps {
    label?: string;
    errorMessage?: string;
    type?: string;
    value?: Country | null | undefined;
    keyName?: any;
    required?: boolean;
    classes: any;
    onChange?: any;
    onBlur?: any;
    error?: boolean;
    readonly?: boolean;
}

const useStyles = createStyles((theme: Theme) => ({
    errorMessage: {
        paddingBottom: '20px',
        color: 'red',
        fontFamily: theme.typography.fontFamily,
    },
    input: {
        width: '100%',
    },
}));

interface CountryTypedownState {
    countries: Country[];
}

export class CountryTypedown extends React.Component<
    CountryTypedownProps
    & WithStyles<typeof useStyles>
    , CountryTypedownState> {
        constructor(props: any) {
            super(props);
            this.state = {
                countries: [],
            };
        }

    componentDidMount() {
        Axios.get('/api/reference/countries')
                .then((response) => {
                    this.setState({
                        countries: response.data.countries,
                    });
                });
    }

    render() {
        return (
            <>
                <Autocomplete
                    className={this.props.classes.input}
                    options={
                        this.state.countries
                    }
                    getOptionLabel={(country) => country.name}
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="Country" />
                    )}
                    onChange={this.props.onChange}
                />
                <div className={this.props.classes.errorMessage}>{this.props.error ? this.props.errorMessage : ''}</div>
            </>
        );
    }
}

export default withStyles(useStyles)(CountryTypedown);
