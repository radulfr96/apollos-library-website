import {
    FormControl, InputLabel, MenuItem, Select, FormHelperText,
} from '@mui/material';
import React from 'react';
import DropdownOption from '../../interfaces/dropdownOption';

interface DropdownProps {
    label: string;
    labelId: string;
    id: string;
    errorMessage?: string;
    value?: string | number | null | undefined;
    required?: boolean;
    onChange?: any;
    onBlur?: any;
    error?: boolean;
    options: DropdownOption[];
}

const Dropdown = (props: DropdownProps) => {
    const {
        required, label, value, onChange, onBlur, error, labelId, errorMessage, id, options,
    } = props;

    return (
        <FormControl fullWidth error={error}>
            <InputLabel id={labelId}>
                {`${label} ${required ? '*' : ''}`}
            </InputLabel>
            <Select
                labelId={labelId}
                label={label}
                sx={{
                    width: '100%',
                    color: error ? '#d32f2f' : '',
                }}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                onBlur={onBlur}
            >
                <MenuItem value={undefined} />
                {
                    options.map((option: DropdownOption) => (
                        <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                    ))
                }
            </Select>
            {
                !!error && (<FormHelperText>{errorMessage}</FormHelperText>)
            }
        </FormControl>
    );
};

export default Dropdown;
