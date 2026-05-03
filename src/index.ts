import net from 'net';
import { Routes } from './routes/Routes';
import { ResponseParser } from './infra/parser/ResponseParser';
import { ErrorHandler } from './infra/middleware/Error';

const routes = new Routes();

const server = net.createServer((socket: net.Socket) => {
    console.log('Cliente conectado');

    socket.on('data', (data: Buffer) => {
        try{
            const request = ResponseParser.deserialize(data.toString());

            if (!request) {
                throw new Error("Requisição mal formatada " + data.toString());
            }

            routes.handle(request, socket);
            
        } catch (error) {
            return ErrorHandler.handle("Erro ao processar requisição", socket);
        }
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(4500, () => {
    console.log('Servidor de processamento rodando na porta 4500');
});