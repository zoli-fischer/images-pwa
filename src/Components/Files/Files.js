import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
// import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import MediaList from '../MediaList/MediaList';
import TreeView from './Components/TreeView/TreeView';

const useStyles = makeStyles(theme => ({
    hidden: {
        visibility: 'hidden',
    },
    fluid: {
        maxWidth: '100%',
        height: '100%',
        padding: 0,
    },
    holder: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100% - 64px)',
        [theme.breakpoints.down('sm')]: {
            height: 'calc(100% - 112px)',
        },
    },
    folderView: {
        width: 240,
        flexGrow: 0,
        flexShrink: 0,
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    filesView: {
        position: 'relative',
        flexGrow: 1,
        padding: 15,
        '-webkit-overflow-scrolling': 'touch',
        overflowY: 'scroll',
        backgroundColor: '#fff',
    },
}));

const Files = () => {
    const classes = useStyles();

    return (
        <Container className={classes.fluid}>
            <Toolbar className={classes.hidden} />
            <div className={classes.holder}>
                <div className={classes.folderView}>
                    <TreeView />
                </div>
                <Divider orientation="vertical" variant="fullWidth" />
                <div className={classes.filesView}>
                    <MediaList />
                </div>
            </div>
        </Container>
    );
};

export default Files;
