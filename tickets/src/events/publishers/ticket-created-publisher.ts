import {Publisher, Subjects, TicketCreatedEvent} from "@m1chals-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}