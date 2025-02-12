import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addNote, auth, logOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Container,
  TextField,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
} from "@mui/icons-material";

function AddNote() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
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
        setOpenSnackbar(true);
        setTitle("");
        setDescription("");
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

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
          {user && (
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

      {/* Add Note Form */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Add a New Note
        </Typography>

        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={5}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleAddNote}>
          Add Note
        </Button>
      </Container>

      {/* Snackbar Notification */}
<Snackbar 
  open={openSnackbar} 
  autoHideDuration={3000} 
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Ensures proper placement
>
  <Alert 
    severity="success" 
    onClose={() => setOpenSnackbar(false)} 
    sx={{ width: "300px", textAlign: "center" }} // Fixes the width
  >
    Note added successfully!
  </Alert>
</Snackbar>

    </>
  );
}

export default AddNote;
