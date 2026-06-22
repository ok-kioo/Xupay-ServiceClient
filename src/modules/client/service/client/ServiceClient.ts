import { SocketClient } from "@/infra/client/SocketClient";
import { ResponseParser } from "@/infra/parser/ResponseParser";

export class ServiceClient {
  constructor(
    private readonly socketClient: SocketClient,
    private readonly serviceHost: string,
    private readonly servicePort: number
  ) {}

  public async send(queueMessageId: string, event: string, apiPayload: string, path:string): Promise<void> {
    const request = this.buildSendRequest(queueMessageId, event, apiPayload, path);

    await this.socketClient.send(
      this.serviceHost,
      this.servicePort,
      request
    );

    }

  private buildSendRequest(queueMessageId: string, event: string, apiPayload: string, path: string): string {
      if (path === 'redirect') {
        return ResponseParser.serialize({
          method: "POST",
          path: "redirect",
          service: process.env.XUPAY_SERVICE_NAME || "xupay-service-client",
          secret: process.env.XUPAY_SERVICE_SECRET,
          body: {
            queueMessageId,
            event,
            apiPayload,
            timestamp: new Date().toISOString(),
          },
        });
    } 

    else if (path === 'retry') {
        return ResponseParser.serialize({
          method: "POST",
          path: "retry",
          service: process.env.XUPAY_SERVICE_NAME || "xupay-service-client",
          secret: process.env.XUPAY_SERVICE_SECRET,
          body: {
            queueMessageId,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return '';
  }
}