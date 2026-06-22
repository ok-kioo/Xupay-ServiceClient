import { Socket } from 'net';
import { Request } from '@/@types/contracts/Request';
import { ServiceClientController } from '@/modules/client/controller/ServiceClientController';
import { ServiceClientService } from '@/modules/client/service/ServiceClientService';
import { ErrorHandler } from '@/infra/middleware/Error';

export class Routes {
    private serviceClientController: ServiceClientController;
    private serviceClientService: ServiceClientService;

    constructor() {
        this.serviceClientService = new ServiceClientService();
        this.serviceClientController = new ServiceClientController(this.serviceClientService);
    }

    public handle(request:Request, socket:Socket) : void  {

        if (request.method === 'POST' && request.path === 'redirect') {
            this.serviceClientController.redirect(request, socket);

        } else if (request.method === 'POST' && request.path === 'retry') {
            this.serviceClientController.retry(request, socket);

        } else {
            return ErrorHandler.handle("Rota não encontrada", socket);
        }
        
    }
}