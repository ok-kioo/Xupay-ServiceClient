import { ServiceClient } from "./ServiceClient";
import { SocketClient } from "@/infra/client/SocketClient";

export class ServiceClientService {
    private socketClient: SocketClient;

    constructor() {
        this.socketClient = new SocketClient();
    }
    public async redirectToService(queueMessageId: string, service:string, apiPayload:string): Promise<void> {
        const serviceClient = new ServiceClient(this.socketClient, 
            process.env.SERVICE_HOST || " ", 
            parseInt(process.env.SERVICE_PORT || " ")
        );

        serviceClient.send(queueMessageId, service, apiPayload, 'redirect');
    }

    public async retryRequest(queueMessageId: string, service:string, apiPayload:string): Promise<void> {
        const serviceClient = new ServiceClient(this.socketClient, 
            process.env.MESSAGER_SERVICE_HOST || " ", 
            parseInt(process.env.MESSAGER_SERVICE_PORT || " ")
        );

        serviceClient.send(queueMessageId, '', '', 'retry');
    }
}