import request from "supertest";
import mongoose from "mongoose";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import {OrderStatus} from "@m1chals-ticketing/common";
import {Order} from "../../models/order";

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ticketId})
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();
    const order = Order.build({
        ticket,
        userId: 'dw23dasd4awda2r',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ticketId: ticket.id})
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ticketId: ticket.id})
        .expect(201);
});