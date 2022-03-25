import {
    Autocomplete, Box, Grid, TextField,
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
}

const ChipSelector = (props: ChipSelectorProps) => {
    const {
        options, selectedOptions, error, errorMessage, id, label,
    } = props;

    // const handleChange = (event: any) => {
    //     updateSelection(options[event.target.value]);
    // };

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    id={id}
                    options={options}
                    getOptionLabel={(option) => (option as ChipOption).name}
                    sx={{
                        paddingTop: '10px',
                        width: '100%',
                    }}
                    defaultValue={selectedOptions}
                    isOptionEqualToValue={(option: ChipOption, valueSelected: ChipOption) => option.value === valueSelected.value}
                    // onChange={handleChange}
                    renderInput={(params) => (
                        <TextField
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...params}
                            label={label}
                        />
                    )}
                />
                <Box
                    sx={{
                        paddingBottom: '20px',
                        color: 'red',
                    }}
                >
                    {error ? errorMessage : ''}
                </Box>
            </Grid>
        </Grid>
    );
};

export default ChipSelector;
