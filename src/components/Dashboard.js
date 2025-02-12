import React, { useState, useEffect } from "react";
import { auth, logOut, listenToNotes, deleteNote, updateNote, togglePinNote } from "../firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Avatar from "@mui/material/Avatar";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Skeleton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  PushPin as PinIcon, 
} from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isTabletScreen = useMediaQuery("(max-width:900px)");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        setUser(user);
        listenToNotes(setNotes).then((unsubscribeNotes) => {
          setTimeout(() => setLoading(false), 1500);
          return () => unsubscribeNotes && unsubscribeNotes();
        });
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lowerQuery) ||
            note.description.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [searchQuery, notes]);

  const handleEditClick = (note) => {
    setCurrentNote(note);
    setShowDialog(true);
  };

  const handleUpdateNote = async () => {
    if (currentNote.id) {
      await updateNote(currentNote.id, {
        title: currentNote.title,
        description: currentNote.description,
      });
      setShowDialog(false);
      setSnackbar({ open: true, message: "Note updated successfully!", severity: "success" });
    }
  };

  const handleTogglePinNote = async (noteId, isPinned) => {
    await togglePinNote(noteId, !isPinned);
    setSnackbar({
      open: true,
      message: isPinned ? "Note unpinned successfully!" : "Note pinned successfully!",
      severity: "success",
    });
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
      <List sx={{ width: 250, p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
  {user && (
    <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mb: 1 }}>
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

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center">
          NoteSphere
        </Typography>

        {user && (
          <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
            Welcome, {user.displayName}
          </Typography>
        )}

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mt: 3 }}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />

        {/* Notes List with Masonry Layout */}
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Masonry columns={isSmallScreen ? 1 : isTabletScreen ? 2 : 3} spacing={2}>
            {Array.from(new Array(6)).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={120} animation="wave" />
            ))}
          </Masonry>
        ) : filteredNotes.length === 0 ? (
          <Box textAlign="center" sx={{ mt: 5 }}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              No notes available.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click the 'Add Note' button to start creating notes.
            </Typography>
          </Box>
        ) : (
          <Masonry columns={isSmallScreen ? 1 : isTabletScreen ? 2 : 3} spacing={2}>
              {/* try sotring it  */}
            {filteredNotes.sort((a, b) => (b.pinned ? 1 : -1)).map((note) => ( 
              <Card key={note.id} sx={{ transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}>
                <CardContent>
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography variant="body2">{note.description}</Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item>
                      <IconButton color="warning" onClick={() => handleEditClick(note)}>
                        <EditIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton color="error" onClick={() => deleteNote(note.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                      <Grid item>
                        <IconButton
                          color={note.pinned ? "primary" : "default"}
                          onClick={() => handleTogglePinNote(note.id, note.pinned)}
                        >
                          <PinIcon />
                        </IconButton>
                      </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Masonry>
        )}
      </Box>
      </Container>

      {/* Edit Note Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={currentNote.description}
            onChange={(e) => setCurrentNote({ ...currentNote, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateNote} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          sx={{ width: "300px", textAlign: "center" }} 
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Dashboard;