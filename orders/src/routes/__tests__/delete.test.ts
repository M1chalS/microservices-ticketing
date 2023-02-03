import request from "supertest";
import {app} from "../../app";
import {Order} from "../../models/order";
import {Ticket} from "../../models/ticket";
import {OrderStatus} from "@m1chals-ticketing/common";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";

it('doesnt change status when unauthorized', async () => {
    const userOne = global.signup();
    const userTwo = global.signup();

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', userTwo)
        .expect(401);
});

it('changes order status to cancelled', async () => {
    const user = global.signup();

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    const {body: orderUpdated} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(201);

    expect(orderUpdated.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
    const user = global.signup();

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    const {body: orderUpdated} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});