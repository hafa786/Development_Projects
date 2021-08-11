import React from 'react';
// import style from './Navigation.module.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Navigation() {
    return(
        <>
            <Navbar collapseOnSelect expand='sm' bg='dark' variant='dark' >
                <Container>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav' >
                        <Nav>
                            <Nav.Link href='/'>Home</Nav.Link>
                            <Nav.Link href='/panda'>Panda</Nav.Link>
                            <Nav.Link href='/gorilla'>Gorilla</Nav.Link>
                            <Nav.Link href='/beer'>Beer</Nav.Link>
                            <Nav.Link href='/rabbits'>Rabbits</Nav.Link>
                            <Nav.Link href='/contact'>Contact us</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>  
        </>    
    );
}
export default Navigation;