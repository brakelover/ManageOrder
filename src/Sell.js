import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Form, Button, Table, Modal, Dropdown } from 'react-bootstrap';
import './Sell.css';

export default function Sell() {
    const [customer, setCustomer] = useState([]);
    const [product, setProduct] = useState([]);
    const [order, setOrder] = useState([]);
    const [login, setLogin] = useState({ email: "", password: "" });
    const [isCus, setIsCus] = useState(null);
    const [updateOrd, setUpdateOrd] = useState(null);
    const [addOrd, setAddOrd] = useState({ customerId: "", productId: "", quantity: "" });

    useEffect(() => {
        fetch();
    }, [])

    const fetch = async () => {
        const cusRes = await axios.get("http://localhost:9999/customers");
        setCustomer(cusRes.data);
        const proRes = await axios.get("http://localhost:9999/products");
        setProduct(proRes.data);
        const ordRes = await axios.get("http://localhost:9999/orders");
        setOrder(ordRes.data);
    }

    const handleLogin = () => {
        const foundUser = customer.find(cus => cus.email === login.email && cus.password === login.password);
        if (foundUser) {
            setIsCus(foundUser);
        }
    }

    const showLogin = () => {
        return (
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setLogin({ ...login, email: e.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setLogin({ ...login, password: e.target.value })} />
                </Form.Group>
                <Button variant="primary" onClick={handleLogin}>
                    Submit
                </Button>
            </Form>
        )
    }

    const showAddOrder = () => {
        return (
            <>
                <div style={{ display: "flex" }}>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Customer
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {customer.map((cus, index) => (
                                <Dropdown.Item key={index} onClick={() => setAddOrd({ ...addOrd, customerId: cus.id })}>{cus?.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Product
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {product.map((pro, index) => (
                                <Dropdown.Item key={index} onClick={() => setAddOrd({ ...addOrd, productId: pro.id })}>{pro?.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" onChange={(e) => setAddOrd({ ...addOrd, quantity: e.target.value })} />
                    </Form.Group>
                </Form>
                <Button variant="primary" onClick={handleAddOrder}>Add</Button>
            </>
        )
    }

    const findCus = (id) => {
        const cust = customer.find(cus => cus.id === id);
        if (cust) {
            return cust?.name;
        }
    }

    const findPro = (id) => {
        const prod = product.find(pro => pro.id === id);
        if (prod) {
            return prod?.name;
        }
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:9999/orders/${id}`);
        fetch();
    }

    const handleUpdate = () => {
        axios.put(`http://localhost:9999/orders/${updateOrd.id}`, updateOrd);
        fetch();
        handleClose();
    }

    const handleAddOrder = () => {
        axios.post("http://localhost:9999/orders", addOrd);
        fetch();
        setAddOrd(null)
    }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (id) => {
        setShow(true);
        const findOrd = order.find(ord => ord.id === id);
        if (findOrd) {
            setUpdateOrd(findOrd);
        }
    };

    const showTable = () => {
        return (
            <>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((ord, index) => {
                            return (
                                <tr key={index}>
                                    <td>{ord.id}</td>
                                    <td>{findCus(ord.customerId)}</td>
                                    <td>{findPro(ord.productId)}</td>
                                    <td>{ord.quantity}</td>
                                    <td>
                                        <Button onClick={() => handleShow(ord.id)}>Update</Button>
                                        <Button onClick={() => handleDelete(ord.id)}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </>

        )
    }

    const [showWhat, setShowWhat] = useState("table");

    const whatToShow = () => {
        if (isCus) {
            if (showWhat === "table") {
                return showTable();
            } else {
                return showAddOrder();
            }
        } else {
            return showLogin();
        }
        
    }

    return (
        <div className='contain'>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand >Quản Lý Đơn Hàng</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => setShowWhat("table")}>Đơn hàng</Nav.Link>
                            <Nav.Link onClick={() => setShowWhat("add")}>Thêm Đơn hàng</Nav.Link>
                            {isCus && <Nav.Link onClick={() => setIsCus(null)}>Đăng Xuất</Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {whatToShow()}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Product
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {product.map((pro, index) => (
                                <Dropdown.Item key={index} onClick={() => setUpdateOrd({ ...updateOrd, productId: pro.id })}>{JSON.stringify(pro.name)}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" onChange={(e) => setUpdateOrd({ ...updateOrd, quantity: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}