import React, { useState, useEffect } from "react";
import { auth, signInWithGoogle } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Container, Card, Form, Alert } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import "../styles/Login.css"; // Import custom styles

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        // Register a new user
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Login existing user
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="login-container">
      <Card className="login-card">
        <Card.Body className="text-center">
          <h2 className="mb-3">Welcome to NoteSphere</h2>
          <p className="mb-4">Organize your thoughts effortlessly</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              {isRegister ? "Register" : "Login"}
            </Button>
          </Form>

          <div className="mt-3">
            <Button variant="light" className="google-btn" onClick={signInWithGoogle}>
              <FcGoogle size={22} /> Sign in with Google
            </Button>
          </div>

          <div className="mt-3">
            <p>
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <span
                className="toggle-link"
                onClick={() => setIsRegister(!isRegister)}
                style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;

