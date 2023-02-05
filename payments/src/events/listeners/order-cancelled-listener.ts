import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@m1chals-ticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findOne({
            id: data.id,
            version: data.version - 1
        });

        if(!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();

        msg.ack();
    }

    queueGroupName = queueGroupName;
    readonly subject = Subjects.OrderCancelled;

}