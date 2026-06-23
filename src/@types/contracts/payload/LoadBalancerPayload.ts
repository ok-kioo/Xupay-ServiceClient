import { PayloadBase } from "../PayloadBase";

export type LoadBalancerPayload = PayloadBase & {
  queueMessageId: string;
};