import 'assets/scss/style.scss';

import { Provider, useSelector } from 'react-redux';
import { store } from 'store';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import HubProvider from 'providers/HubProvider';
import HelperProvider from 'providers/HelperProvider';
import MainLayout from 'layout/MainLayout';
import SimpleAuthProvider from 'providers/SimpleAuthProvider';

const Index = ({ Component, pageProps }) => {
    return (
        <Provider store={store}>
            <App Component={Component} pageProps={pageProps} />
        </Provider>
    );
};

const App = ({ Component, pageProps }) => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <HelperProvider>
                    <SimpleAuthProvider />
                    <HubProvider>
                        <CssBaseline />
                        <NavigationScroll>
                            <MainLayout>
                                <Component {...pageProps} />
                            </MainLayout>
                        </NavigationScroll>
                    </HubProvider>
                </HelperProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default Index;
