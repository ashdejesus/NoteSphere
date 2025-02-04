import React, { useEffect } from "react";
import { auth, signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Button, Container, Card } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import "../styles/Login.css"; // Import custom styles

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
  }, [navigate]);

  return (
    <Container className="login-container">
      <Card className="login-card">
        <Card.Body className="text-center">
          <h2 className="mb-3">📌 Welcome to NoteSphere</h2>
          <p className="mb-4">Organize your thoughts effortlessly</p>
          <Button variant="light" className="google-btn" onClick={signInWithGoogle}>
            <FcGoogle size={22} /> Sign in with Google
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
