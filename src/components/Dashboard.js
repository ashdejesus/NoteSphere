import React, { useState, useEffect } from "react";
import { auth, logOut, addNote, listenToNotes, deleteNote } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, Card, Row, Col } from "react-bootstrap";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState(""); // State for the note title
  const [description, setDescription] = useState(""); // State for the note description
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/");
      else setUser(user);
    });

    const unsubscribeNotes = listenToNotes(setNotes);

    return () => {
      unsubscribeAuth();
      unsubscribeNotes();
    };
  }, [navigate]);

  const handleAddNote = async () => {
    if (title.trim() && description.trim()) {
      await addNote(title, description, user);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">📌 NoteSphere Dashboard</h2>

      {user && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>Welcome, {user.displayName}</span>
          <Button variant="outline-danger" onClick={logOut}>
            <FaSignOutAlt /> Logout
          </Button>
        </div>
      )}

      {/* Add Note Form with Title and Description */}
      <Form className="mt-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter note description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" className="mt-2" onClick={handleAddNote}>
          Add Note
        </Button>
      </Form>

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
                  <Card.Title>{note.title.slice(0, 30)}...</Card.Title> {/* Preview of Title */}
                  <Card.Text>{note.description.slice(0, 60)}...</Card.Text> {/* Preview of Description */}
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
  );
}

export default Dashboard;
