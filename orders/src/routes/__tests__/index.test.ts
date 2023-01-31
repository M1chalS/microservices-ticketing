import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    return ticket;
}

it('fetches orders for a particular user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signup();
    const userTwo = global.signup();

    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticketOne.id})
        .expect(201);

    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201);

    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201);

    const responseOne = await request(app)
        .get('/api/orders')
        .set('Cookie', userOne)
        .expect(200);

    const responseTwo = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    expect(responseOne.body.length).toEqual(1);
    expect(responseTwo.body.length).toEqual(2);
    expect(responseTwo.body[0].id).toEqual(orderOne.id);
    expect(responseTwo.body[1].id).toEqual(orderTwo.id);
    expect(responseTwo.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(responseTwo.body[1].ticket.id).toEqual(ticketThree.id);
});