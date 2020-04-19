/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    withStyles, createStyles, WithStyles, Theme, TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Country from '../../interfaces/country';

interface CountryTypedownProps {
    label?: string;
    errorMessage?: string;
    countries: Array<Country>;
    type?: string;
    value?: string | null | undefined;
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

export class CountryTypedown extends React.Component<
    CountryTypedownProps
    & WithStyles<typeof useStyles>> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <Autocomplete
                    className={this.props.classes.input}
                    options={
                        this.props.countries
                    }
                    getOptionLabel={(country) => country.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            defaultValue={this.props.countries.find(
                                (c) => c.countryID === this.props.value,
                            )?.name}
                            label="Country"
                        />
                    )}
                    onChange={this.props.onChange}
                />
                <div className={this.props.classes.errorMessage}>{this.props.error ? this.props.errorMessage : ''}</div>
            </>
        );
    }
}

export default withStyles(useStyles)(CountryTypedown);
