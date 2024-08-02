import { WebSocket, WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import * as http from 'http';
import { custom, customText } from '../Services/customSignale';

dotenv.config();

const PORT = process.env.PORT || 8000;

interface IWebSocket extends WebSocket {
    username: string;
}

const server = http.createServer(); // Cambiar de https a http

const wss = new WebSocketServer({ server });

const clients: Set<IWebSocket> = new Set();

wss.on('connection', (ws: IWebSocket) => {
    clients.add(ws);
    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());

        switch (data.event) {
            case "Trigger":
                custom.Success(
                    customText.bold + customText.colors.cyan + ' | ' + customText.end +
                    customText.bold + customText.colors.blanco + 'Evento: ' + customText.end +
                    customText.colors.blanco + data.event + customText.end,
                    customText.bold + customText.colors.blanco + 'Usuario: ' + customText.end +
                    customText.colors.blanco + data.user + customText.end,
                    customText.bold + customText.colors.blanco + 'Rol: ' + customText.end +
                    customText.colors.blanco + data.role + customText.end,
                    customText.bold + customText.colors.blanco + 'Dispositivo: ' + customText.end +
                    customText.colors.blanco + data.triggerDevice.nameDevice + customText.end,
                    customText.bold + customText.colors.cyan + ' | ' + customText.end
                );
                try {

                    clients.forEach(client => {
                        if (client.username != ws.username && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ event: data.event  , triggerDevice: data.triggerDevice }));
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
                break;
            case "newAction":
                custom.Success(
                    customText.bold + customText.colors.cyan + ' | ' + customText.end +
                    customText.bold + customText.colors.blanco + 'Evento: ' + customText.end +
                    customText.colors.blanco + data.event + customText.end,
                    customText.bold + customText.colors.blanco + 'Usuario: ' + customText.end +
                    customText.colors.blanco + data.data.user + customText.end,
                    customText.bold + customText.colors.blanco + 'Rol: ' + customText.end +
                    customText.colors.blanco + data.data.role + customText.end,
                    customText.bold + customText.colors.blanco + 'Dispositivo: ' + customText.end +
                    customText.colors.blanco + data.data.device + customText.end,
                    customText.bold + customText.colors.cyan + ' | ' + customText.end
                );
                try {

                    clients.forEach(client => {
                        if (client.username != ws.username && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(data));
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
                break;
            case "Temperature":
                custom.Success(
                    customText.bold + customText.colors.cyan + ' | ' + customText.end +
                    customText.bold + customText.colors.blanco + 'Evento: ' + customText.end +
                    customText.colors.blanco + data.event + customText.end,
                    customText.bold + customText.colors.cyan + ' | ' + customText.end
                );
                try {

                    clients.forEach(client => {
                        if (client.username != ws.username && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(data));
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
                break;
            default:
                if (data.nameUser) {
                    ws.username = data.nameUser;
                    custom.NewUser(
                        customText.bold + customText.colors.cyan + ' | ' + customText.end +
                        customText.colors.magenta + 'Usuario conectado: ' +
                        customText.bold + customText.colors.blanco + ws.username + customText.end +
                        customText.bold + customText.colors.cyan + ' | ' + customText.end
                    );

                }
                break;
        }
    });

    ws.on('close', () => {
        custom.Close(
            customText.bold + customText.colors.cyan + '| ' + customText.end +
            customText.colors.magenta + 'Usuario desconectado: ' +
            customText.bold + customText.colors.blanco + ws.username + customText.end +
            customText.bold + customText.colors.cyan + '| ' + customText.end
        );
    });
});

server.listen(PORT, () => {
    console.clear();
    custom.Success(
        customText.bold + customText.colors.cyan + '| ' + customText.end +
        customText.colors.magenta + 'Servidor corriendo en el puerto: ' +
        customText.bold + customText.colors.blanco + PORT + customText.end +
        customText.bold + customText.colors.cyan + ' |' + customText.end
    );
});
