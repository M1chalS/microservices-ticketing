import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
    const [ timeLeft, setTimeLeft ] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push("/orders")
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            const time = Math.round(msLeft / 1000);
            setTimeLeft(time);
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    if (timeLeft < 0) {
        return <div>Order expired</div>;
    }

    return <div>
        <h3>Time left to pay: { timeLeft } seconds</h3>
        <StripeCheckout
            token={ ({ id }) => doRequest({token: id}) }
            stripeKey="pk_test_51MXwCzEOBpeSNdTZp6enqR2Ol5sFz136Fl0ZuJJrHTh0lknQFmBJK0p6SDcABSWQpRKCBMfPZ6IDdgXTWnddisZo00YzNVNw3Y"
            amount={ order.ticket.price * 100 }
            email={ currentUser.email }
        />
        {errors}
    </div>;
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${ orderId }`);

    return { order: data };
};

export default OrderShow;