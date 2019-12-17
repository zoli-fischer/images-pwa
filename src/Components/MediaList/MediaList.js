import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import InfoIcon from '@material-ui/icons/Info';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { listObjects, downloadImage } from '../../utils/aws';

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

const MediaList = ({ width }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [loading, setLoading] = React.useState(true);
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
        listObjects()
            .then((data) => {
                setFiles(data.Contents.map(file => ({
                    img: `https://image-pwa-upload.s3.eu-central-1.amazonaws.com/${file.Key}`,
                    id: file.ETag,
                    Key: file.Key,
                    title: file.Key,
                    size: file.Size,
                })));
            })
            .catch((error) => {
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        reload();
    }, []);

    useEffect(() => {
        if (openMap) {
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

    return (
        <div className={classes.root}>
            <p className={classes.title}>
                {loading ? <Skeleton component="span" variant="text" className={classes.textSkeleton} /> : 'December 2019'}
            </p>
            <GridList cellHeight={180} className={classes.gridList} cols={getGridListCols(width)} spacing={2}>
                {files.map(file => (
                    <GridListTile key={file.id}>
                        <img src={file.img} alt={file.title} />
                        <GridListTileBar
                            title={file.title}
                            subtitle={<span>{(file.size / 1024).toFixed(0)} kb</span>}
                            actionIcon={(
                                <IconButton
                                    aria-label={`info about ${file.title}`}
                                    className={classes.icon}
                                    onClick={() => {
                                        setOpenFile(file);
                                        handleClickOpen();
                                    }}
                                >
                                    <InfoIcon />
                                </IconButton>
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
                        {isGeo && (
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
                <div className={classes.zoom} style={{ backgroundImage: `url(${openFile.img})` }} onClick={handleClose} />
            </Dialog>
            <Dialog fullScreen={mapFullScreen} open={openMap} onClose={handleMapClose} TransitionComponent={Transition}>
                <DialogTitle>Location service</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {mapCoord && (
                            <iframe
                                title="map"
                                src={`https://maps.google.com/maps?q=${mapCoord.lat}, ${mapCoord.lng}&z=15&output=embed`}
                                width="100%"
                                height="270"
                                style={{ border: 0 }}
                            />
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
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

MediaList.propTypes = {
    width: PropTypes.string.isRequired,
};

export default withWidth()(MediaList);
