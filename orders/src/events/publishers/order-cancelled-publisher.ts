import {OrderCancelledEvent, Publisher, Subjects} from "@m1chals-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}