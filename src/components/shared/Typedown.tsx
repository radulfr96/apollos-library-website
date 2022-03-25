import React from 'react';
import {
    TextField, Autocomplete, Box,
} from '@mui/material';
import TypedownOption from '../../interfaces/typedownOption';

interface TypedownProps {
    errorMessage: string | undefined;
    options: Array<TypedownOption>;
    value: string | number | undefined;
    required: boolean | undefined;
    onChange: any | undefined;
    onBlur: any | undefined;
    error: boolean | undefined;
    label: string;
}

const Typedown = (props: TypedownProps) => {
    const {
        options, value, onChange, errorMessage, error, label,
    } = props;

    return (
        <>
            <Autocomplete
                id="country-autocomplete"
                sx={{ width: '100%' }}
                options={options}
                autoHighlight
                getOptionLabel={(option: TypedownOption) => option.name}
                renderOption={(optionsProps, option) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <Box component="li" key={option.name} {...optionsProps}>
                        {option.name}
                    </Box>
                )}
                defaultValue={options.find((o) => o.value === value)}
                isOptionEqualToValue={(option: TypedownOption, valueSelected: TypedownOption) => option.value === valueSelected.value}
                renderInput={(params) => (
                    <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        label={label}
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
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

export default Typedown;
