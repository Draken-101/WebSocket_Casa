import { WebSocket, WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as https from 'https';
import { custom, customText } from '../Services/customSignale';
dotenv.config();

const PORT = process.env.PORT || 8000;

interface IWebSocket extends WebSocket {
    username: string;
}

const server = https.createServer({
    cert: fs.readFileSync('./src//certificates/cert.pem'),
    key: fs.readFileSync('./src/certificates/key.pem')
})

const wss = new WebSocketServer({ server });

wss.on('connection', (ws: IWebSocket) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message.toString())
        if (data.nameUser) {
            ws.username = data.nameUser;
            custom.NewUser(
                customText.bold + customText.colors.cyan + ' | ' + customText.end +
                customText.colors.magenta + 'Usuario conectado: ' +
                customText.bold + customText.colors.blanco + ws.username + customText.end +
                customText.bold + customText.colors.cyan + ' | ' + customText.end
            );
        };

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
                break;
            case 'getDevices':
                
                break;
            default:
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
        customText.colors.magenta + 'Servidor corriendose en el puerto: ' +
        customText.bold + customText.colors.blanco + PORT + customText.end +
        customText.bold + customText.colors.cyan + ' |' + customText.end
    )
})