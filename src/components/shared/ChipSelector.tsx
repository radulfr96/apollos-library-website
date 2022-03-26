import {
    Autocomplete, FormControl, FormHelperText, TextField,
} from '@mui/material';
import React from 'react';
import ChipOption from '../../interfaces/chipOption';

interface ChipSelectorProps {
    options: Array<ChipOption>;
    selectedOptions: Array<ChipOption>;
    error?: boolean;
    errorMessage?: string;
    id: string;
    label: string;
    labelId: string;
    textInputId: string;
    required?: boolean;
}

const ChipSelector = (props: ChipSelectorProps) => {
    const {
        options, selectedOptions, error, errorMessage, id, label, required,
    } = props;

    // const handleChange = (event: any) => {
    //     updateSelection(options[event.target.value]);
    // };

    return (
        <FormControl fullWidth error={error}>
            <Autocomplete
                multiple
                id={id}
                options={options}
                getOptionLabel={(option) => (option as ChipOption).name}
                defaultValue={selectedOptions}
                isOptionEqualToValue={(option: ChipOption, valueSelected: ChipOption) => option.value === valueSelected.value}
                // onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        label={label}
                        required={required}
                    />
                )}
            />
            {
                !!error && (<FormHelperText>{errorMessage}</FormHelperText>)
            }
        </FormControl>
    );
};

export default ChipSelector;
