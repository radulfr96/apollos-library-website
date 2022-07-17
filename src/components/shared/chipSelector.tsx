import React from 'react';
import {
    Autocomplete, Chip, FormControl, FormHelperText, TextField,
} from '@mui/material';
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
    updateSelection: (selectedOptions: ChipOption[]) => void;
    handleDelete: (value: string | number) => void;
}

const ChipSelector = (props: ChipSelectorProps) => {
    const {
        options, selectedOptions, error, errorMessage, id, label, required, updateSelection, handleDelete,
    } = props;

    const handleChange = (event: any, value: ChipOption[]) => {
        updateSelection(value);
    };

    return (
        <FormControl fullWidth error={error}>
            <Autocomplete
                multiple
                id={id}
                options={options}
                getOptionLabel={(option) => (option as ChipOption).name}
                value={selectedOptions}
                defaultValue={selectedOptions}
                isOptionEqualToValue={(option: ChipOption, valueSelected: ChipOption) => option.value === valueSelected.value}
                onChange={handleChange}
                renderTags={(opts: Array<ChipOption>) => opts.map((opt: ChipOption) => (<Chip variant="outlined" label={opt.name} onDelete={() => handleDelete(opt.value)} />))}
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
