import React, { useEffect } from 'react';
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import window from 'global/window';
import Slide from '@material-ui/core/Slide';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TopBar from './Components/TopBar/TopBar';
import BottomBar from './Components/BottomBar/BottomBar';
import UploadSpeedDial from './Components/UploadSpeedDial/UploadSpeedDial';
import Files from './Components/Files/Files';

// Material UI Theme Customization
import Theme from './muiTheme';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        height: '100%',
    },
    deleteDialog: {
        zIndex: '1500 !important',
    },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

let deferredPrompt;
const App = () => {
    const classes = useStyles();
    const [openDesktopDrawer, setOpenDesktopDrawer] = React.useState(false);
    const [deleteInfo, setDeleteInfo] = React.useState(false);
    const [openInstall, setOpenInstall] = React.useState(false);

    const refFiles = React.createRef();

    console.log(deferredPrompt);
    // eslint-disable-next-line no-unused-vars
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            if (!deferredPrompt) {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();
                deferredPrompt = e;
                setOpenInstall(true);
            }
        });

        window.addEventListener('appinstalled', () => {
            console.log('a2hs installed');
        });
    }, []);

    return (
        <MuiThemeProvider theme={createMuiTheme(Theme)}>
            <div className={classes.root}>
                <CssBaseline />
                <TopBar onOpen={setOpenDesktopDrawer} />
                <Files ref={refFiles} setDeleteInfo={setDeleteInfo} />
                <BottomBar open={openDesktopDrawer} />
            </div>
            <Snackbar
                className={classes.Snackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={deleteInfo}
                onClose={() => { setDeleteInfo(false); }}
                message={<span>File successfully deleted</span>}
                autoHideDuration={4000}
                TransitionComponent={Transition}
                action={[
                    <IconButton color="inherit" onClick={() => { setDeleteInfo(false); }}>
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
            <UploadSpeedDial onUploadSuccess={() => { refFiles.current.reload(); }} />
            <Dialog
                open={openInstall}
                className={classes.deleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { setOpenInstall(false); }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Install</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add this App to Home Screen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenInstall(false); }} color="primary">
                        No
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenInstall(false);
                            deferredPrompt.prompt();
                            deferredPrompt.userChoice
                                .then((choiceResult) => {
                                    if (choiceResult.outcome === 'accepted') {
                                        console.log('User accepted the A2HS prompt');
                                    } else {
                                        console.log('User dismissed the A2HS prompt');
                                    }
                                });
                        }}
                        color="primary"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </MuiThemeProvider>
    );
};

App.displayName = App;
export default App;
