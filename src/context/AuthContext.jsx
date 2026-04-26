import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function syncUserToDb(user) {
    if (!user) return null;
    const userRef = doc(db, 'Users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Anonymous User',
        photoURL: user.photoURL || '',
        bio: '',
        createdAt: serverTimestamp(),
      });
    }
    return userRef;
  }

  async function signup(email, password) {
    await setPersistence(auth, browserSessionPersistence);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    await setPersistence(auth, browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    await setPersistence(auth, browserSessionPersistence);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userRef = await syncUserToDb(user);
          if (userRef) {
            // Listen to real-time profile updates
            unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
              if (docSnap.exists()) {
                setUserProfile(docSnap.data());
              } else {
                // Fallback if document doesn't exist for some reason
                setUserProfile({
                  uid: user.uid,
                  name: user.displayName || 'Anonymous User',
                  photoURL: user.photoURL || '',
                  bio: ''
                });
              }
              setLoading(false);
            }, (error) => {
              console.error("onSnapshot error:", error);
              // Fallback to basic user data if snapshot fails (e.g. offline)
              setUserProfile({
                uid: user.uid,
                name: user.displayName || 'Anonymous User',
                photoURL: user.photoURL || '',
                bio: ''
              });
              setLoading(false);
            });
          }
        } catch (error) {
          console.error("Error syncing user:", error);
          // Fallback if sync fails so the app doesn't freeze
          setUserProfile({
            uid: user.uid,
            name: user.displayName || 'Anonymous User',
            photoURL: user.photoURL || '',
            bio: ''
          });
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        if (unsubscribeProfile) unsubscribeProfile();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const value = {
    currentUser,
    userProfile, // Extends currentUser with Firestore data (Display Name, Bio, etc.)
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
