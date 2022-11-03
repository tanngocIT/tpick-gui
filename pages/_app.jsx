import 'assets/scss/style.scss';

import Head from 'next/head';
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

const App = ({
    Component,
    pageProps,
    seo = {
        title: 'TPick - Pick Together',
        description: 'Cùng đặt nhóm thông qua TPick nào!',
        image: 'https://tpick.netlify.app/og.jpg'
    }
}) => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <Head>
                <title>{seo.title}</title>
                <link rel="icon" type="image/png" href="/favicon.svg" />
                <meta property="title" content={seo.title} />
                <meta property="description" content={seo.description} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:image" content={seo.image} />
                <meta property="og:type" content="website" />
            </Head>
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
