import React from 'react';
import {
    Grid, InputLabel, Select, MenuItem, FormControl, Input, Chip, Box,
} from '@mui/material';

interface RoleSelectorProps {
    roles: Array<string>;
    selectedRoles: Array<string>;
    updateUserRoles: (newRoleNames: string[]) => void;
    error?: boolean;
    errorMessage?: string;
}

const RoleSelector = (props: RoleSelectorProps) => {
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const {
        updateUserRoles, selectedRoles, roles, error, errorMessage,
    } = props;

    const handleChange = (event: any) => {
        updateUserRoles(event.target.value as string[]);
    };

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <FormControl sx={{
                    paddingTop: '10px',
                    width: '100%',
                }}
                >
                    <InputLabel ref={inputLabel} id="roleSelectLabel">Roles</InputLabel>
                    <Select
                        labelId="roleSelectLabel"
                        id="roleSelect"
                        multiple
                        name="roles"
                        sx={{
                            paddingTop: '10px',
                            width: '100%',
                        }}
                        value={selectedRoles}
                        onChange={handleChange}
                        input={<Input id="selectMultipleRoles" />}
                        renderValue={(selected) => (
                            <Box style={{
                                paddingTop: '10px',
                                width: '100%',
                            }}
                            >
                                {(selected as string[]).map((value) => (
                                    <Chip color="primary" key={value} label={value} sx={{ marginRight: '5px' }} />
                                ))}
                            </Box>
                        )}
                    >
                        {roles.map((role: string) => (
                            <MenuItem key={role} value={role}>
                                {role}
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

export default RoleSelector;
