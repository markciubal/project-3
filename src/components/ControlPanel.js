import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
//import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
//import { toLonLat } from 'ol/proj';
//import View from 'ol/View.js';

const ControlPanel = (props) => {
    const expand = 'lg';

    return (
        <>
            <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
            <Container fluid>
                <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    Menu
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link onClick={props.zero}><span>{`${props.centerLatitude.toFixed(props.coordinateRoundTo)}, ${props.centerLongitude.toFixed(props.coordinateRoundTo)}`}</span></Nav.Link>
                    <Nav.Link onClick={props.zero}>Zero In</Nav.Link>
                    <Nav.Link onClick={props.centerOnPoint}>Set Center</Nav.Link>
                    <NavDropdown
                        title="Dropdown"
                        id={`offcanvasNavbarDropdown-expand-${expand}`}
                    >
                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action4">
                        Another action
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5">
                        Something else here
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={props.logout}>Logout</NavDropdown.Item>
                        <NavDropdown.Item onClick={props.profile}>Profile</NavDropdown.Item>
                    </NavDropdown>
                     <Nav.Link onClick={props.history}>History</Nav.Link>
                    < Nav.Link onClick={props.createNew}>New</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                    <Form.Control
                        id="search"
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
                    </Form>
                </Offcanvas.Body>

                </Navbar.Offcanvas>
            </Container>
            </Navbar>
        </>
      );
  }
  
  export default ControlPanel;
  // logout, profile, history, new, 