import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, OrderStatus, requireAuth} from "@m1chals-ticketing/common";
import {Order} from "../models/order";

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if(!order) {
        throw new NotFoundError();
    }
    if(req.currentUser!.id !== order.userId) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(201).send(order);
});

export { router as deleteOrderRouter};