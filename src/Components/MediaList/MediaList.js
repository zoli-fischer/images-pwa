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

const MediaList = ({ setDeleteInfo, width, innerRef }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [loading, setLoading] = React.useState(false);
    const [fileLoading, setFileLoading] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    /*
    const [files, setFiles] = React.useState(JSON.parse('[{"Key":"photo-1469854523086-cc02fe5d8800.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"deddc6decfb0e43bfc276cbbac828029","Size":332814,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1469881317953-097ae79770ea.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"1333de5e7723008e732222dfee60beb6","Size":226586,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1490730141103-6cac27aaab94.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"868662cce518f9c22f6e9268ac588e9c","Size":181829,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1501183007986-d0d080b147f9.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"b1039120fb787108cc463365a535249b","Size":97847,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1507608869274-d3177c8bb4c7.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"358bb838fa81f38c788a7374ab10ed7f","Size":78482,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1514315384763-ba401779410f.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"ce1d1cb1a1b4087284e0f3506775c136","Size":113888,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1532882191016-9133c6d82083.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"be4d15fa8096bad4c468c3ea0469afa3","Size":95242,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1533228876829-65c94e7b5025.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"0b18e4b62fb7f60f3275c24fb78c249f","Size":104264,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1558981852-426c6c22a060.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"5cbede8ee00a2f256c4b210e0d42a281","Size":214714,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}},{"Key":"photo-1562694909-3d53309d5e14.jpg","LastModified":"2019-12-17T14:39:15.000Z","ETag":"1b88f49153cc9f249e5a38196c1e00c0","Size":231461,"StorageClass":"ONEZONE_IA","Owner":{"ID":"d5dbbd814af982ebbc1aeabc9a38b8f224c4e1cf46e118ee148aedfe823999d8"}}]')
        .map(file => ({
            img: `https://image-pwa-upload.s3.eu-central-1.amazonaws.com/${file.Key}`,
            id: file.ETag,
            Key: file.Key,
            title: file.Key,
            size: file.Size,
        })));
    */
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
                })));
            })
            .catch((error) => {
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteByKey = (Key) => {
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

    React.useImperativeHandle(innerRef, () => ({
        reload,
    }));

    return (
        <>
            <div className={classes.root} ref={innerRef}>
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
                            <Tooltip title="Delete" arrow>
                                <IconButton
                                    color="inherit"
                                    onClick={() => { deleteByKey(openFile.Key); }}
                                >
                                    <DeleteOutlineOutlinedIcon />
                                </IconButton>
                            </Tooltip>
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
                    open={loading || fileLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    );
};

MediaList.propTypes = {
    setDeleteInfo: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default withWidth()(MediaList);
