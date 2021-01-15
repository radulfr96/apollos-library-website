import * as React from 'react';
import {
    createStyles, WithStyles, Paper, withStyles, Tabs, Tab, AppBar, Typography, Box,
} from '@material-ui/core';
import {
    RouteComponentProps, withRouter,
} from 'react-router';
import { compose } from 'recompose';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import MyDetails from './MyDetails';
import ChangeUsername from './ChangeUsername';
import UpdatePassword from './UpdatePassword';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {
        children, value, index,
    } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

interface MyAccountProps extends RouteComponentProps<{}> {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

interface MyAccountState {
    tab: number;
}

const useStyles = createStyles({
    paper: {
        width: '1000px',
    },
    formButton: {
        marginBottom: '10px',
        marginRight: '10px',
        float: 'right',
    },
});

export class MyAccount extends React.Component<MyAccountProps
    & WithStyles<typeof useStyles>
    & WithSnackbarProps
    , MyAccountState> {
    constructor(props: MyAccountProps) {
        super(props);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.state = {
            tab: 0,
        };
    }

    handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
        this.setState({
            ...this.state,
            tab: newValue,
        });
    }

    renderErrorSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    renderSuccessSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    renderWarningSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

    render() {
        return (
            <>
                <Paper className={this.props.classes.paper}>
                    <AppBar position="static">
                        <Tabs
                            value={this.state.tab}
                            onChange={this.handleTabChange}
                        >
                            <Tab label="My Details" />
                            <Tab label="Change Username" />
                            <Tab label="Change Password" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={this.state.tab} index={0}>
                        <MyDetails />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={1}>
                        <ChangeUsername />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={2}>
                        <UpdatePassword />
                    </TabPanel>
                </Paper>
            </>
        );
    }
}

export default compose<MyAccountProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(MyAccount);
