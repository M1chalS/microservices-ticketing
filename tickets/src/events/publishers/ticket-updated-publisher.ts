import {Publisher, Subjects, TicketUpdatedEvent} from "@m1chals-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}