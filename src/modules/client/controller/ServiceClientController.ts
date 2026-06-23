import { isValidRequest } from "@/@types/contracts/Request";
import { Request } from "@/@types/contracts/Request";
import { ServiceClientService } from "../service/ServiceClientService";
import { MessagePayload } from "@/@types/contracts/payload/MessagePayload";
import { LoadBalancerPayload } from "@/@types/contracts/payload/LoadBalancerPayload";

export class ServiceClientController {
    constructor(
        private serviceClientService: ServiceClientService
    ) {}

    public redirect(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest) {
            return;
        }

        const payload = request.body.payload;

        const {queueMessageId, event, apiPayload} = payload as MessagePayload;

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

        const payload = request.body.payload;

        const {queueMessageId} = payload as LoadBalancerPayload;

        this.serviceClientService.retryRequest(
            queueMessageId,
            socket
        );
    }
}