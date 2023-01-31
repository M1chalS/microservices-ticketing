import {OrderCreatedEvent, Publisher, Subjects} from "@m1chals-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}