import { useState } from "react";
import { useRouter } from "next/router";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function register(){
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const [message, setMessage] = useState();
    const router = useRouter()
    function backToMain(){
        router.push("/");
    }
    function fetchAPI(){
        let body = JSON.stringify({name, password});
        fetch("http://localhost:3030/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, Text/plain, */*"
            },
            body 
        })
        .then(res => res.json())
        .then(data => data.success ? setMessage(data.message) : setError(data.message))
        .catch(error => console.log(error));
    }
    return (
        <Container style={{
            display: "flex",
            height: "100vh",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flex:1
        }}>
            {error && <Alert variant="danger" onClose={() => setError(false)} dismissible>{error}</Alert>}
            {message && <Alert variant="success" onClose={() => setMessage(false)} dismissible>{message}</Alert>}
            <div className="d-flex align-items-center justify-content-center" style={{flexDirection:"row"}}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Nome de usuário</Form.Label>
                            <Form.Control type="text" placeholder="Nome de usuário" onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword" onChange={(e) => setPassword(e.target.value)}>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="Senha" />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Button variant="outline-success" onClick={() => backToMain()}>
                                    Voltar
                                </Button>
                            </Col>
                            <Col>                                
                                <Button variant="outline-secondary" type="button" onClick={() => fetchAPI()}>
                                    Login
                                </Button>
                            </Col>
                        </Row>                        
                    </Col>
                </Row>
                
            </div>
        </Container>
    )
}