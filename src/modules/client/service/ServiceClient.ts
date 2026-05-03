import { SocketClient } from "@/infra/client/SocketClient";

export class ServiceClient {
  constructor(
    private readonly socketClient: SocketClient,
    private readonly serviceHost: string,
    private readonly servicePort: number
  ) {}

  public async send(queueMessageId: string, service: string, apiPayload: string, path:string): Promise<void> {
    const request = this.buildSendRequest(queueMessageId, service, apiPayload, path);

    await this.socketClient.send(
      this.serviceHost,
      this.servicePort,
      request
    );

    }

  private buildSendRequest(queueMessageId: string, service: string, apiPayload: string, path: string): string {
    let payload: string = '';

    if (path === 'redirect') {
        payload = `queueMessageId=${queueMessageId},service=${service},apiPayload=${apiPayload}`;
    } else if (path === 'retry') {
        payload = `id=${queueMessageId}`;
    }

    return `POST|${path}|SERVICE_CLIENT;REQUEST;${payload};${new Date().toISOString()}`;
  }
}