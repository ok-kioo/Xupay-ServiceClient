import { MessagePayload } from "./payload/MessagePayload";
import { LoadBalancerPayload } from "./payload/LoadBalancerPayload";

export type Payload = MessagePayload | LoadBalancerPayload;

export type MessageBody = {
    payload: Payload;
};