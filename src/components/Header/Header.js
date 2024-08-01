import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from "react-router-dom";
import { postLogOut } from '../../services/AuthServices';
import { toast } from 'react-toastify';
import { doLogout } from '../../redux/action/userAction';
import Language from './Language';
const Header = () => {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated)
    const account = useSelector(state => state.user.account)
    const dispatch = useDispatch()
    // console.log('accont: ', account, 'isAuthenticated', isAuthenticated)


    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
    }
    const handleSignup = () => {
        navigate('/signup')
    }

    const handleLogOut = async () => {
        let res = await postLogOut(account.email, account.refresh_token)
        if (res && res.EC === 0) {
            dispatch(doLogout())
            navigate('/login')
        }
        else {
            toast.error(res.EM)
        }
    }
    return (

        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>

                <NavLink to="/" className={({ isActive }) => (isActive ? 'navbar-brand active' : 'navbar-brand')} >React-Bootstrap</NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
                        <NavLink to="users" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>User</NavLink>
                        <NavLink to="admins" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Admin</NavLink>
                    </Nav>
                    <Nav>
                        {/* <Link to="/login">
                            <button className="btn-login">Log in</button>
                        </Link> */}
                        {isAuthenticated === false ?
                            <>

                                <button className="btn-login" onClick={() => handleLogin()}>Log in</button>
                                <button className="btn-signup" onClick={() => handleSignup()}>Sign up</button>
                            </>
                            :
                            <NavDropdown className="nav-dropdown" title="Setting" id="basic-nav-dropdown">
                                <NavDropdown.Item >Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleLogOut()}>Log out</NavDropdown.Item>
                            </NavDropdown>
                        }
                        <Language />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;