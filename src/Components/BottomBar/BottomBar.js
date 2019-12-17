import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    bottomBar: {
        top: 'auto',
        bottom: 0,
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
}));

const BottomBar = ({ open }) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    return (
        <AppBar
            className={classNames(classes.appBar, classes.bottomBar, {
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
    );
};

BottomBar.propTypes = {
    open: PropTypes.bool,
};

BottomBar.defaultProps = {
    open: false,
};

export default BottomBar;
