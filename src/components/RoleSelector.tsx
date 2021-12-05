import React from 'react';
import {
    Grid, InputLabel, Select, MenuItem, FormControl, Input, Chip, Theme,
} from '@mui/material';

const styles = theme => ({
    roleChipSection: {
        paddingTop: '10px',
        width: '100%',
    },
    roleChip: {
        marginRight: '5px',
    },
    errorMessage: {
        paddingBottom: '20px',
        color: 'red',
        fontFamily: theme.typography.fontFamily,
    },
});

interface RoleSelectorProps {
    roles: Array<string>;
    selectedRoles: Array<string>;
    updateUserRoles: (newRoleNames: string[]) => void;
    error: boolean | undefined;
    errorMessage: string | undefined;
}

export default function RoleSelector(props: RoleSelectorProps): JSX.Element {
    const classes = useClasses();
    const inputLabel = React.useRef<HTMLLabelElement>(null);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        props.updateUserRoles(event.target.value as string[]);
    };

    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <FormControl className={classes.roleChipSection}>
                    <InputLabel ref={inputLabel} id="roleSelectLabel">Roles</InputLabel>
                    <Select
                        labelId="roleSelectLabel"
                        id="roleSelect"
                        multiple
                        name="roles"
                        className={classes.roleChipSection}
                        value={props.selectedRoles}
                        onChange={handleChange}
                        input={<Input id="selectMultipleRoles" />}
                        renderValue={(selected) => (
                            <Box style={{
                                paddingTop: '10px',
                                width: '100%',
                            }}>
                                {(selected as string[]).map((value) => (
                                    <Chip color="primary" key={value} label={value} className={classes.roleChip} />
                                ))}
                            </Box>
                        )}
                    >
                        {props.roles.map((role: string) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box className={classes.errorMessage}>{props.error ? props.errorMessage : ''}</Box>
            </Grid>
        </Grid>
    );
}
