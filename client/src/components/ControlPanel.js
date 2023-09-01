import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Auth from '../utils/auth'; // Import Auth
import SelectedPosts from './SelectedPosts';
import Post from './Post';
//import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
//import { useState } from "react";
//import { toLonLat } from 'ol/proj';
//import View from 'ol/View.js';

const HeaderOptions = (props) => {
    if (Auth.loggedIn()) {
        return (
            <>
            <Nav.Link onClick={() => { props.setIsPostPaneOpen(true)}}>Post</Nav.Link>
            <Nav.Link onClick={props.history}>History</Nav.Link>
            <Nav.Link onClick={props.profile}>Profile</Nav.Link>
            <Nav.Link onClick={() => {
                Auth.logout();
            // Redirect to login page after logout
            }}>Logout</Nav.Link>
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
            </Form>
            </>
        )
    } else {
        return (
            <>
                <Nav.Link onClick={() => { props.setIsSignUpPaneOpen(true)}}>Sign Up</Nav.Link>
                <Nav.Link onClick={() => { props.setIsLoginPaneOpen(true)}}>Login</Nav.Link>
            </>
        )
    }
}

const ControlPanel = (props) => {
    const expand = 'lg';
    
    return (
        <>
            <Navbar key={expand} expand={expand} variant="main" className="mb-3">
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
                        <HeaderOptions
                            setIsSignUpPaneOpen={props.setIsSignUpPaneOpen}
                            setIsLoginPaneOpen={props.setIsLoginPaneOpen}
                            setIsPostPaneOpen={props.setIsPostPaneOpen}
                        ></HeaderOptions>
                        </Nav>
                    </Offcanvas.Body>

                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}
  
export default ControlPanel; 