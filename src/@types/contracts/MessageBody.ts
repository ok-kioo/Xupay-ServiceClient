import { GatewayPayload } from "./payload/GatewayPayload";
import { LoadBalancerPayload } from "./payload/ServicePayload";

export type Payload = GatewayPayload | LoadBalancerPayload;

export type MessageBody = {
    payload: Payload;
};