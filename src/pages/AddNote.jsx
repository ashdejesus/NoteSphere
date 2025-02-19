import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addNote, updateNote, auth } from "../firebase"; // Import `updateNote`
import { onAuthStateChanged } from "firebase/auth";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Container,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { Menu as MenuIcon, Save as SaveIcon } from "@mui/icons-material";

function AddNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); // 🔹 Track animation state
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

  const handleSaveNote = async () => {
    if (!user) return;

    try {
      if (noteId) {
        await updateNote(noteId, { title, content });
      } else {
        const newNoteId = await addNote(title, content, user);
        setNoteId(newNoteId);
      }

      setOpenSnackbar(true);
      setFadeOut(true); // 🔹 Trigger fade-out animation

      // 🔹 Redirect after animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            NoteSphere
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Note Input with Animation */}
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          transition: "opacity 1s ease, transform 1s ease", // 🔹 Smooth animation
          opacity: fadeOut ? 0 : 1, // 🔹 Fade effect
          transform: fadeOut ? "translateY(-20px)" : "translateY(0)", // 🔹 Move up effect
        }}
      >
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: "100px" }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              fontSize: "1.5rem",
              fontWeight: "bold",
              border: "none",
              outline: "none",
              padding: "10px 0",
              backgroundColor: "transparent",
            }}
          />
          <textarea
            placeholder="Take a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              minHeight: "80px",
              fontSize: "1rem",
              border: "none",
              outline: "none",
              resize: "none",
              padding: "10px 0",
              backgroundColor: "transparent",
            }}
          />
          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveNote}
            sx={{ mt: 2 }}
          >
            Save Note
          </Button>
        </Paper>
      </Container>

      {/* Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ width: "300px", textAlign: "center" }}>
          Note saved!
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddNote;
