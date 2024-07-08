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
        const user = JSON.parse(message.toString()) 
        ws.username = user.nameUser;

        custom.NewUser(
            customText.bold + customText.colors.cyan + ' | ' + customText.end +
            customText.colors.magenta + 'Usuario conectado: ' +
            customText.bold + customText.colors.blanco + ws.username + customText.end +
            customText.bold + customText.colors.cyan + ' | ' + customText.end
        );

        custom.Success(
            customText.bold + customText.colors.cyan + ' | ' + customText.end +
            customText.colors.blanco + message + customText.end +
            customText.bold + customText.colors.cyan + ' | ' + customText.end
        )
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