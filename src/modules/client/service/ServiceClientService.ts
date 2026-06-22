import { ServiceClient } from "./client/ServiceClient";
import { SocketClient } from "@/infra/client/SocketClient";
import { ErrorHandler } from "@/infra/middleware/Error";
import { ResponseParser } from "@/infra/parser/ResponseParser";

export class ServiceClientService {
    private socketClient: SocketClient;

    constructor() {
        this.socketClient = new SocketClient();
    }
    public async redirectToService(queueMessageId:string, event:string, apiPayload:string, socket: any): Promise<void> {
        const serviceClient = new ServiceClient(this.socketClient, 
            process.env.SERVICE_HOST || " ", 
            parseInt(process.env.SERVICE_PORT || " ")
        );

        try{
            serviceClient.send(queueMessageId, event, apiPayload, 'redirect');
        } catch (error) {
            this.retryRequest(queueMessageId, socket);
        }

        const responseBody = {
            payload:{
                queueMessageId: queueMessageId,
                event: event,
                apiPayload: apiPayload
            },
            timestamp: new Date().toISOString(),
        };

        const response = ResponseParser.serializeResponse(201, responseBody);

        socket.write(response);
        socket.end();
    }

    public async retryRequest(queueMessageId: string, socket: any): Promise<void> {

        const serviceClient = new ServiceClient(this.socketClient, 
            process.env.MESSAGE_SERVICE_HOST || " ", 
            parseInt(process.env.MESSAGE_SERVICE_PORT || " ")
        );

        try{
            serviceClient.send(queueMessageId, '', '', 'retry');

            const response = ResponseParser.serializeResponse(500, { message: "Falha ao processar requisição. Tentativa de retry realizada." });
            socket.write(response);
            socket.end();

        } catch (error) {
            return ErrorHandler.handle("Falha ao processar mensagem", socket);
        }
    }
}