import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LinkIcon from '@material-ui/icons/Link';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import Search from './Components/Search/Search';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    menuIconMobile: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    menuIconDesktop: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerRoot: {
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    drawerOpen: {
        backgroundColor: theme.palette.secondary.main,
        color: '#ffffff',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    },
    drawerClose: {
        backgroundColor: theme.palette.secondary.main,
        color: '#ffffff',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
    },
    drawerWhiteText: {
        [theme.breakpoints.up('md')]: {
            color: '#ffffff',
        },
    },
    logo: {
        maxWidth: '50%',
        height: 'auto',
    },
    list: {
        width: drawerWidth,
    },
    drawerLogo: {
        backgroundColor: '#FEFEFE',
    },
}));

const TopBar = ({ onOpen }) => {
    const classes = useStyles();
    const theme = useTheme();

    const [openDesktopDrawer, setOpenDesktopDrawer] = React.useState(false);
    const handleDesktopDrawerOpen = () => {
        setOpenDesktopDrawer(true);
    };
    const handleDesktopDrawerClose = () => {
        setOpenDesktopDrawer(false);
    };

    const [openMobileDrawer, setOpenMobileDrawer] = React.useState(false);
    const toggleMobileDrawer = openDrawer => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenMobileDrawer(openDrawer);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        onOpen(openDesktopDrawer);
    }, [openDesktopDrawer]);

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
                <IconButton color="inherit">
                    <AccountCircle />
                </IconButton>
                <p>My account</p>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <IconButton color="inherit">
                    <PowerSettingsNewIcon />
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );

    const renderDrawerContent = (
        <>
            <Toolbar className={classes.drawerLogo}>
                <img src="/skyfish.jpg" alt="Skyfish" className={classes.logo} />
            </Toolbar>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon className={classes.drawerWhiteText}><InsertDriveFileIcon /></ListItemIcon>
                    <ListItemText className={classes.drawerWhiteText} primary="Files & Folders" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon className={classes.drawerWhiteText}><CloudUploadIcon /></ListItemIcon>
                    <ListItemText className={classes.drawerWhiteText} primary="Upload" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon className={classes.drawerWhiteText}><PeopleAltIcon /></ListItemIcon>
                    <ListItemText className={classes.drawerWhiteText} primary="Users" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon className={classes.drawerWhiteText}><LinkIcon /></ListItemIcon>
                    <ListItemText className={classes.drawerWhiteText} primary="Shared links" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon className={classes.drawerWhiteText}><SettingsIcon /></ListItemIcon>
                    <ListItemText className={classes.drawerWhiteText} primary="Settings" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon className={classes.drawerWhiteText}><HelpIcon /></ListItemIcon>
                    <ListItemText className={classes.drawerWhiteText} primary="Help" />
                </ListItem>
            </List>
        </>
    );

    return (
        <>
            <AppBar
                color="secondary"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: openDesktopDrawer,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        className={classes.menuIconDesktop}
                        onClick={openDesktopDrawer ? handleDesktopDrawerClose : handleDesktopDrawerOpen}
                    >
                        {!openDesktopDrawer && <MenuIcon />}
                        {openDesktopDrawer && (theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        edge="start"
                        className={classes.menuIconMobile}
                        onClick={toggleMobileDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Search />
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton color="inherit">
                            <Badge
                                badgeContent={3}
                                color="primary"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Button
                            color="inherit"
                            onClick={handleProfileMenuOpen}
                            startIcon={<AccountCircle />}
                        >
                            Hello, Zoltan
                        </Button>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton color="inherit">
                            <Badge
                                badgeContent={3}
                                color="primary"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: openDesktopDrawer,
                    [classes.drawerClose]: !openDesktopDrawer,
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: openDesktopDrawer,
                        [classes.drawerClose]: !openDesktopDrawer,
                    }),
                }}
            >
                {renderDrawerContent}
            </Drawer>
            {renderMenu}
            <SwipeableDrawer
                open={openMobileDrawer}
                onClose={toggleMobileDrawer(false)}
                onOpen={toggleMobileDrawer(true)}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
            >
                <div
                    className={classes.list}
                >
                    {renderDrawerContent}
                </div>
            </SwipeableDrawer>
        </>
    );
};

TopBar.propTypes = {
    onOpen: PropTypes.func,
};

TopBar.defaultProps = {
    onOpen: () => {},
};

export default TopBar;
