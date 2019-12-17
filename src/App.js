import React from 'react';
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
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

const App = () => {
    const classes = useStyles();
    const [openDesktopDrawer, setOpenDesktopDrawer] = React.useState(false);

    return (
        <MuiThemeProvider theme={createMuiTheme(Theme)}>
            <div className={classes.root}>
                <CssBaseline />
                <TopBar onOpen={setOpenDesktopDrawer} />
                <Files />
                <BottomBar open={openDesktopDrawer} />
            </div>
            <UploadSpeedDial />
        </MuiThemeProvider>
    );
};

App.displayName = App;
export default App;
