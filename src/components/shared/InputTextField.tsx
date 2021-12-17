import * as React from 'react';
import {
    TextField, Box,
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
}

const InputTextField = (props: InputTextFieldProps) => {
    const {
        keyName, required, label, value, type, onChange, onBlur, error, readonly, errorMessage,
    } = props;

    return (
        <>
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
                inputProps={{
                    readOnly: readonly,
                }}
                fullWidth
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

export default InputTextField;
