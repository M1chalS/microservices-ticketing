import {Message} from "node-nats-streaming";
import {Listener, TicketCreatedEvent, Subjects} from "@m1chals-ticketing/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {

    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data.id, data.title, data.price, data.userId);
        msg.ack();
    }

}