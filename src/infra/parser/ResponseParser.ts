import { Response } from "@/@types/contracts/Response";
import { Request } from "@/@types/contracts/Request";

export class ResponseParser {
  public static deserialize(rawRequest: string): Request {
    try {
      const request = rawRequest.trim();

      const parts = request.split("|");

      if (parts.length !== 3) {
        throw new Error(
          "Requisição com campos diferentes do esperado " + request
        );
      }

      const [method, path, rawBody] = parts;

      const bodyParts = rawBody.split(";").map((part) => part.trim());

      if (bodyParts.length !== 4) {
        throw new Error(
          "Corpo da requisição com campos diferentes do esperado " + rawBody
        );
      }

      const [source, type, rawPayload, timestamp] = bodyParts;

      const payload = this.parsePayload(rawPayload);

      return {
        method,
        path,
        body: {
          source,
          type,
          payload,
          timestamp: timestamp.trim(),
        },
      };
    } catch (error: any) {
      throw new Error(`Formato inválido de corpo: ${error.message}`);
    }
  }

  private static parsePayload(rawPayload: string): {
    queueMessageId: string;
    service: string;
    apiPayload: string;
  } {
    if (!rawPayload || rawPayload.trim() === "") {
      throw new Error("Payload vazio");
    }

    const payloadMarker = ",apiPayload=";
    const markerIndex = rawPayload.indexOf(payloadMarker);

    if (markerIndex === -1) {
      throw new Error(
        "Payload inválido. Esperado: queueMessageId=xxx,service=yyy,apiPayload=zzz"
      );
    }

    const metadataPart = rawPayload.slice(0, markerIndex);
    const apiPayload = rawPayload.slice(markerIndex + payloadMarker.length);

    const metadata = this.parseMetadata(metadataPart);

    if (!metadata.queueMessageId) {
      throw new Error("Campo obrigatório ausente no payload: queueMessageId");
    }

    if (!metadata.service) {
      throw new Error("Campo obrigatório ausente no payload: service");
    }

    if (!apiPayload.trim()) {
      throw new Error("Campo obrigatório vazio no payload: apiPayload");
    }

    return {
      queueMessageId: metadata.queueMessageId,
      service: metadata.service,
      apiPayload: apiPayload.trim(),
    };
  }

  private static parseMetadata(rawMetadata: string): Record<string, string> {
    const result: Record<string, string> = {};

    const fields = rawMetadata.split(",");

    for (const field of fields) {
      const separatorIndex = field.indexOf("=");

      if (separatorIndex === -1) {
        throw new Error(`Campo de metadata sem "=": ${field}`);
      }

      const key = field.slice(0, separatorIndex).trim();
      const value = field.slice(separatorIndex + 1).trim();

      if (!key || !value) {
        throw new Error(`Campo de metadata inválido: ${field}`);
      }

      result[key] = value;
    }

    return result;
  }

  public static serialize(response: Response): string {
    return `${response.method}|${response.path}|${response.body.source};${response.body.type};${response.body.payload};${response.body.timestamp}`;
  }
}