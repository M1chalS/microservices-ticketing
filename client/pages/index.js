import buildClient from "../api/build-client";

const LandingPage = ({currentUser}) => {
    return <h1>{currentUser ? "You are signed in" : "You are not signed in"}</h1>;
};

export const getServerSideProps = async (context) => {
    const {data} = await buildClient(context).get('/api/users/currentuser').catch(e => e.message);

    return {props: data};
};

export default LandingPage;