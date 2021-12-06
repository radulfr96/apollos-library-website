import React from 'react';
import {
    TextField, Autocomplete, Box,
} from '@mui/material';
import Country from '../../interfaces/country';

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
    return (
        <>
            <Autocomplete
                sx={{ width: '100%' }}
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
            <Box sx={{
                paddingBottom: '20px',
                color: 'red',
            }}
            >
                {props.error ? props.errorMessage : ''}
            </Box>
        </>
    );
}
