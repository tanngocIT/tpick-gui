import * as signalR from '@microsoft/signalr';

const URL = process.env.REACT_APP_RHUB ?? 'http://localhost:5010/hub';

let connection;
let dispatch;

const initHandlers = () => {
    connection.on('OrderRefreshed', () => {
        dispatch({ type: 'OrderRefreshed' });
    });
};

export const newConnection = async (accessToken, initDispatch) => {
    if (connection) {
        await connection.stop();
    }

    dispatch = initDispatch;
    connection = new signalR.HubConnectionBuilder()
        .withUrl(URL, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,

            accessTokenFactory: () => accessToken
        })
        .withAutomaticReconnect([0, 5000, 10000, 20000, 60000, 300000])
        .configureLogging(signalR.LogLevel.None)
        .build();

    initHandlers();

    try {
        await connection.start();
        console.debug('SignalR Connected.');
    } catch (e) {
        console.debug('SignalR Error', e);
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
};

export const addToGroup = async (groupName) => {
    let loop = true;

    while (loop) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await connection.invoke('AddToGroup', groupName);
            loop = false;
        } catch (e) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => setTimeout(resolve, 3000));
            console.debug('Error adding to group', groupName);
        }
    }
};
