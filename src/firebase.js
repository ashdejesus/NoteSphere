import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCoEFuM-AIvhzaATKC0eHM8HUBlDErrdr4",
    authDomain: "notesphere-ff819.firebaseapp.com",
    projectId: "notesphere-ff819",
    storageBucket: "notesphere-ff819.firebasestorage.app",
    messagingSenderId: "651900891270",
    appId: "1:651900891270:web:0de8a02e73ce207f1de107",
    measurementId: "G-SW1SZVSQRG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const analytics = getAnalytics(app);

const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

const logOut = () => signOut(auth);

// Firestore Functions
const notesCollection = collection(db, "notes");

const addNote = async (title, description, user) => {
    if (!user) return;
    await addDoc(notesCollection, {
      title,
      description,
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
    });
  };
  

const listenToNotes = (callback) => {
  return onSnapshot(notesCollection, (snapshot) => {
    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(notes);
  });
};

const deleteNote = async (id) => {
  await deleteDoc(doc(db, "notes", id));
};

export { auth, signInWithGoogle, logOut, addNote, listenToNotes, deleteNote };
