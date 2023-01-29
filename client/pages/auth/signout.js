import useRequest from "../../hooks/use-request";
import Router from "next/router";
import {useEffect} from "react";

const signout = () => {

    const {doRequest} = useRequest({
        url: '/api/users/signout',
        method: 'post',
        onSuccess: () => {
            Router.push('/')
        }
    });

    useEffect(() => {
        doRequest();
    }, []);


    return <div>Signing you out...</div>
}

export default signout;