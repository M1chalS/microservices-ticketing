import { PaymentCreatedEvent, Publisher, Subjects } from "@m1chals-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}