import { MessageBody } from "@/@types/contracts/MessageBody";
import { Socket } from "net";
import { ErrorHandler } from "@/infra/middleware/Error";
import { ResponseParser } from "@/infra/parser/ResponseParser";

export class DNSService {
    private mapping: Record<string, string> = {
        "payment-service-1": process.env["PAYMENT-IP-1"] || "",
        "payment-service-2": process.env["PAYMENT-IP-2"] || "",
        "payment-service-3": process.env["PAYMENT-IP-3"] || "",
        "history-service-1": process.env["HISTORY-IP-1"] || "",
        "history-service-2": process.env["HISTORY-IP-2"] || "",
        "history-service-3": process.env["HISTORY-IP-3"] || "",
        "processing-service-1": process.env["PROCESSING-IP-1"] || "",
        "processing-service-2": process.env["PROCESSING-IP-2"] || "",
        "processing-service-3": process.env["PROCESSING-IP-3"] || ""
    };
        
    public getIp(messageBody: MessageBody, socket: Socket): string | void {
        if (!messageBody.payload || typeof messageBody.payload === "string") {
            return ErrorHandler.handle("Payload ausente ou em formato inválido", socket);
        }

        const ip = this.mapping[messageBody.payload.instanceName];

        if (!ip) {
            return ErrorHandler.handle('Nome da instância: ' + messageBody.payload.instanceName + ' não encontrado', socket);
        }
        
        const payload = `instanceName=${messageBody.payload.instanceName},ip=${ip}`;

        const response = ResponseParser.serialize({
            method: 'GET',
            path:'resolve',
            body: {
                source: 'DNS_SERVICE',
                type: 'RESPONSE',
                payload,
                timestamp: new Date().toISOString()
            }
        });

        socket.write(response);
        socket.end();
    }
}
  