import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SpeedDial from '@material-ui/lab/SpeedDial';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Snackbar from '@material-ui/core/Snackbar';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { uploadFile } from '../../utils/aws';

const useStyles = makeStyles(theme => ({
    mobileSpeedDial: {
        position: 'fixed',
        bottom: theme.spacing(10),
        right: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
        zIndex: 1000,
    },
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            right: theme.spacing(4),
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
        zIndex: 1000,
    },
    Backdrop: {
        zIndex: 999,
    },
    hidden: {
        visibility: 'hidden',
    },
    speedIcon: {
        color: '#ffffff',
    },
    uploadBackdrop: {
        zIndex: 1500,
        color: '#fff',
    },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const UploadSpeedDial = ({ onUploadSuccess }) => {
    const classes = useStyles();
    const refImage = React.useRef();
    const refVideo = React.useRef();
    const refFile = React.useRef();

    const [openSpeed, setOpenSpeed] = React.useState(false);
    const handleCloseSpeed = () => {
        setOpenSpeed(false);
    };

    const handleOpenSpeed = () => {
        setOpenSpeed(true);
    };

    const [filesBottom, setFilesBottom] = React.useState(false);
    const toggleFilesBottom = openDrawer => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setFilesBottom(openDrawer);
    };

    const [uploadInfo, setUploadInfo] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(false);
    const uploadRef = (refThis) => {
        const file = refThis.current.files[0];
        if (file) {
            // eslint-disable-next-line no-param-reassign
            refThis.current.value = '';
            setUploading(true);
            handleCloseSpeed();
            uploadFile(file, (progress) => { setUploadProgress((progress.loaded / progress.total * 100).toFixed(2)); })
                .then(() => {
                    handleCloseSpeed();
                    onUploadSuccess();
                    setUploadInfo(true);
                })
                .catch((error) => {
                    alert(error);
                })
                .finally(() => {
                    setUploading(false);
                });
        }
    };

    return (
        <>
            <Backdrop open={openSpeed} className={classes.Backdrop} />
            <SpeedDial
                ariaLabel="SpeedDial"
                className={classes.speedDial}
                hidden={false}
                icon={<SpeedDialIcon className={classes.speedIcon} />}
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
                <input type="file" accept="image/*" capture ref={refImage} onChange={() => { handleCloseSpeed(); uploadRef(refImage); }} />
                <input type="file" accept="video/*" capture ref={refVideo} onChange={() => { handleCloseSpeed(); uploadRef(refVideo); }} />
                <input type="file" ref={refFile} onChange={() => { handleCloseSpeed(); uploadRef(refFile); }} />
            </div>
            <Fab color="primary" className={classes.mobileSpeedDial} onClick={toggleFilesBottom(true)}>
                <AddIcon className={classes.speedIcon} />
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
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={uploadInfo}
                onClose={() => { setUploadInfo(false); }}
                message={<span>File successfully uploaded</span>}
                autoHideDuration={4000}
                TransitionComponent={Transition}
                action={[
                    <IconButton color="inherit" onClick={() => { setUploadInfo(false); }}>
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
            <Backdrop
                open={uploading}
                className={classes.uploadBackdrop}
            >
                <div style={{ display: 'table', textAlign: 'center' }}>
                    <div style={{ display: 'table-row' }}>
                        <CircularProgress
                            color="inherit"
                            variant="static"
                            value={uploadProgress}
                        />
                    </div>
                    <div style={{ display: 'table-row' }}>
                        <Typography variant="h5">{parseInt(uploadProgress, 10) > 0 ? `${parseInt(uploadProgress, 10).toFixed(0)}%` : ''}</Typography>
                    </div>
                </div>
            </Backdrop>
        </>
    );
};

UploadSpeedDial.propTypes = {
    onUploadSuccess: PropTypes.func.isRequired,
};

export default UploadSpeedDial;
