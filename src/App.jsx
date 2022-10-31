import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import SimpleAuthProvider from 'providers/SimpleAuthProvider';
import HubProvider from 'providers/HubProvider';
import HelperProvider from 'providers/HelperProvider';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <HelperProvider>
                    <SimpleAuthProvider />
                    <HubProvider>
                        <CssBaseline />
                        <NavigationScroll>
                            <Routes />
                        </NavigationScroll>
                    </HubProvider>
                </HelperProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
