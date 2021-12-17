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
        countries, onBlur, required, value, onChange, errorMessage, error,
    } = props;

    return (
        <>
            <Autocomplete
                sx={{ width: '100%' }}
                options={
                    countries
                }
                getOptionLabel={(country: Country) => country.name}
                renderInput={() => (
                    <TextField
                        onBlur={onBlur}
                        required={required}
                        value={value}
                        variant="outlined"
                        defaultValue={countries.find(
                            (c) => c.countryID === value,
                        )?.name}
                        label="Country"
                    />
                )}
                onChange={onChange}
            />
            <Box sx={{
                paddingBottom: '20px',
                color: 'red',
            }}
            >
                {error ? errorMessage : ''}
            </Box>
        </>
    );
};

export default CountryTypedown;
