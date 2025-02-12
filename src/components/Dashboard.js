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
  InputAdornment,
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
  Menu,
  MenuItem,
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

  const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

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
      const pinnedAt = updatedPinnedStatus ? Date.now() : null; // If pinned, set timestamp
  
      await updateNote(noteId, { pinned: updatedPinnedStatus, pinnedAt });
  
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((note) =>
          note.id === noteId ? { ...note, pinned: updatedPinnedStatus, pinnedAt } : note
        );
  
        return updatedNotes.sort((a, b) => {
          if (b.pinned !== a.pinned) return Number(b.pinned) - Number(a.pinned); // Pinned first
          if (b.pinned && a.pinned) return (b.pinnedAt || 0) - (a.pinnedAt || 0); // Among pinned, newest first
          return (b.createdAt || 0) - (a.createdAt || 0); // Among unpinned, newest first
        });
      });
  
      setShowDialog(false); // Close the dialog after pinning/unpinning
    } catch (error) {
      console.error("Error updating pin status:", error);
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
  <>
    <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
    <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
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
  {[...filteredNotes] // Create a shallow copy to prevent modifying the original array
    .sort((a, b) => {
      if (b.pinned !== a.pinned) return Number(b.pinned) - Number(a.pinned); // Pinned first
      if (b.pinned && a.pinned) return (b.pinnedAt || 0) - (a.pinnedAt || 0); // Among pinned, newest first
      return (b.createdAt || 0) - (a.createdAt || 0); // Among unpinned, newest first
    })
    .map((note) => (
      <Card
        key={note.id}
        sx={{
          transition: "0.3s",
          "&:hover": { transform: "scale(1.05)" },
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => handleEditClick(note)} // Open edit dialog
      >
        {/* Show Pin Icon for Pinned Notes */}
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
      </Card>
    ))}
</Masonry>

        )}
      </Box>
      </Container>

      {/* Edit Note Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth maxWidth="sm">
  <DialogTitle>Edit Note</DialogTitle>
  <DialogContent>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      
      {/* Seamless Editable Title */}
      <Box
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setCurrentNote({ ...currentNote, title: e.target.innerText })}
        sx={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          outline: "none",
          padding: "8px",
          borderBottom: "1px solid #ddd",
        }}
      >
        {currentNote.title}
      </Box>

      {/* Seamless Editable Description */}
      <Box
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setCurrentNote({ ...currentNote, description: e.target.innerText })}
        sx={{
          fontSize: "1rem",
          minHeight: "100px",
          maxHeight: "200px",
          overflowY: "auto",
          outline: "none",
          padding: "8px",
        }}
      >
        {currentNote.description}
      </Box>
    </Box>

    {/* Pin & Delete Buttons - Aligned to Left */}
    <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
  {/* Pin Button */}
  <IconButton
  color={currentNote.pinned ? "primary" : "default"}
  onClick={async () => {
    try {
      await handleTogglePinNote(currentNote.id, currentNote.pinned); // Toggle pin state in Firebase
      setShowDialog(false); // Close dialog after updating
    } catch (error) {
      console.error("Error pinning note:", error);
    }
  }}
>
  <PinIcon />
</IconButton>


  {/* Delete Button */}
  <IconButton
    color="error"
    onClick={async (e) => {
      e.stopPropagation(); // Prevent dialog from closing
      await deleteNote(currentNote.id);
      setShowDialog(false); // Only close the dialog on delete
    }}
  >
    <DeleteIcon />
  </IconButton>
</Box>

  </DialogContent>

  <DialogActions>
    <Button onClick={() => setShowDialog(false)}>Cancel</Button>
    <Button onClick={() => handleUpdateNote(currentNote)} color="primary">
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