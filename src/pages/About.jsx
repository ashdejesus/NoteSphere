import React, { useState, useEffect } from "react";
import { auth, logOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Backdrop,
  Fade,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Add as AddIcon,
  TaskAlt as TaskIcon,
  PrivacyTip as PrivacyIcon,
  GitHub as GitHubIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import logo from "/images/PNG.png"; 

const teamMembers = [
  {
    name: "Nichoe De Jesus",
    position: "Backend Developer",
    image: "images/dejesus.jpg",
    description:
      "Ash is a dedicated backend developer who makes sure everything runs smoothly behind the scenes. He handles authentication, database management, and real-time updates using Firebase.",
    github: "https://github.com/ashdejesus",
  },
  {
    name: "Czernycrille Abellera",
    position: "Frontend Developer",
    image: "/images/Abellera.jpg",
    description:
      "Czernycrille is our frontend developer who builds the look and feel of our app. She focuses on making the interface user-friendly and responsive.",
    github: "https://github.com/aiccrg",
  },
  {
    name: "Jesryl Capales",
    position: "UI/UX Designer",
    image: "/images/Capales.jpg",
    description:
      "Jes specializes in designing intuitive user interfaces and focuses on enhancing usability and aesthetics.",
    github: "https://github.com/jes-art",
  },
];

function About() {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (member) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  return (
    <>
     {/* Navbar */}
<AppBar position="static" color="default">
  <Toolbar>
    <Grid container alignItems="center">
      <Grid item xs={4}>
        <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      </Grid>
      <Grid item xs={4} container justifyContent="center">
        <img
          src={logo}
          alt="NoteSphere Logo"
          style={{ height: '40px', cursor: 'pointer' }}
          onClick={() => navigate("/dashboard")}
        />
      </Grid>
      <Grid item xs={4} container justifyContent="flex-end">
        {user && (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
              <Avatar src={user.photoURL || "/path-to-default-avatar.jpg"} sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleMenuClose}>{user.displayName || "Profile"}</MenuItem>
              <MenuItem onClick={logOut} sx={{ color: "red" }}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Grid>
    </Grid>
  </Toolbar>
</AppBar>


      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250, p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {user && (
            <Avatar src={user.photoURL || "/path-to-default-avatar.jpg"} sx={{ bgcolor: "primary.main", width: 56, height: 56, mb: 1 }}>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </Avatar>
          )}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {user ? user.displayName : "Guest"}
          </Typography>
          <Divider sx={{ width: "100%", mb: 2 }} />
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
          A modern, minimalist note-taking app designed to help you <strong>capture, organize,</strong> and <strong>access</strong> your thoughts effortlessly. In today’s fast-paced world, we believe that staying organized should be simple, distraction-free, and efficient.
        </Typography>
      </Container>

      <Container sx={{ mt: 6, textAlign: "center", maxWidth: "lg" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <PeopleIcon sx={{ mr: 1 }} /> Meet the Team
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", mt: 4, gap: 4 }}>
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              sx={{ maxWidth: 300, textAlign: "center", borderRadius: 3, cursor: "pointer", transition: "0.3s", "&:hover": { boxShadow: 6 } }}
              onClick={() => handleOpenModal(member)}
            >
              <CardMedia>
                <Avatar src={member.image} sx={{ width: 120, height: 120, margin: "auto", mt: 2 }} />
              </CardMedia>
              <CardContent>
                <Typography variant="h6">{member.name}</Typography>
                <Typography variant="body2" color="textSecondary">{member.position}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Our Mission */}
      <Container sx={{ mt: 4, fontFamily: "'Space Mono', monospace" }}>
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          <TaskIcon sx={{ mr: 1 }} /> Our Mission
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          At <strong>NoteSphere</strong>, we are committed to making note-taking as seamless as
          possible. Whether you're a student managing assignments, a professional keeping track
          of tasks, or someone who simply loves to jot down ideas, our platform is designed to
          <strong> enhance productivity</strong> while maintaining a clean, distraction-free
          environment.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We believe that the best tools are the ones that stay out of your way and just work.
          That’s why NoteSphere is <strong>lightweight, responsive, and easy to use</strong>,
          ensuring that you can focus on what truly matters—your thoughts.
        </Typography>
        <Typography variant="h5" sx={{ mt: 4, display: "flex", alignItems: "center" }}>
          <PrivacyIcon sx={{ mr: 1 }} /> Privacy & Safety
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We understand that your notes may contain personal, sensitive, or important information.
          That’s why we take <strong>security and privacy</strong> seriously.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your data is stored securely using <strong>Firebase Firestore</strong>, ensuring
          that only you have access to your notes. Unlike many other platforms,
          we <strong>do not</strong> sell or share your data with third parties.
          Your information belongs to you, and we’re committed to keeping it that way.
        </Typography>
      </Container>

      {/* Modal for Team Member Details */}
      <Modal
        open={Boolean(selectedMember)}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        sx={{ transition: 'opacity 0.5s ease-in-out' }} // Added transition style
      >
        <Fade in={Boolean(selectedMember)} timeout={{ enter: 500, exit: 500 }}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            transition: 'opacity 0.5s ease-in-out' // Added transition style
          }}>
            {selectedMember && (
              <>
                <Avatar src={selectedMember.image} sx={{ width: 100, height: 100, margin: "auto", mb: 2 }} />
                <Typography variant="h5">{selectedMember.name}</Typography>
                <Typography variant="body1" color="textSecondary">{selectedMember.position}</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>{selectedMember.description}</Typography>
                <Typography sx={{ mt: 2 }}>
                  <GitHubIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  <Link href={selectedMember.github} target="_blank" rel="noopener noreferrer">
                    {selectedMember.github}
                  </Link>
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default About;