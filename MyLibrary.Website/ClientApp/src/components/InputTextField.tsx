import * as React from 'react';
import { TextField, withStyles, createStyles, WithStyles } from '@material-ui/core';

interface InputTextFieldProps {
    label?: string;
    errorMessage?: string;
    type?: string;
    value?: string | number | null | undefined;
    keyName?: any;
    required?: boolean;
    classes: any;
    onChange?: any;
    onBlur?: any;
    error?: boolean;
}

const useStyles = createStyles({
    inputField: {
        paddingBottom: '20px',
    }
});

export class InputTextField extends React.Component<InputTextFieldProps & WithStyles<typeof useStyles>> {
    render() {
        return (
            <TextField
                name={this.props.keyName}
                required={this.props.required}
                className={this.props.classes.inputField}
                label={this.props.label}
                defaultValue={this.props.value}
                variant="outlined"
                type={this.props.type} 
                onChange={this.props.onChange}
                onBlur={this.props.onBlur}
                error={this.props.error}
                fullWidth/>
        )
    }
}

export default withStyles(useStyles)(InputTextField);