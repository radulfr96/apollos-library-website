import {
    Theme, TextField, makeStyles,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Country from '../../interfaces/country';
import { useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
    errorMessage: {
        paddingBottom: '20px',
        color: 'red',
        fontFamily: theme.typography.fontFamily,
    },
    input: {
        width: '100%',
    },
}));

interface CountryTypedownProps {
    label?: string;
    errorMessage?: string;
    countries: Array<Country>;
    type?: string;
    value?: string | null | undefined;
    keyName?: any;
    required?: boolean;
    onChange?: any;
    onBlur?: any;
    error?: boolean;
    readonly?: boolean;
}

export default function CountryTypedown(props: CountryTypedownProps): JSX.Element {
    const classes = useStyles();
    return (
        <>
            <Autocomplete
                className={classes.input}
                options={
                    props.countries
                }
                // required={this.props.required}
                getOptionLabel={(country: Country) => country.name}
                renderInput={(params: any) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        defaultValue={props.countries.find(
                            (c) => c.countryID === props.value,
                        )?.name}
                        label="Country"
                    />
                )}
                onChange={props.onChange}
            />
            <div className={classes.errorMessage}>{props.error ? props.errorMessage : ''}</div>
        </>
    );
}
