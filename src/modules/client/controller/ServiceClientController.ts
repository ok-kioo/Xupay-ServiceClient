import { isValidRequest } from "@/@types/contracts/Request";
import { Request } from "@/@types/contracts/Request";
import { ServiceClientService } from "../service/ServiceClientService";

export class ServiceClientController {
    constructor(
        private serviceClientService: ServiceClientService
    ) {}

    public redirect(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest) {
            return;
        }

        const messageBody = request.body;

        this.serviceClientService.redirectToService(
            messageBody.payload.queueMessageId,
            messageBody.payload.event,
            messageBody.payload.apiPayload,
            socket
        );
    }

    public retry(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest) {
            return;
        }

        const messageBody = request.body;

        this.serviceClientService.retryRequest(
            messageBody.payload.queueMessageId,
            socket
        );
    }
}