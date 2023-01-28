import express from "express";
import {requireAuth} from "../middlewares/require-auth";

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    req.session = null;

    res.send({});
});

export { router as signoutRouter };