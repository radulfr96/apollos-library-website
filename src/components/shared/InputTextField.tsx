import * as React from 'react';
import {
    TextField, withStyles, createStyles, WithStyles, Theme,
} from '@material-ui/core';

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
    readonly?: boolean;
}

const useStyles = createStyles((theme: Theme) => ({
    errorMessage: {
        paddingBottom: '20px',
        color: 'red',
        fontFamily: theme.typography.fontFamily,
    },
}));

export class InputTextField extends React.Component<
    InputTextFieldProps
    & WithStyles<typeof useStyles>> {
    render(): JSX.Element {
        return (
            <>
                <TextField
                    name={this.props.keyName}
                    required={this.props.required}
                    label={this.props.label}
                    defaultValue={this.props.value}
                    variant="outlined"
                    type={this.props.type}
                    onChange={this.props.onChange}
                    onBlur={this.props.onBlur}
                    error={this.props.error}
                    inputProps={{
                        readOnly: this.props.readonly,
                    }}
                    fullWidth
                />
                <div className={this.props.classes.errorMessage}>{this.props.error ? this.props.errorMessage : ''}</div>
            </>
        );
    }
}

export default withStyles(useStyles)(InputTextField);
