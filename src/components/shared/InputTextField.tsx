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

function InputTextField(props: InputTextFieldProps) {
    return (
        <>
            <TextField
                name={props.keyName}
                required={props.required}
                label={props.label}
                defaultValue={props.value}
                variant="outlined"
                type={props.type}
                onChange={props.onChange}
                onBlur={props.onBlur}
                error={props.error}
                inputProps={{
                    readOnly: props.readonly,
                }}
                fullWidth
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

export default InputTextField;
