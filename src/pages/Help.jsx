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
  Container,
  Drawer,
  List,
  ListItem,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
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
import logo from "/images/PNG.png"; 

function Help() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
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
      {/* Help Content */}
      <Container sx={{ mt: 4, textAlign: "center", fontFamily: "'Space Mono', monospace" }}>
        <Typography variant="h4">Need Help?</Typography>
        <Typography variant="body1" sx={{ mt: 2,}}>
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
