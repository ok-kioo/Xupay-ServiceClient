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

        const {queueMessageId, event, apiPayload} = request.body.payload;

        this.serviceClientService.redirectToService(
            queueMessageId,
            event,
            apiPayload,
            socket
        );
    }

    public retry(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest) {
            return;
        }

        const {queueMessageId} = request.body.payload;

        this.serviceClientService.retryRequest(
            queueMessageId,
            socket
        );
    }
}