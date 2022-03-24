import {
    Box, Chip, FormControl, Grid, Input, InputLabel, MenuItem, Select,
} from '@mui/material';
import React from 'react';
import ChipOption from '../../interfaces/chipOption';

interface ChipSelectorProps {
    options: Array<ChipOption>;
    selectedOptions: Array<ChipOption>;
    updateSelection: (optionsSelected: ChipOption[]) => void;
    error?: boolean;
    errorMessage?: string;
    id: string;
    label: string;
    labelId: string;
    textInputId: string;
    name: string;
}

const ChipSelector = (props: ChipSelectorProps) => {
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const {
        options, selectedOptions, updateSelection, error, errorMessage, id, label, labelId, textInputId, name,
    } = props;

    const handleChange = (event: any) => {
        const optionsToUpdate = new Array<ChipOption>();
        event.target.value.forEach((selected: number | string) => {
            const option = options.find((o: ChipOption) => o.value === selected);
            if (option !== undefined) {
                optionsToUpdate.push(option as ChipOption);
            }
        });
        updateSelection(optionsToUpdate);
    };

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <FormControl sx={{
                    paddingTop: '10px',
                    width: '100%',
                }}
                >
                    <InputLabel ref={inputLabel} id={labelId}>{label}</InputLabel>
                    <Select
                        labelId={labelId}
                        id={id}
                        multiple
                        name={name}
                        sx={{
                            paddingTop: '10px',
                            width: '100%',
                        }}
                        value={selectedOptions}
                        onChange={handleChange}
                        input={<Input id={textInputId} />}
                        renderValue={(selected) => (
                            <Box style={{
                                paddingTop: '10px',
                                width: '100%',
                            }}
                            >
                                {(selected).map((chip: ChipOption) => (
                                    <Chip color="primary" key={chip.value} label={chip.name} sx={{ marginRight: '5px' }} />
                                ))}
                            </Box>
                        )}
                    >
                        {options.map((option: ChipOption) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
