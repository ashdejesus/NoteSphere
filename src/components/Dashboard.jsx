import React, { useState, useEffect } from "react";
import { auth, logOut, listenToNotes, deleteNote, updateNote, addNote } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
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
  CardContent,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Skeleton,
  useMediaQuery,
  Grow,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PushPin as PinIcon,
} from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";
import logo from "/images/PNG.png"; // Import your logo
function Dashboard() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", description: "", createdAt: "", updatedAt: "" });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogTransition, setDialogTransition] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isTabletScreen = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

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

  const handleEditClick = (note, event) => {
    setCurrentNote(note);
    const rect = event.currentTarget.getBoundingClientRect();
    setDialogTransition(() => (props) => (
      <Grow {...props} style={{ transformOrigin: `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px` }} />
    ));
    setShowDialog(true);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const handleTogglePinNote = async (noteId, currentPinnedStatus) => {
    try {
      const updatedPinnedStatus = !currentPinnedStatus;
      const pinnedAt = updatedPinnedStatus ? Date.now() : null;
  
      await updateNote(noteId, {
        pinned: updatedPinnedStatus,
        pinnedAt,
      });
  
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, pinned: updatedPinnedStatus, pinnedAt } : note
        )
      );
    } catch (error) {
      console.error("Failed to toggle pin status", error);
    }
  };

  const handleSaveNewNote = async () => {
    if (currentNote.title && currentNote.description) {
      await addNote(currentNote.title, currentNote.description);
      setShowDialog(false);
      setSnackbar({ open: true, message: "Note added successfully!", severity: "success" });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <>
   {/* Navbar */}
<AppBar position="static" color="default">
  <Toolbar>
    <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
      <MenuIcon />
    </IconButton>
    <img
      src={logo}
      alt="NoteSphere Logo"
      style={{ height: '40px', cursor: 'pointer' }}
      onClick={() => navigate("/dashboard")}
    />
    <div style={{ flexGrow: 1 }}></div> {/* This div pushes the Avatar to the right */}
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

    {/* Main Content */}
<Container sx={{ mt: 4 }}>
  <Typography variant="h4" align="center">
    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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
          sx={{
            mt: 3,
            borderRadius: "25px",
            backgroundColor: "#f5f5f5",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#ebebeb",
              },
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
                borderColor: "primary.main",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ),
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
              {[...filteredNotes]
                .sort((a, b) => {
                  if (b.pinned !== a.pinned) return Number(b.pinned) - Number(a.pinned);
                  if (b.pinned && a.pinned) return (b.pinnedAt || 0) - (a.pinnedAt || 0);
                  return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0);
                })
                .map((note) => (
                  <Box
                    key={note.id}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "#fff",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
                      transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
                      },
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={(event) => handleEditClick(note, event)}
                  >
                    {note.pinned && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          bgcolor: "rgba(255,255,255,0.8)",
                          borderRadius: "50%",
                          p: 0.5,
                        }}
                      >
                        <PinIcon color="primary" />
                      </Box>
                    )}
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "text.primary", mb: 1 }}>
                        {note.title}
                      </Typography>
                      <Box
                        sx={{
                          maxHeight: 100,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "text.secondary" }}>
                          {note.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Box>
                ))}
            </Masonry>
          )}
        </Box>
      </Container>

      {/* Edit Note Dialog */}
<Dialog
  open={showDialog}
  onClose={() => setShowDialog(false)}
  fullWidth
  maxWidth="sm"
  TransitionComponent={dialogTransition}
  transitionDuration={500}
  PaperProps={{
    sx: {
      borderRadius: 2,
      boxShadow: 3,
      padding: 2,
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'monospace' }}>
    {currentNote.id ? "Edit Note" : "Add Note"}
  </DialogTitle>
  <DialogContent>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Title"
        value={currentNote.title}
        onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
        fullWidth
        margin="normal"
        variant="outlined"
        sx={{ borderRadius: 1, fontFamily: 'monospace' }}
      />
      <TextField
        label="Description"
        value={currentNote.description}
        onChange={(e) => setCurrentNote({ ...currentNote, description: e.target.value })}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        variant="outlined"
        sx={{ borderRadius: 1 }}
      />
      {currentNote.createdAt && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Created At: {formatDate(currentNote.createdAt)}
        </Typography>
      )}
      {currentNote.updatedAt && (
        <Typography variant="body2" color="textSecondary">
          Last Updated: {formatDate(currentNote.updatedAt)}
        </Typography>
      )}
    </Box>
    <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
      {currentNote.id && (
        <IconButton
          color={currentNote.pinned ? "primary" : "default"}
          onClick={async () => {
            try {
              await handleTogglePinNote(currentNote.id, currentNote.pinned);
              setShowDialog(false);
            } catch (error) {
              console.error("Error pinning note:", error);
            }
          }}
        >
          <PinIcon />
        </IconButton>
      )}
      {currentNote.id && (
        <IconButton
          color="error"
          onClick={async (e) => {
            e.stopPropagation();
            await deleteNote(currentNote.id);
            setShowDialog(false);
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowDialog(false)}>Cancel</Button>
    <Button onClick={currentNote.id ? handleUpdateNote : handleSaveNewNote} color="primary">
      {currentNote.id ? "Save Changes" : "Add Note"}
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