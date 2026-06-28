import { isValidRequest } from "@/@types/contracts/Request";
import { Request } from "@/@types/contracts/Request";
import { ServiceClientService } from "../service/ServiceClientService";
import { GatewayPayload } from "@/@types/contracts/payload/GatewayPayload";

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

        const {event, apiPayload} = payload as GatewayPayload;

        this.serviceClientService.redirect(
            event,
            apiPayload,
            socket
        );
    }
}