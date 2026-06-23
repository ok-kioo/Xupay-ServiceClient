import { PayloadBase } from "../PayloadBase";

export type MessagePayload = PayloadBase & {
  queueMessageId: string;
  event: string;
  apiPayload: string;
};