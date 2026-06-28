import { JsonValue } from "../JsonValue";
import { PayloadBase } from "../PayloadBase";

export type GatewayPayload = PayloadBase & {
  event: string;
  apiPayload: JsonValue;
};