import React from 'react';
import {
    Grid, InputLabel, Select, MenuItem, FormControl,
} from '@material-ui/core';
import { Role } from '../interfaces/role';

const RoleSelector: React.FC<{ roles: Array<Role> }> = ({ roles }) => {
    const inputLabel = React.useRef<HTMLLabelElement>(null);

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel ref={inputLabel} id="roleSelectLabel">Role</InputLabel>
                    <Select
                        labelId="roleSelectLabel"
                        id="roleSelect"
                        variant="outlined"
                        fullWidth
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            roles.map((role: Role) => (
                                <MenuItem value={role.roleId}>{role.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <> </>
            </Grid>
        </Grid>
    );
};

export default RoleSelector;
