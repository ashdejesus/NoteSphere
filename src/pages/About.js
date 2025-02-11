import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, logOut } from "../firebase"; // Import logout function
import { FaHome, FaPlus, FaSignOutAlt, FaInfoCircle, FaGithub, FaQuestionCircle } from "react-icons/fa";
import { MdTaskAlt, MdOutlinePrivacyTip, MdOutlineMarkEmailRead } from "react-icons/md";

function About() {
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <Navbar bg="white" variant="white" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
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

      {/* About Content */}
      <Container
        className="mt-4 text-center"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        <h2>Welcome to NoteSphere!</h2>
        <p>
          A modern, minimalist note-taking app designed to help you{" "}
          <strong>capture, organize,</strong> and <strong>access</strong> your
          thoughts effortlessly. In today’s fast-paced world, we believe that
          staying organized should be simple, distraction-free, and efficient.
          Our goal is to provide you with an intuitive space where your ideas
          can flow freely, without unnecessary clutter or complexity.
        </p>
      </Container>

      <Container
        className="mt-4 text-start"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        <h4>
          <MdTaskAlt /> Our Mission
        </h4>
        <p>
          At NoteSphere, we are committed to making note-taking as seamless as
          possible. Whether you're a student managing assignments, a professional
          keeping track of tasks, or someone who simply loves to jot down ideas,
          our platform is designed to <strong>enhance productivity</strong> while
          maintaining a clean, distraction-free environment.
          <br />
          We believe that the best tools are the ones that stay out of your way
          and just work. That’s why NoteSphere is{" "}
          <strong>lightweight, responsive, and easy to use</strong>, ensuring that
          you can focus on what truly matters—your thoughts.
        </p>

        <h4>
          <MdOutlinePrivacyTip /> Privacy & Safety
        </h4>
        <p>
          We understand that your notes may contain personal, sensitive, or
          important information. That’s why we take <strong>security and privacy</strong> seriously.
          Your data is stored securely using <strong>Firebase Firestore</strong>, ensuring that
          only you have access to your notes. Unlike many other platforms, we{" "}
          <strong>do not</strong> sell or share your data with third parties. Your
          information belongs to you, and we’re committed to keeping it that way.
        </p>

        <h4>
          <MdOutlineMarkEmailRead /> Contact & Feedback
        </h4>
        <p>
          We’d love to hear your feedback! If you have any suggestions, issues, or
          feature requests, feel free to reach out:
        </p>

        <p>
          <FaGithub /> GitHub:{" "}
          <a
            href="https://github.com/aiccrg"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/aiccrg
          </a>{" "}
          |{" "}
          <a
            href="https://github.com/ashdejesus"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/ashdejesus
          </a>
        </p>
      </Container>
    </>
  );
}

export default About;
