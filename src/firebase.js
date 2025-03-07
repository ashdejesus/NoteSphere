import { initializeApp } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, updateDoc, collection, addDoc, query, where, 
  onSnapshot, deleteDoc, doc ,serverTimestamp 
} from "firebase/firestore";

// 🔐 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoEFuM-AIvhzaATKC0eHM8HUBlDErrdr4",
  authDomain: "notesphere-ff819.firebaseapp.com",
  projectId: "notesphere-ff819",
  storageBucket: "notesphere-ff819.firebasestorage.app",
  messagingSenderId: "651900891270",
  appId: "1:651900891270:web:0de8a02e73ce207f1de107",
  measurementId: "G-SW1SZVSQRG"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
// const analytics = getAnalytics(app);

// 🔐 Google Sign-In
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

// 🚪 Logout
const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

// 📌 Firestore Notes Collection
const notesCollection = collection(db, "notes");

// 📝 Add Note (Private to User)
const addNote = async (title, description) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user authenticated");
    return;
  }

  try {
    await addDoc(notesCollection, {
      title,
      description,
      uid: user.uid,  
      email: user.email,
      createdAt: serverTimestamp(),  // ✅ Use serverTimestamp
      updatedAt: serverTimestamp(),  // ✅ Initial update timestamp
      pinned: false,  // Default to unpinned
    });
    console.log("Note added successfully");
  } catch (error) {
    console.error("Error adding note:", error);
  }
};

const listenToNotes = (setNotes) => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) return resolve(() => {}); // Return a dummy function if no user

      const userNotesQuery = query(notesCollection, where("uid", "==", user.uid));

      const unsubscribe = onSnapshot(userNotesQuery, (snapshot) => {
        const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(notes);
      });

      resolve(unsubscribe); // Return the unsubscribe function
    });
  });
};

// ✏️ Update Note
const updateNote = async (id, updatedData) => {
  try {
    const noteRef = doc(db, "notes", id);
    await updateDoc(noteRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),  // ✅ Update timestamp on edit
    });
    console.log("Note updated successfully");
  } catch (error) {
    console.error("Error updating note:", error);
  }
};


// 🗑️ Delete Note (Only User's Notes)
const deleteNote = async (id) => {
  try {
    await deleteDoc(doc(db, "notes", id));
    console.log("Note deleted successfully");
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

const togglePinNote = async (noteId, isPinned) => {
  await updateDoc(doc(db, "notes", noteId), {
    pinned: isPinned,
  });
};

export { auth, signInWithGoogle, logOut, addNote, listenToNotes, deleteNote, updateNote, togglePinNote };
