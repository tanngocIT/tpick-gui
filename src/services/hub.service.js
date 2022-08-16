import * as signalR from '@microsoft/signalr';

const URL = process.env.REACT_APP_RHUB ?? 'http://localhost:5010/hub';

let connection;
// let dispatch;
let accessToken;

export const newConnection = async () => {
    if (connection) {
        await connection.stop();
    }
    accessToken = localStorage.getItem('accessToken') || "meo_to_token_gi_ca";
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
