import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider, useSnackbar } from 'notistack';

const EnhancedSnackBarProvider = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const snackBarMessage = useSelector((state) => state.customization.snackBarMessage);

    useEffect(() => {
        if (!snackBarMessage) return;

        enqueueSnackbar(snackBarMessage.message, snackBarMessage.options || {});
    }, [snackBarMessage, enqueueSnackbar]);

    return <div>{children}</div>;
};

const HelperProvider = ({ children }) => {
    return (
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <EnhancedSnackBarProvider>
                <ConfirmProvider>{children}</ConfirmProvider>
            </EnhancedSnackBarProvider>
        </SnackbarProvider>
    );
};

export default HelperProvider;
