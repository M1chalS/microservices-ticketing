import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@m1chals-ticketing/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock('../../stripe');
it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup())
        .send({
            token: 'dsadfgw',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('return a 401 when purchasing another person order', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 40
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup())
        .send({
            token: 'dsadfgw',
            orderId: order.id
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        status: OrderStatus.Cancelled,
        price: 40
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup(userId))
        .send({
            token: 'dsadfgw',
            orderId: order.id
        })
        .expect(400);
});

it('returns a 204 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        status: OrderStatus.Created,
        price: 20
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signup(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    const chargedOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    const chargeResult = await (stripe.charges.create as jest.Mock).mock
        .results[0].value;

    expect(chargedOptions.source).toEqual('tok_visa');
    expect(chargedOptions.amount).toEqual(order.price * 100);
    expect(chargedOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: chargeResult.id,
    });

    expect(payment).toBeDefined();
    expect(payment!.orderId).toEqual(order.id);
    expect(payment!.stripeId).toEqual(chargeResult.id);
});