import React from 'react';
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
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
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const App = () => {
    const classes = useStyles();
    const [openDesktopDrawer, setOpenDesktopDrawer] = React.useState(false);
    const [deleteInfo, setDeleteInfo] = React.useState(false);

    const refFiles = React.createRef();

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
        </MuiThemeProvider>
    );
};

App.displayName = App;
export default App;
