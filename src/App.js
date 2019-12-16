/* eslint-disable react/prop-types, react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'classnames';
import {
    MuiThemeProvider, createMuiTheme, makeStyles, fade, useTheme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

// Material UI Theme Customization
import Theme from './muiTheme';

const data = [
    {
        src:
            'https://i.ytimg.com/vi/pLqipJNItIo/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBkklsyaw9FxDmMKapyBYCn9tbPNQ',
        title: 'Don Diablo @ Tomorrowland Main Stage 2019 | Official…',
        channel: 'Don Diablo',
        views: '396 k views',
        createdAt: 'a week ago',
    },
    {
        src:
            'https://i.ytimg.com/vi/_Uu12zY01ts/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCpX6Jan2rxrCAZxJYDXppTP4MoQA',
        title: 'Queen - Greatest Hits',
        channel: 'Queen Official',
        views: '40 M views',
        createdAt: '3 years ago',
    },
    {
        src:
            'https://i.ytimg.com/vi/kkLk2XWMBf8/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLB4GZTFu1Ju2EPPPXnhMZtFVvYBaw',
        title: 'Calvin Harris, Sam Smith - Promises (Official Video)',
        channel: 'Calvin Harris',
        views: '130 M views',
        createdAt: '10 months ago',
    },
];

const Media = (props) => {
    const { loading } = props;

    return (
        <Grid container>
            {(loading ? Array.from(new Array(3)) : data).map((item, index) => (
                <Box key={index} width={210} marginRight={0.5} my={5}>
                    {item ? (
                        <img style={{ width: 210, height: 118 }} alt={item.title} src={item.src} />
                    ) : (
                        <Skeleton variant="rect" width={210} height={118} />
                    )}
                    {item ? (
                        <Box pr={2}>
                            <Typography gutterBottom variant="body2">
                                {item.title}
                            </Typography>
                            <Typography display="block" variant="caption" color="textSecondary">
                                {item.channel}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {`${item.views} • ${item.createdAt}`}
                            </Typography>
                        </Box>
                    ) : (
                        <Box pt={0.5}>
                            <Skeleton />
                            <Skeleton width="60%" />
                        </Box>
                    )}
                </Box>
            ))}
        </Grid>
    );
};

Media.propTypes = {
    loading: PropTypes.bool,
};

Media.defaultProps = {
    loading: false,
};

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        display: 'flex',
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
    hide: {
        display: 'none',
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
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
    },
    search: {
        display: 'flex',
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: 0,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(5),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        flexGrow: 1,
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 5),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 300,
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
    bottomBar: {
        top: 'auto',
        bottom: 0,
    },
    hidden: {
        visibility: 'hidden',
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
    list: {
        width: drawerWidth,
    },
    logo: {
        maxWidth: '50%',
        height: 'auto',
    },
    mobileSpeedDial: {
        position: 'fixed',
        bottom: theme.spacing(10),
        right: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(10),
        right: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            right: theme.spacing(4),
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}));

const App = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [mobileDrawer, setMobileDrawer] = React.useState(false);
    const [openSpeed, setOpenSpeed] = React.useState(false);
    const [filesBottom, setFilesBottom] = React.useState(false);

    const refImage = React.useRef();
    const refVideo = React.useRef();
    const refFile = React.useRef();

    const handleCloseSpeed = () => {
        setOpenSpeed(false);
    };

    const handleOpenSpeed = () => {
        setOpenSpeed(true);
    };

    const toggleFilesBottom = openDrawer => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setFilesBottom(openDrawer);
    };

    const toggleMobileDrawer = openDrawer => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMobileDrawer(openDrawer);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [value, setValue] = React.useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
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

    return (
        <MuiThemeProvider theme={createMuiTheme(Theme)}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuIconDesktop}
                            onClick={open ? handleDrawerClose : handleDrawerOpen}
                        >
                            {!open && <MenuIcon />}
                            {open && (theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
                        </IconButton>
                        <IconButton
                            edge="start"
                            className={classes.menuIconMobile}
                            onClick={toggleMobileDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Button
                                color="inherit"
                                className={classes.button}
                                onClick={handleProfileMenuOpen}
                                startIcon={<AccountCircle />}
                            >
                                Hello, Zoltan
                            </Button>
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton color="inherit">
                                <Badge badgeContent={17} color="secondary">
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
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <Toolbar>
                        <img src="/skyfish.jpg" alt="Skyfish" className={classes.logo} />
                    </Toolbar>
                    <Divider />
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Container>
                    <Toolbar className={classes.hidden} />
                    <Box my={2}>
                        <Media loading />
                        <Media />
                        {[...new Array(12)]
                            .map(() => `Cras mattis consectetur purus sit amet fermentum.
    Cras justo odio, dapibus ac facilisis in, egestas eget quam.
    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`)
                            .join('\n')}
                    </Box>
                </Container>
                <AppBar
                    className={clsx(classes.appBar, classes.bottomBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <BottomNavigation
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        showLabels
                        className={classes.bottom}
                    >
                        <BottomNavigationAction label="Files & Folders" icon={<InsertDriveFileOutlinedIcon />} />
                        <BottomNavigationAction label="Trash" icon={<DeleteOutlineIcon />} />
                        <BottomNavigationAction label="All files" icon={<AllInclusiveIcon />} />
                    </BottomNavigation>
                </AppBar>
                {renderMenu}
            </div>
            <SwipeableDrawer
                open={mobileDrawer}
                onClose={toggleMobileDrawer(false)}
                onOpen={toggleMobileDrawer(true)}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
            >
                <div
                    className={classes.list}
                >
                    <Toolbar>
                        <img src="/skyfish.jpg" alt="Skyfish" className={classes.logo} />
                    </Toolbar>
                    <Divider />
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </SwipeableDrawer>
            <SpeedDial
                ariaLabel="SpeedDial"
                className={classes.speedDial}
                hidden={false}
                icon={<SpeedDialIcon />}
                onClose={handleCloseSpeed}
                onOpen={handleOpenSpeed}
                open={openSpeed}
            >
                {[
                    { icon: <InsertDriveFileOutlinedIcon />, name: 'File', onClick: () => { refFile.current.click(); } },
                    { icon: <CameraAltOutlinedIcon />, name: 'Image', onClick: () => { refImage.current.click(); } },
                    { icon: <VideocamOutlinedIcon />, name: 'Video', onClick: () => { refVideo.current.click(); } },
                ].map(action => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => { handleCloseSpeed(); setTimeout(() => { action.onClick(); }, 100); }}
                    />
                ))}
            </SpeedDial>
            <div className={classes.hidden}>
                <input type="file" accept="image/*" capture ref={refImage} onChange={() => { handleCloseSpeed(); }} />
                <input type="file" accept="video/*" capture ref={refVideo} onChange={() => { handleCloseSpeed(); }} />
                <input type="file" ref={refFile} onChange={() => { handleCloseSpeed(); }} />
            </div>
            <Fab color="primary" className={classes.mobileSpeedDial} onClick={toggleFilesBottom(true)}>
                <AddIcon />
            </Fab>
            <Drawer anchor="bottom" open={filesBottom} onClose={toggleFilesBottom(false)}>
                <Box p={2}>
                    <Typography variant="h5">
                        Upload
                    </Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem button onClick={() => { setFilesBottom(false); refVideo.current.click(); }}>
                        <ListItemIcon><VideocamOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Video" />
                    </ListItem>
                    <ListItem button onClick={() => { setFilesBottom(false); refImage.current.click(); }}>
                        <ListItemIcon><CameraAltOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="Image" />
                    </ListItem>
                    <ListItem button onClick={() => { setFilesBottom(false); refFile.current.click(); }}>
                        <ListItemIcon><InsertDriveFileOutlinedIcon /></ListItemIcon>
                        <ListItemText primary="File" />
                    </ListItem>
                </List>
            </Drawer>
        </MuiThemeProvider>
    );
};

App.displayName = App;
export default App;
