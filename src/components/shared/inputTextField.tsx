import * as React from 'react';
import {
    TextField,
} from '@mui/material';

interface InputTextFieldProps {
    label?: string;
    errorMessage?: string;
    type?: string;
    value?: string | number | null | undefined;
    keyName?: string;
    required?: boolean;
    onChange?: any;
    onBlur?: any;
    error?: boolean;
    readonly?: boolean;
    inputMode?: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | undefined;
    pattern?: string;
}

const InputTextField = (props: InputTextFieldProps) => {
    const {
        keyName, required, label, value, type, onChange, onBlur, error, readonly, errorMessage, inputMode, pattern,
    } = props;

    return (
        <TextField
            name={keyName}
            required={required}
            label={label}
            defaultValue={value}
            variant="outlined"
            type={type}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            inputMode={inputMode}
            inputProps={{
                readOnly: readonly,
                pattern,
            }}
            fullWidth
            helperText={errorMessage}
        />
    );
};

export default InputTextField;
