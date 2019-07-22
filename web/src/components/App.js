import React from 'react';

import {Switch, Route, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import HistoryIcon from '@material-ui/icons/History';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';

import teal from '@material-ui/core/colors/teal';
import blue from '@material-ui/core/colors/blue';

import Login from './pages/Login';
// import Home from './pages/Home';
import Project from './pages/Project';
import ResultChart from './pages/ResultChart';
import NotFound from './pages/NotFound';

const appTheme = createMuiTheme({
    palette: {
        primary: teal, //#009688
        secondary: blue, //#2196f3
    },
    status: {
        danger: 'orange'
    }
});

const drawerWidth = 240;
const drawerHeight = 1050;

// 横のスナックバー
const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%'
    },
    appBar: {
        position: 'absolute',
        zIndex: theme.zIndex.drawer + 1
    },
    barTitle: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: "24px"
        },
        marginLeft: "16px"
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        height: drawerHeight,
        [theme.breakpoints.up('md')]: {
            position: 'relative'
        }
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3
    },
    logoBox: {
        width: "240px"
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rootPath: "/",
            title: "Movie ANALYZER",
            isOpenSnackBar: false,
            snackMsg: "",
            mobileOpen: false
        };
    }

    dispatchHeaderTitle = (newTitle) => {
        this.setState({title: newTitle});
    }

    dispatchSnackBarMessage = (msg) => {
        this.setState({snackMsg: msg, isOpenSnackBar: true});
    }

    handleCloseSnackBar = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({isOpenSnackBar: false});
    }

    handleDrawerToggle = () => {
        this.setState(state => ({
            mobileOpen: !state.mobileOpen
        }));
    };

    pushBrowserHistory(path) {
        this.props.history.push(path);
        this.handleDrawerToggle();
    }

    render() {
        const {classes, theme} = this.props;
        const {rootPath, title, isOpenSnackBar, snackMsg} = this.state;

        const drawer = (<div>
            <div className={classes.toolbar}>
                <Toolbar>
                    <Button className={classes.menuButton} aria-label="Top" onClick={() => this.pushBrowserHistory("/")}>
                        Movie ANALYZER
                    </Button>
                </Toolbar>
            </div>

            <Divider/>
            <List>
                {/*
          <ListItem button onClick={() => this.pushBrowserHistory("/dashboard/")}>
            <DashboardIcon />
            <ListItemText primary="Dashboard" />
          </ListItem>
          */
                }
                <ListItem button="button" onClick={() => this.pushBrowserHistory("/data/")}>
                    <HistoryIcon/>
                    <ListItemText primary="Movie"/>
                </ListItem>
            </List>
        </div>);

        return (<MuiThemeProvider theme={appTheme}>
            <CssBaseline/>

            <div className={classes.root}>
                <AppBar position="absolute" className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerToggle} className={classes.navIconHide}>
                            <MenuIcon/>
                        </IconButton>
                        <Hidden smDown="smDown" implementation="css">
                            <div className={classes.logoBox}>
                                <Button className={classes.menuButton} color="inherit" aria-label="Top" onClick={() => this.pushBrowserHistory("/")}>
                                    MOVIE ANALYZER
                                </Button>
                            </div>
                        </Hidden>
                        <Typography variant="title" color="inherit" noWrap="noWrap" className={classes.barTitle}>
                            {title}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Hidden mdUp="mdUp">
                    <Drawer variant="temporary" anchor={theme.direction === 'rtl'
                            ? 'right'
                            : 'left'} open={this.state.mobileOpen} onClose={this.handleDrawerToggle} classes={{
                            paper: classes.drawerPaper
                        }} ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}>
                        {drawer}
                    </Drawer>
                </Hidden>

                <Hidden smDown="smDown" implementation="css">
                    <Drawer variant="permanent" open="open" classes={{
                            paper: classes.drawerPaper
                        }}>
                        {drawer}
                    </Drawer>
                </Hidden>

                <main role="main" className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route exact="exact" path={rootPath} render={props => <Login dispatchHeaderTitle={this.dispatchHeaderTitle} {...props}/>}/>
                        <Route exact="exact" path={rootPath + "data"} render={props => <Project dispatchHeaderTitle={this.dispatchHeaderTitle} dispatchSnackBarMessage={this.dispatchSnackBarMessage} {...props}/>}/>
                        <Route exact="exact" path={rootPath + "data/:id"} render={props => <ResultChart dispatchHeaderTitle={this.dispatchHeaderTitle} dispatchSnackBarMessage={this.dispatchSnackBarMessage} {...props}/>}/>
                        <Route component={NotFound}/>
                    </Switch>
                </main>
                <Snackbar anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }} open={isOpenSnackBar} autoHideDuration={6000} onClose={this.handleCloseSnackBar} ContentProps={{
                        'aria-describedby' : 'message-id'
                    }} message={<span id = "message-id" > {
                        snackMsg
                    }
                    </span>} action={[<IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={this.handleCloseSnackBar}>
                        <CloseIcon/>
                    </IconButton>
                        ]}/>
            </div>
        </MuiThemeProvider>);
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, {withTheme: true})(App));
