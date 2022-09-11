import { useSelector } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ConfirmProvider } from 'material-ui-confirm';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import CustomAuth0Provider from 'providers/CustomAuth0Provider';
import HubProvider from 'providers/HubProvider';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                    <ConfirmProvider>
                        <HubProvider>
                            <CssBaseline />
                            <NavigationScroll>
                                <CustomAuth0Provider>
                                    <Routes />
                                </CustomAuth0Provider>
                                {/* <AuthProvider /> */}
                            </NavigationScroll>
                        </HubProvider>
                    </ConfirmProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
