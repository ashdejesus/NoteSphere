import React, { useState, useEffect } from "react";
import { auth, logOut, listenToNotes, deleteNote } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container, Card, Row, Col } from "react-bootstrap";
import { FaSignOutAlt, FaTrash, FaPlus, FaHome } from "react-icons/fa";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/"); // Redirect to login if user is not authenticated
      else setUser(user);
    });

    const unsubscribeNotes = listenToNotes(setNotes); // Listen for real-time note updates

    return () => {
      unsubscribeAuth();
      unsubscribeNotes();
    };
  }, [navigate]);

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand style={{ cursor: 'pointer' }}>📌 NoteSphere</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/dashboard")}>
                <FaHome /> Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/add-note")}>
                <FaPlus /> Add Note
              </Nav.Link>
            </Nav>
            {user && (
              <Button variant="outline-danger" onClick={logOut}>
                <FaSignOutAlt /> Logout
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Dashboard Content */}
      <Container className="mt-4">
        <h2 className="text-center">📌 NoteSphere Dashboard</h2>

        {user && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>Welcome, {user.displayName}</span>
          </div>
        )}

        {/* Cards to Display Notes */}
        <Row className="mt-3">
          {notes.length === 0 ? (
            <Col>
              <Card className="text-center">
                <Card.Body>No notes available.</Card.Body>
              </Card>
            </Col>
          ) : (
            notes.map((note) => (
              <Col key={note.id} sm={12} md={6} lg={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{note.title.slice(0, 30)}...</Card.Title>
                    <Card.Text>{note.description.slice(0, 60)}...</Card.Text>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <FaTrash />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
