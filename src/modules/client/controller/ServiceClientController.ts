import { isValidBodyRequest } from "@/@types/contracts/Request";
import { ErrorHandler } from "@/infra/middleware/Error";
import { Request } from "@/@types/contracts/Request";
import { ServiceClientService } from "../service/ServiceClientService";

export class ServiceClientController {
    constructor(
        private serviceClientService: ServiceClientService
    ) {}

    public redirect(request: Request, socket: any): void {
        const messageBody = isValidBodyRequest(request.body, socket);

        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição inválido", socket);
        }

        this.serviceClientService.redirectToService(
            messageBody.payload.queueMessageId,
            messageBody.payload.service,
            messageBody.payload.apiPayload
        );
    }

    public retry(request: Request, socket: any): void {
        const messageBody = isValidBodyRequest(request.body, socket);

        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição inválido", socket);
        }
        this.serviceClientService.retryRequest(
            messageBody.payload.queueMessageId,
            messageBody.payload.service,
            messageBody.payload.apiPayload
        );
    }
}