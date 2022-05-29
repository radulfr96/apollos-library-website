import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Box } from '@mui/material';

interface DateSelectorProps {
    label?: string;
    errorMessage?: string;
    value?: Date;
    keyName?: string;
    required?: boolean;
    onChange?: any;
    error?: boolean;
    readonly?: boolean;
}

const DateSelector = (props: DateSelectorProps) => {
    const {
        keyName, required, label, value, onChange, error, readonly, errorMessage,
    } = props;

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label={label}
                    value={value}
                    onChange={onChange}
                    readOnly={readonly}
                    renderInput={(params) => (
                        <TextField
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...params}
                            required={required}
                            key={keyName}
                            inputProps={{
                                ...params.inputProps,
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
            <Box sx={{
                color: 'red',
            }}
            >
                {error ? errorMessage : ''}
            </Box>
        </>
    );
};

export default DateSelector;
