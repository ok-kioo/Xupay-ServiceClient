import { ServiceClient } from "./client/ServiceClient";
import { SocketClient } from "@/infra/client/SocketClient";
import { MessageBody } from "@/@types/contracts/MessageBody";
import { ErrorHandler } from "@/infra/middleware/Error";
import { ResponseParser } from "@/infra/parser/ResponseParser";

export class ServiceClientService {
    private socketClient: SocketClient;

    constructor() {
        this.socketClient = new SocketClient();
    }
    public async redirectToService(messageBody: MessageBody, socket: any): Promise<void> {
        const serviceClient = new ServiceClient(this.socketClient, 
            process.env.SERVICE_HOST || " ", 
            parseInt(process.env.SERVICE_PORT || " ")
        );

        try{
            serviceClient.send(messageBody.payload.queueMessageId, messageBody.payload.service, messageBody.payload.apiPayload, 'redirect');
        } catch (error) {
            this.retryRequest(messageBody, socket);
        }

        const responseBody = {
            payload:{
                queueMessageId: messageBody.payload.queueMessageId,
                service: messageBody.payload.service,
                apiPayload: messageBody.payload.apiPayload
            },
            timestamp: new Date().toISOString(),
        };

        const response = ResponseParser.serializeResponse(201, responseBody);

        socket.write(response);
        socket.end();
    }

    public async retryRequest(messageBody: MessageBody, socket: any): Promise<void> {

        const serviceClient = new ServiceClient(this.socketClient, 
            process.env.MESSAGE_SERVICE_HOST || " ", 
            parseInt(process.env.MESSAGE_SERVICE_PORT || " ")
        );

        try{
            serviceClient.send(messageBody.payload.queueMessageId, '', '', 'retry');

            const response = ResponseParser.serializeResponse(500, { message: "Falha ao processar requisição. Tentativa de retry realizada." });
            socket.write(response);
            socket.end();

        } catch (error) {
            return ErrorHandler.handle("Falha ao processar mensagem", socket);
        }
    }
}