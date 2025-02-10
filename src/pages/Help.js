import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, logOut } from "../firebase"; // Import logout function
import { FaHome, FaPlus, FaSignOutAlt, FaInfoCircle, FaQuestionCircle, FaEdit, FaTrash } from "react-icons/fa";
import { BsPinAngle } from "react-icons/bs";
import { LuMessageCircleQuestion } from "react-icons/lu";



function Help() {
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" style={{ fontFamily: "'Space Mono', monospace", position: "sticky", top: 0, zIndex: 1000 }}>
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

            <Button variant="outline-danger" onClick={logOut}>
              <FaSignOutAlt /> Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4 text-center" style={{ fontFamily: "'Space Mono', monospace" }}>
        <h2>Need Help?</h2>
        <p>
          Welcome to the Help Center! Here you will find information on how to use <strong>NoteSphere</strong> efficiently.
          If you need additional assistance, feel free to reach out.
        </p>
      </Container>

      <Container className="mt-4 text-start" style={{ fontFamily: "'Space Mono', monospace" }}>
        <h4><BsPinAngle /> How to Use NoteSphere</h4>
        <p>
          <strong>1. Adding a Note:</strong> Click on <FaPlus /> "Add Note" in the navigation bar to create a new note.
        </p>
        <p>
          <strong>2. Editing a Note:</strong> On your <FaHome /> Dashboard, click the <FaEdit/> edit icon on any note to modify it.
        </p>
        <p>
          <strong>3. Deleting a Note:</strong> Use the <FaTrash /> delete icon to remove unwanted notes.
        </p>
        <p>
          <strong>4. Logging Out:</strong> Click on the <FaSignOutAlt /> Logout button in the navigation bar to sign out.
        </p>

        <h4><LuMessageCircleQuestion /> FAQ</h4>
        <p><strong>Q: Are my notes saved automatically?</strong></p>
        <p>A: Yes! Notes are stored securely in Firebase Firestore.</p>

        <p><strong>Q: Can I access my notes from multiple devices?</strong></p>
        <p>A: Absolutely! Just log in with the same account, and your notes will sync across all devices.</p>

        <p><strong>Q: Who can see my notes?</strong></p>
        <p>A: Only you! Your notes are private and accessible only through your account.</p>
      </Container>
    </>
  );
}

export default Help;
