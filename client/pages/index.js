import Link from "next/link";

const LandingPage = ({ tickets }) => {

    const renderedTickets = tickets.map(ticket => {
        return <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
                <Link href={"/tickets/[ticketId]"} as={`/tickets/${ticket.id}`} className="link">View</Link>
            </td>
        </tr>
    });

    return <div>
        <h1>Tickets</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {renderedTickets}
            </tbody>
        </table>
    </div>;
};

LandingPage.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
};

export default LandingPage;