import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import VideocamIcon from '@material-ui/icons/Videocam';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { listObjects, downloadImage, deleteFile } from '../../utils/aws';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 'auto',
        height: 'auto',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    title: {
        width: '100%',
    },
    textSkeleton: {
        maxWidth: 220,
    },
    tile: {
        cursor: 'pointer',
    },
    zoom: {
        backgroundColor: '#000000',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        position: 'absolute',
        left: 0,
        top: 64,
        width: '100%',
        bottom: 0,
        [theme.breakpoints.down('sm')]: {
            top: 56,
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    iconHolder: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '70%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
    },
    mapHolder: {
        maxWidth: '100%',
        width: 400,
        height: 260,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteDialog: {
        zIndex: '1500 !important',
    },
}));

const getGridListCols = (width) => {
    if (isWidthUp('xl', width)) {
        return 6;
    }
    if (isWidthUp('lg', width)) {
        return 4;
    }
    if (isWidthUp('md', width)) {
        return 3;
    }
    if (isWidthUp('sm', width)) {
        return 2;
    }
    return 1;
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const isGeo = !!navigator.geolocation;

const ifImage = filename => filename && filename.match(/.(jpg|jpeg|png|gif)$/i);
const ifVideo = filename => filename && filename.match(/.(mp4|mov|mpeg)$/i);

const MediaList = ({ setDeleteInfo, width, innerRef }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [loading, setLoading] = React.useState(false);
    const [fileLoading, setFileLoading] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    const [openFile, setOpenFile] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [openMap, setOpenMap] = React.useState(false);
    const [mapCoord, setMapCoord] = React.useState(null);
    const mapFullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMapClickOpen = () => {
        setOpenMap(true);
    };

    const handleMapClose = () => {
        setOpenMap(false);
    };

    const reload = () => {
        setLoading(true);
        return listObjects()
            .then((data) => {
                setFiles(data.Contents.map(file => ({
                    img: `https://image-pwa-upload.s3.eu-central-1.amazonaws.com/${file.Key}`,
                    id: `${file.Key}${file.ETag}${file.Size}${file.LastModified}`,
                    Key: file.Key,
                    LastModified: file.LastModified,
                    title: file.Key,
                    size: file.Size,
                    anchorEl: null,
                })));
            })
            .catch((error) => {
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [showDelete, setShowDelete] = React.useState(false);
    const deleteByKey = (Key) => {
        setShowDelete(Key);
    };

    const realDeleteByKey = (Key) => {
        setFileLoading(true);
        deleteFile(Key)
            .then(() => {
                handleClose();
                reload();
                setDeleteInfo(true);
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => {
                setFileLoading(false);
            });
    };

    useEffect(() => {
        reload();
    }, []);

    const [mapLoaded, setMapLoaded] = React.useState(false);
    useEffect(() => {
        if (openMap) {
            setMapLoaded(false);
            try {
                navigator.geolocation.getCurrentPosition((position) => {
                    setMapCoord({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                }, () => {
                    console.error('error');
                });
            } catch (error) {
                console.error(error);
            }
        }
    }, [openMap]);

    React.useImperativeHandle(innerRef, () => ({
        reload,
    }));

    const openFileType = (event, file) => {
        if (ifImage(file.Key) || ifVideo(file.Key)) {
            let isIcon = /(MuiIconButton-root)/.test(event.target.className);
            if (!isIcon) {
                let target = event.target.parentNode;
                while (target && !isIcon) {
                    isIcon = target && target.className && /(MuiIconButton-root)/.test(target.className);
                    target = target.parentNode;
                }
            }
            if (!isIcon) {
                setOpenFile(file);
                handleClickOpen();
            }
        }
    };

    const handleMenuClick = (event, cfile) => {
        setFiles(files.map((file) => {
            if (file === cfile) {
                // eslint-disable-next-line no-param-reassign
                file.anchorEl = event.currentTarget;
            }
            return file;
        }));
    };
    const handleMenuClose = (cfile) => {
        setFiles(files.map((file) => {
            if (file === cfile) {
                // eslint-disable-next-line no-param-reassign
                file.anchorEl = null;
            }
            return file;
        }));
    };

    return (
        <>
            <div className={classes.root} ref={innerRef}>
                <p className={classes.title}>
                    {loading ? <Skeleton component="span" variant="text" className={classes.textSkeleton} /> : 'December 2019'}
                </p>
                <GridList cellHeight={180} className={classes.gridList} cols={getGridListCols(width)} spacing={2}>
                    {files.map(file => (
                        <GridListTile
                            className={!ifImage(file.Key) && !ifVideo(file.Key) ? '' : classes.tile}
                            key={file.id}
                            onClick={(event) => { openFileType(event, file); }}
                        >
                            {ifImage(file.Key) && <img src={file.img} alt={file.title} />}
                            {ifVideo(file.Key) && <div className={classes.iconHolder}><VideocamIcon style={{ fontSize: 50 }} /></div>}
                            {!ifImage(file.Key) && !ifVideo(file.Key) && <div className={classes.iconHolder}><InsertDriveFileIcon style={{ fontSize: 50 }} /></div>}
                            <GridListTileBar
                                title={file.title}
                                subtitle={<span>{(file.size / 1024).toFixed(0)} kb</span>}
                                actionIcon={(
                                    <>
                                        <IconButton
                                            aria-label={`info about ${file.title}`}
                                            id="tileButton"
                                            className={classes.icon}
                                            onClick={(event) => { handleMenuClick(event, file); }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </>
                                )}
                            />
                        </GridListTile>
                    ))}
                </GridList>
                <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar color="secondary" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap className={classes.title}>
                                {openFile.title}
                            </Typography>
                            {isWidthUp('md', width) && (
                                <Tooltip title="Delete" arrow>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => { deleteByKey(openFile.Key); }}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {isWidthUp('md', width) && isGeo && (
                                <Tooltip title="Map" arrow>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => {
                                            handleMapClickOpen();
                                        }}
                                    >
                                        <RoomOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {isWidthUp('md', width) && (
                                <Tooltip title="Download" arrow>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => {
                                            downloadImage(openFile.Key, openFile.img);
                                        }}
                                    >
                                        <CloudDownloadOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {isWidthDown('sm', width) && (
                                <Tooltip title="Close" arrow>
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={(event) => { handleMenuClick(event, openFile); }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Close" arrow>
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={handleClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                    {ifImage(openFile.Key) && <div className={classes.zoom} style={{ backgroundImage: `url(${openFile.img})` }} onClick={handleClose} />}
                    {ifVideo(openFile.Key) && (
                        <div className={classes.zoom}>
                            <video src={openFile.img} controls className={classes.video} />
                        </div>
                    )}
                </Dialog>
                <Dialog fullScreen={mapFullScreen} open={openMap} onClose={handleMapClose} TransitionComponent={Transition}>
                    <DialogTitle>Location service</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {mapCoord && (
                                <div className={classes.mapHolder}>
                                    {!mapLoaded && <CircularProgress color="secondary" />}
                                    <iframe
                                        onLoad={() => { setMapLoaded(true); }}
                                        title="map"
                                        src={`https://maps.google.com/maps?q=${mapCoord.lat}, ${mapCoord.lng}&z=15&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, display: mapLoaded ? 'block' : 'none' }}
                                    />
                                </div>
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleMapClose} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Backdrop
                    className={classes.backdrop}
                    open={loading || fileLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
            {files.map(file => (
                <React.Fragment key={file.id}>
                    {isWidthUp('md', width) && (
                        <Menu
                            anchorEl={file.anchorEl}
                            keepMounted
                            open={Boolean(file.anchorEl)}
                            onClose={() => { handleMenuClose(file); }}
                        >
                            <MenuItem onClick={() => { handleMenuClose(file); downloadImage(file.Key, file.img); }}>
                                <IconButton color="inherit" size="small">
                                    <CloudDownloadOutlinedIcon />
                                </IconButton>
                                &nbsp;Download
                            </MenuItem>
                            {isGeo && (
                                <MenuItem onClick={() => { handleMenuClose(file); handleMapClickOpen(); }}>
                                    <IconButton color="inherit" size="small">
                                        <RoomOutlinedIcon />
                                    </IconButton>
                                    &nbsp;Map
                                </MenuItem>
                            )}
                            <MenuItem onClick={() => { handleMenuClose(file); deleteByKey(file.Key); }}>
                                <IconButton color="inherit" size="small">
                                    <DeleteOutlineOutlinedIcon />
                                </IconButton>
                                &nbsp;Delete
                            </MenuItem>
                        </Menu>
                    )}
                    {isWidthDown('sm', width) && (
                        <Drawer anchor="bottom" open={!!file.anchorEl} onClose={() => { handleMenuClose(file); }}>
                            <List>
                                <ListItem button onClick={() => { handleMenuClose(file); deleteByKey(file.Key); }}>
                                    <ListItemIcon><DeleteOutlineOutlinedIcon /></ListItemIcon>
                                    <ListItemText primary="Delete" />
                                </ListItem>
                                {isGeo && (
                                    <ListItem button onClick={() => { handleMenuClose(file); handleMapClickOpen(); }}>
                                        <ListItemIcon><RoomOutlinedIcon /></ListItemIcon>
                                        <ListItemText primary="Map" />
                                    </ListItem>
                                )}
                                <ListItem button onClick={() => { handleMenuClose(file); downloadImage(file.Key, file.img); }}>
                                    <ListItemIcon><CloudDownloadOutlinedIcon /></ListItemIcon>
                                    <ListItemText primary="Download" />
                                </ListItem>
                            </List>
                        </Drawer>
                    )}
                </React.Fragment>
            ))}
            <Dialog
                open={showDelete}
                className={classes.deleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { setShowDelete(false); }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Delete file?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to detele this file?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setShowDelete(false); }} color="primary">
                        No
                    </Button>
                    <Button onClick={() => { setShowDelete(false); realDeleteByKey(showDelete); }} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

MediaList.propTypes = {
    setDeleteInfo: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default withWidth()(MediaList);
