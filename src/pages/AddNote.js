import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addNote, logOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Container,
  TextField,
  Button,
  Grid
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Logout as LogoutIcon, 
  Home as HomeIcon, 
  NoteAdd as NoteAddIcon 
} from "@mui/icons-material";

function AddNote() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect if not logged in
      } else {
        setUser(user);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleAddNote = async () => {
    if (title.trim() && description.trim() && user) {
      try {
        await addNote(title, description, user);
        navigate("/dashboard"); // Redirect after adding
      } catch (error) {
        console.error("Error adding note:", error);
      }
    } else {
      console.error("Please fill in both title and description.");
    }
  };

  return (
    <>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#ffffff" }}>
        <Toolbar>
          <IconButton edge="start" color="000000" onClick={() => setOpenSidebar(!openSidebar)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Space Mono', monospace" }}>
            NoteSphere
          </Typography>
          {user && (
            <IconButton color="000000" onClick={logOut}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer
        variant="temporary"
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        sx={{ "& .MuiDrawer-paper": { width: 250 } }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/add-note")}>
              <ListItemIcon><NoteAddIcon /></ListItemIcon>
              <ListItemText primary="Add Note" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ mt: 8, ml: openSidebar ? 30 : 0, transition: "margin 0.3s" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" sx={{ mt: 4, mb: 3 }}>
            Add a New Note
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={5}
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleAddNote}
              >
                Add Note
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default AddNote;
