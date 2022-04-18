import React from 'react';
import { UserActivity } from '../Api/UserActivity';
import { Button, Form, Nav, NavDropdown, Offcanvas, Container, FormControl, Navbar } from 'react-bootstrap';

const userActivity = new UserActivity();

const LoggedInNavBar = (props) => {
    const onLogOut = () => {
        userActivity.logOutUser()
    }

    const onDeleteAccount = () => {
        userActivity.deleteUserData()
    }


  return (
    <div>
        <Navbar bg="primary" variant="dark" expand={false}>
            <Container fluid>
                <Navbar.Brand href="#">Mustang-Go Shopping Services</Navbar.Brand>
                {props.name? <Navbar.Brand>Hi {props.name}!</Navbar.Brand>:null}
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />
                        <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                        >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link>
                                    <Button variant="warning" onClick={onLogOut}>Log Out</Button>
                                </Nav.Link>
                                <Nav.Link>
                                    <Button variant="danger" onClick={onDeleteAccount}>Delete Account And Data</Button>
                                </Nav.Link>
                            </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    </div>
  )
}

export default LoggedInNavBar