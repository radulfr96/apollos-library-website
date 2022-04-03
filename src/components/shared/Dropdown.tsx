import React from 'react';
import {
    FormControl, InputLabel, MenuItem, Select, FormHelperText,
} from '@mui/material';
import DropdownOption from '../../interfaces/dropdownOption';

interface DropdownProps {
    label: string;
    labelId: string;
    id: string;
    errorMessage?: string;
    value?: string | number | null | undefined;
    required?: boolean;
    onChange?: any;
    error?: boolean;
    options: DropdownOption[];
    keyName?: string;
}

const Dropdown = (props: DropdownProps) => {
    const {
        required, label, value, onChange, error, labelId, errorMessage, id, options, keyName,
    } = props;

    return (
        <FormControl fullWidth error={error}>
            <InputLabel id={labelId}>
                {`${label} ${required ? '*' : ''}`}
            </InputLabel>
            <Select
                id={id}
                label={label}
                sx={{
                    width: '100%',
                    color: error ? '#d32f2f' : '',
                }}
                value={value}
                defaultValue={value}
                onChange={onChange}
                required={required}
                name={keyName}
            >
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
