import React from 'react';
import {
    Grid, InputLabel, Select, MenuItem, FormControl, makeStyles, Input, Chip, Theme,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
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
}));

interface RoleSelectorProps {
    roles: Array<string>;
    selectedRoles: Array<string>;
    updateUserRoles: (newRoleNames: string[]) => void;
    error: boolean | undefined;
    errorMessage: string | undefined;
}

export default function RoleSelector(props: RoleSelectorProps): JSX.Element {
    const classes = useStyles();
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
                                <div className={classes.roleChip}>
                                    {(selected as string[]).map((value) => (
                                        <Chip color="primary" key={value} label={value} className={classes.roleChip} />
                                    ))}
                                </div>
                            )}
                        >
                            {props.roles.map((role: string) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div className={classes.errorMessage}>{props.error ? props.errorMessage : ''}</div>
                </Grid>
            </Grid>
        );
}
