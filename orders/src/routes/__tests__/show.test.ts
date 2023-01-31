import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";

it('returns an error if unauthorized to get this order', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const userOne = global.signup();
    const userTwo = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId:  ticket.id})
        .expect(201);

    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userTwo)
        .send()
        .expect(401);
});

it('fetches the order', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const user = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId:  ticket.id})
        .expect(201);

    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});