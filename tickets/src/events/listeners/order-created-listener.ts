import {Listener, NotFoundError, OrderCreatedEvent, Subjects} from "@m1chals-ticketing/common";
import {queueGroupName} from './queue-group-name';
import {Message} from "node-nats-streaming";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) {
            throw new NotFoundError();
        }

        ticket.set({orderId: data.id});
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });


        msg.ack();
    }

    queueGroupName = queueGroupName;
    readonly subject = Subjects.OrderCreated;

}