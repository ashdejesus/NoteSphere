import React, { useState, useEffect } from "react"; 
import { auth, logOut, listenToNotes, deleteNote, updateNote } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { FaSignOutAlt, FaTrash, FaPlus, FaHome, FaInfoCircle, FaEdit, FaQuestionCircle } from "react-icons/fa";
import "../styles/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", description: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        setUser(user);
        listenToNotes(setNotes).then((unsubscribeNotes) => {
          return () => unsubscribeNotes && unsubscribeNotes();
        });
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [navigate]);

  const handleEditClick = (note) => {
    setCurrentNote(note);
    setShowModal(true);
  };

  const handleUpdateNote = async () => {
    if (currentNote.id) {
      await updateNote(currentNote.id, {
        title: currentNote.title,
        description: currentNote.description,
      });
      setShowModal(false);
    }
  };

  return (
    <>
      <Navbar bg="white" variant="white" expand="lg" className="navbar-custom">
  <Container>
    <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
      NoteSphere
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link onClick={() => navigate("/dashboard")}>
          <FaHome /> Dashboard
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/add-note")}>
          <FaPlus /> Add Note
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/about")}>
          <FaInfoCircle /> About
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/help")}>
          <FaQuestionCircle /> Help
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


      <Container className="mt-4 dashboard-content">
        <h2 className="text-center">NoteSphere</h2>

        {user && <div className="d-flex justify-content-between align-items-center mt-3"><span>Welcome, {user.displayName}</span></div>}

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
                <Card className="note-card">
                  <Card.Body>
                    <Card.Title>{note.title.slice(0, 30)}...</Card.Title>
                    <Card.Text>{note.description.slice(0, 60)}...</Card.Text>
                    <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditClick(note)}>
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => deleteNote(note.id)}>
                      <FaTrash />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* Edit Note Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentNote.description}
                onChange={(e) => setCurrentNote({ ...currentNote, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateNote}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dashboard;
