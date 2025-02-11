import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Add as AddIcon,
  TaskAlt as TaskIcon,
  PrivacyTip as PrivacyIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { auth, logOut } from "../firebase";

function About() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            NoteSphere
          </Typography>
          {auth.currentUser && (
            <Button color="error" startIcon={<LogoutIcon />} onClick={logOut}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/add-note")}>
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary="Add Note" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/about")}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/help")}>
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText primary="Help" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* About Content */}
      <Container sx={{ mt: 4, textAlign: "center", fontFamily: "'Space Mono', monospace" }}>
        <Typography variant="h4">Welcome to NoteSphere!</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          A modern, minimalist note-taking app designed to help you <strong>capture, organize,</strong> and <strong>access</strong> your
          thoughts effortlessly. In today’s fast-paced world, we believe that staying organized should be simple, distraction-free, and efficient.
        </Typography>
      </Container>

      <Container sx={{ mt: 4, fontFamily: "'Space Mono', monospace" }}>
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          <TaskIcon sx={{ mr: 1 }} /> Our Mission
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          At <strong>NoteSphere</strong>, we are committed to making note-taking as seamless as possible. Whether you're a student managing assignments, a professional keeping track of tasks, or someone who simply loves to jot down ideas, our platform is designed to <strong>enhance productivity</strong> while maintaining a clean, distraction-free environment.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We believe that the best tools are the ones that stay out of your way and just work. That’s why NoteSphere is <strong>lightweight, responsive, and easy to use</strong>, ensuring that you can focus on what truly matters—your thoughts.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, display: "flex", alignItems: "center" }}>
          <PrivacyIcon sx={{ mr: 1 }} /> Privacy & Safety
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We understand that your notes may contain personal, sensitive, or important information. That’s why we take <strong>security and privacy</strong> seriously.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your data is stored securely using <strong>Firebase Firestore</strong>, ensuring that only you have access to your notes. Unlike many other platforms, we <strong>do not</strong> sell or share your data with third parties. Your information belongs to you, and we’re committed to keeping it that way.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, display: "flex", alignItems: "center" }}>
          <EmailIcon sx={{ mr: 1 }} /> Contact & Feedback
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We’d love to hear your feedback! If you have any suggestions, issues, or feature requests, feel free to reach out:
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <GitHubIcon sx={{ mr: 1 }} /> GitHub:
          <Link href="https://github.com/aiccrg" target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
            github.com/aiccrg
          </Link>
          <span style={{ margin: "0 8px" }}>|</span>
          <Link href="https://github.com/ashdejesus" target="_blank" rel="noopener noreferrer">
            github.com/ashdejesus
          </Link>
        </Typography>
      </Container>
    </>
  );
}

export default About;
