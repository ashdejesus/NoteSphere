import React, { useState, useEffect } from "react";
import { auth, logOut, listenToNotes, deleteNote } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, CssBaseline, Box, Container, Grid, Card, CardContent 
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon, Home as HomeIcon, NoteAdd as NoteAddIcon, Delete as DeleteIcon } from "@mui/icons-material";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect if no user
      } else {
        setUser(user);
        listenToNotes(setNotes).then((unsubscribeNotes) => {
          return () => unsubscribeNotes && unsubscribeNotes();
        });
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [navigate]);

  return (
    <>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#FFFFFF" }}>
        <Toolbar>
          {/* Sidebar Toggle Button */}
          <IconButton edge="start" color="000000" onClick={() => setOpenSidebar(!openSidebar)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color:"#000000" , flexGrow: 1, fontFamily: "'Space Mono', monospace" }}>
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
        <Container>
          <Typography variant="h4" align="center">
            NoteSphere
          </Typography>

          {user && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Welcome, {user.displayName}
            </Typography>
          )}

          {/* Notes Display */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {notes.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography align="center">No notes available.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              notes.map((note) => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                  <Card sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{note.title.slice(0, 30)}...</Typography>
                      <Typography variant="body2">{note.description.slice(0, 60)}...</Typography>
                    </CardContent>
                    <IconButton color="error" onClick={() => deleteNote(note.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Dashboard;
