import React from 'react'
import { Button, Modal, Nav, Container, Navbar } from 'react-bootstrap';


const NavBar = () => {
  return (
    <>
        <Navbar bg="primary" variant="dark" expand={false}>
            <Container fluid>
                <Navbar.Brand href="#">Mustang-Go Shopping Services</Navbar.Brand>
            </Container>
        </Navbar>
    </>
  )
}

export default NavBar