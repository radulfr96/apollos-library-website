import React from 'react';
import {
    WithStyles, Grid, createStyles, withStyles,
} from '@material-ui/core';
import { compose } from 'recompose';
import PageHeading from '../../../components/shared/PageHeading';
import ReadOnlyLabel from '../../../components/shared/ReadOnlyLabel';
import ReadOnlyText from '../../../components/shared/ReadOnlyText';
import { AppContext } from '../../../Context';

interface MyDetailsProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = createStyles({
    paper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
    },
    navPaper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
        marginRight: '20px',
        width: '150px',
    },
});

export class MyDetails extends React.Component<MyDetailsProps
    & WithStyles<typeof useStyles>> {
    render() {
        return (
            <AppContext.Consumer>
                {(context) => (
                    <Grid container item xs={12}>
                        <Grid item xs={12}>
                            <PageHeading headingText="My Details" />
                        </Grid>
                        <Grid item xs={12}>
                            <ReadOnlyLabel
                                text="User Number"
                            />
                            <ReadOnlyText text={context.userInfo?.userId} />
                        </Grid>
                        <Grid item xs={12}>
                            <ReadOnlyLabel
                                text="Username"
                            />
                            <ReadOnlyText text={context.userInfo?.username} />
                        </Grid>
                        <Grid item xs={12}>
                            <ReadOnlyLabel
                                text="Date Joined"
                            />
                            <ReadOnlyText text={context.userInfo?.joinDate} />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <ReadOnlyLabel
                                        text="Roles"
                                    />
                                </Grid>
                                {context.userInfo?.roles.map((role) => (
                                        <ReadOnlyText text={role} />
                                    ))}
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </AppContext.Consumer>
        );
    }
}

export default compose<MyDetailsProps, {}>(
    withStyles(useStyles),
)(MyDetails);
