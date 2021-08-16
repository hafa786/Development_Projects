import React from 'react';
// import style from './Navigation.module.css';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Navigation() {
    return(
        <>
            <Navbar collapseOnSelect expand='sm' bg='light' variant='light' >
                <Container>
                    <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                    <Navbar.Collapse id='responsive-navbar-nav' >
                        <Nav>
                            <Nav.Link href='/'>Home</Nav.Link>
                            <Nav.Link href='/incoming-events'>incoming events</Nav.Link>
                            <Nav.Link href='/ongoing-events'>Ongoing events</Nav.Link>
                            <Nav.Link href='/games'>Games</Nav.Link>
                            <Nav.Link href='/contact'>Contact us</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>  
        </>    
    );
}
export default Navigation;