import express, {Request, Response} from "express";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@m1chals-ticketing/common";
import {TicketUpdatedPublisher} from "../events/publishers/ticket-updated-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.put('/api/tickets/:id', [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('price')
        .isFloat({gt: 0})
        .withMessage('Price must be greater than 0')
        .not()
        .isEmpty()
        .withMessage('Price is required')
], validateRequest, requireAuth, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id, price: ticket.price, title: ticket.title, userId: ticket.userId
    });

    res.send(ticket);
});

export {router as updateTicketRouter}