import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNote, logOut} from '../firebase'; // Import the addNote function from firestore.js
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'; // Assuming you are using Firebase auth
import { Button, Container, Form, Navbar, Nav } from 'react-bootstrap'; // Import Bootstrap components
import { FaSignOutAlt, FaPlus, FaHome } from "react-icons/fa";

function AddNote() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // If user is not authenticated, redirect to login page
      } else {
        setUser(user);
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  const handleAddNote = async () => {
    if (title.trim() && description.trim() && user) {
      try {
        // Add the note
        await addNote(title, description, user);

        // After successful addition, navigate back to the dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Error adding note:", error);
      }
    } else {
      console.error("Please fill in both title and description.");
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="green" variant="green" expand="lg" style={{ fontFamily: "'Space Mono', monospace" }} >
        <Container>
          <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate("/dashboard")} >
            NoteSphere
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"   >
              <Nav.Link onClick={() => navigate("/dashboard")} >
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

      {/* Add Note Form */}
      <Container className="mt-4" style={{ maxWidth: '600px', fontFamily: "'Space Mono', monospace" }}>
        <h2 className="text-center mb-4">Add a New Note</h2>

        <Form>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the title of your note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter the description of your note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="mt-3 w-100"
            onClick={handleAddNote}
          >
            Add Note
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default AddNote;
