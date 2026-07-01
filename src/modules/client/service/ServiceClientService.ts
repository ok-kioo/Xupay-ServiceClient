import { JsonValue } from "@/@types/contracts/JsonValue";
import { ServiceClient } from "./client/ServiceClient";
import { SocketClient } from "@/infra/client/SocketClient";
import { ErrorHandler } from "@/infra/middleware/Error";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import { JsonCodec } from "@/infra/parser/JsonCodec";
import { v4 as uuidv4 } from 'uuid';
import { MessageClient } from "./client/MessageClient";

enum AssyncEvent {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  UPDATE_CUSTOMER
}

export class ServiceClientService {
    private socketClient: SocketClient;

    constructor() {
        this.socketClient = new SocketClient();
    }

    public async redirect(event:string, apiPayload:JsonValue, socket: any): Promise<void> {
        if(event in AssyncEvent) {
            this.redirectToMessage(event, apiPayload, socket);
        } else {
            this.redirectToService(event, apiPayload, socket);
        }
    }
    
    public async redirectToMessage(event:string, apiPayload:JsonValue, socket: any): Promise<void> {
        const messageClient = new MessageClient(this.socketClient, 
            process.env.MESSAGE_HOST || " ", 
            parseInt(process.env.MESSAGE_PORT || " ")
        );

        const idempotencyKey = uuidv4();

        try{
            await messageClient.send(event, idempotencyKey, JsonCodec.stableStringify(apiPayload));
        
        } catch (error) {
            return ErrorHandler.handle("Falha ao enviar mensagem", socket);
        }

        const response = ResponseParser.serializeResponse(200, {message: "Mensagem enviada com sucesso"});

        socket.write(response);
        socket.end();
    }

    public async redirectToService(event:string, apiPayload:JsonValue, socket: any): Promise<void> {
        let serviceResponse = null; 

        const serviceClient = new ServiceClient(this.socketClient, 
            process.env.SERVICE_HOST || " ", 
            parseInt(process.env.SERVICE_PORT || " ")
        );

        try{
            serviceResponse = await serviceClient.send(event, JsonCodec.stableStringify(apiPayload));
        } catch (error) {
            return ErrorHandler.handle("Falha ao enviar mensagem", socket);
        }

        if(serviceResponse == null){
            return ErrorHandler.handle("Falha ao receber resposta", socket);
        }

        const response = ResponseParser.serializeResponse(200, (serviceResponse.servicePayload ?? {}) as Record<string, any>);

        socket.write(response);
        socket.end();
    }

    
}