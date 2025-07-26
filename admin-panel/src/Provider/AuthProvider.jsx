// src/Provider/AuthProvider.jsx

import { createContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import Swal from "sweetalert2";

export const AuthContext = createContext();

// ✅ Allowed Admin Emails
const ALLOWED_EMAILS = [
  "zhdhsn6@gmail.com",
  "zahidweb1224@gmail.com",
  "mavrick.utpal@gmail.com",
  "info@edificerealtybdopc.com",
];

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser && ALLOWED_EMAILS.includes(loggedInUser.email)) {
        setUser(loggedInUser);
      } else if (loggedInUser) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Your email is not authorized to access this admin panel.",
          confirmButtonColor: "#d33",
        });
        signOut(auth);
        setUser(null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logOut = () => signOut(auth);

  const authInfo = {
    user,
    loading,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
