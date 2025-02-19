import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
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
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PushPin as PushPinIcon,
  QuestionAnswer as FAQIcon,
} from "@mui/icons-material";

function Help() {
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

      {/* Help Content */}
      <Container sx={{ mt: 4, textAlign: "center", fontFamily: "'Space Mono', monospace" }}>
        <Typography variant="h4">Need Help?</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Welcome to the Help Center! Here you will find information on how to use <strong>NoteSphere</strong> efficiently.
          If you need additional assistance, feel free to reach out.
        </Typography>
      </Container>

      <Container sx={{ mt: 4, fontFamily: "'Space Mono', monospace" }}>
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          <PushPinIcon sx={{ mr: 1 }} /> How to Use NoteSphere
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>1. Adding a Note:</strong> Click on <AddIcon fontSize="small" /> "Add Note" in the navigation bar to create a new note.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>2. Editing a Note:</strong> On your <HomeIcon fontSize="small" /> Dashboard, click the <EditIcon fontSize="small" /> edit icon on any note to modify it.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>3. Deleting a Note:</strong> Use the <DeleteIcon fontSize="small" /> delete icon to remove unwanted notes.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>4. Logging Out:</strong> Click on the <LogoutIcon fontSize="small" /> Logout button in the navigation bar to sign out.
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, display: "flex", alignItems: "center" }}>
          <FAQIcon sx={{ mr: 1 }} /> FAQ
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Q: Are my notes saved automatically?</strong>
        </Typography>
        <Typography variant="body2">A: Yes! Notes are stored securely in Firebase Firestore.</Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Q: Can I access my notes from multiple devices?</strong>
        </Typography>
        <Typography variant="body2">
          A: Absolutely! Just log in with the same account, and your notes will sync across all devices.
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Q: Who can see my notes?</strong>
        </Typography>
        <Typography variant="body2">
          A: Only you! Your notes are private and accessible only through your account.
        </Typography>
      </Container>
    </>
  );
}

export default Help;
