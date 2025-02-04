import React, { useState, useEffect } from "react";
import { auth, logOut, addNote, listenToNotes, deleteNote } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, ListGroup } from "react-bootstrap";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [note, setNote] = useState("");
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
    if (note.trim()) {
      await addNote(note, user);
      setNote("");
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

      <Form className="mt-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter your note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" className="mt-2" onClick={handleAddNote}>Add Note</Button>
      </Form>

      <ListGroup className="mt-3">
        {notes.map((note) => (
          <ListGroup.Item key={note.id} className="d-flex justify-content-between align-items-center">
            {note.text}
            <Button variant="outline-danger" size="sm" onClick={() => deleteNote(note.id)}>
              <FaTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default Dashboard;
