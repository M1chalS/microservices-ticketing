import Link from "next/link";

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && {label: 'Sign Up', href: '/auth/signup'},
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        currentUser && {label: 'Sell tickets', href: '/tickets/new'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'}
    ].filter(linkConfig => linkConfig);

    return (
        <nav className="navbar navbar-light bg-light px-2">
            <Link href="/" className="navbar-brand">
                GitTix
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links.map(({label, href}) => (
                        <li key={label} className="nav-item">
                            <Link href={href} className="nav-link">{label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Header;