import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/Header";

const App = ({Component, pageProps, currentUser}) => {
    return <div>
        <Header currentUser={currentUser}/>
        <Component {...pageProps}/>
    </div>
}

App.getInitialProps = async appContext => {
    const {data} = await buildClient(appContext.ctx).get('/api/users/currentuser').catch(e => e.message);
    return {...data};
};

export default App;