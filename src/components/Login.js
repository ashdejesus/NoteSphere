import React, { useState, useEffect } from "react";
import { auth, signInWithGoogle } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged 
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Card, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress 
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh"
      }}
    >
      <Card elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Welcome to NoteSphere!
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Organize your thoughts effortlessly
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : (isRegister ? "Register" : "Login")}
          </Button>
        </form>

        <Button 
          variant="outlined" 
          fullWidth 
          sx={{ mt: 2, textTransform: "none" }} 
          onClick={signInWithGoogle}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <span 
              onClick={() => setIsRegister(!isRegister)}
              style={{ cursor: "pointer", color: "#1976d2", marginLeft: "5px" }}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}

export default Login;
