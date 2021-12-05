import React from 'react';
import {
    Theme, TextField, makeStyles,
} from '@mui/material';
import { Autocomplete } from '@material-ui/lab';
import Country from '../../interfaces/country';

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
    errorMessage: string | undefined;
    countries: Array<Country>;
    value: string | undefined;
    required: boolean | undefined;
    onChange: any | undefined;
    onBlur: any | undefined;
    error: boolean | undefined;
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
                getOptionLabel={(country: Country) => country.name}
                renderInput={() => (
                    <TextField
                        onBlur={props.onBlur}
                        required={props.required}
                        value={props.value}
                        variant="outlined"
                        defaultValue={props.countries.find(
                            (c) => c.countryID === props.value,
                        )?.name}
                        label="Country"
                    />
                )}
                onChange={props.onChange}
            />
            <Box className={classes.errorMessage}>{props.error ? props.errorMessage : ''}</Box>
        </>
    );
}
