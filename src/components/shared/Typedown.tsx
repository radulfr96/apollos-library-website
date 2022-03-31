import React from 'react';
import {
    TextField, Autocomplete, Box, FormControl,
} from '@mui/material';
import TypedownOption from '../../interfaces/typedownOption';

interface TypedownProps {
    errorMessage?: string;
    options: Array<TypedownOption>;
    value?: string;
    required?: boolean;
    id: string;
    updateSelection: (id: number | string | undefined) => void;
    onBlur?: any;
    error?: boolean;
    label: string;
}

const Typedown = (props: TypedownProps) => {
    const {
        options, value, updateSelection, errorMessage, error, label, required, id,
    } = props;

    const handleChange = (event: any) => {
        updateSelection(event.target.value);
    };

    return (
        <FormControl fullWidth error={error}>
            <Autocomplete
                id={id}
                sx={{ width: '100%' }}
                options={options}
                autoHighlight
                getOptionLabel={(option: TypedownOption) => option.name}
                renderOption={(optionsProps, option) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <Box component="li" key={option.name} value={option.value} {...optionsProps}>
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
                        required={required}
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
                onChange={handleChange}
            />
            <Box sx={{
                color: 'red',
            }}
            >
                {error ? errorMessage : ''}
            </Box>
        </FormControl>
    );
};

export default Typedown;
