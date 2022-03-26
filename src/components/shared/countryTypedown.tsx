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

const CountryTypedown = (props: CountryTypedownProps) => {
    const {
        countries, value, onChange, errorMessage, error,
    } = props;

    return (
        <>
            <Autocomplete
                id="country-autocomplete"
                sx={{ width: '100%' }}
                options={countries}
                autoHighlight
                getOptionLabel={(country: Country) => country.name}
                renderOption={(countryProps, option) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <Box component="li" key={option.countryID} {...countryProps}>
                        {option.name}
                    </Box>
                )}
                defaultValue={countries.find((c) => c.countryID === value)}
                renderInput={(params) => (
                    <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        label="Country"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
                onChange={onChange}
            />
            <Box sx={{
                color: 'red',
            }}
            >
                {error ? errorMessage : ''}
            </Box>
        </>
    );
};

export default CountryTypedown;
