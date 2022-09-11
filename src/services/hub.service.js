import * as signalR from '@microsoft/signalr';

const URL = process.env.REACT_APP_RHUB ?? 'http://localhost:5010/hub';

let connection;
// let dispatch;

export const newConnection = async (accessToken) => {
    if (connection) {
        await connection.stop();
    }
    connection = new signalR.HubConnectionBuilder()
        .withUrl(URL, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,

            accessTokenFactory: () => accessToken
        })
        .withAutomaticReconnect([0, 5000, 10000, 20000, 60000, 300000])
        .configureLogging(signalR.LogLevel.None)
        .build();

    try {
        await connection.start();

        console.log('SignalR Connected.');
    } catch (e) {
        console.log("SignalR Error", e)
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
};
