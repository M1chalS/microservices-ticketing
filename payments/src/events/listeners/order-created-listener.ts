import { Listener, OrderCreatedEvent, Subjects } from "@m1chals-ticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            version: data.version,
            price: data.ticket.price,
            userId: data.userId,
            status: data.status
        });
        await order.save();

        msg.ack();
    }

    queueGroupName = queueGroupName;
    readonly subject = Subjects.OrderCreated;

}