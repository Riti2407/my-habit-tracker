// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Check if user is already logged in (from localStorage)
//     const user = localStorage.getItem("habitTrackerUser");
//     const token = localStorage.getItem("habitTrackerToken");

//     if (user && token) {
//       setCurrentUser(JSON.parse(user));
//       setIsAuthenticated(true);
//     }

//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setLoading(true);

//       // Simulate API call - replace with actual backend integration
//       // For now, we'll use a mock authentication
//       if (email === "demo@example.com" && password === "demo123") {
//         const user = {
//           id: "1",
//           email: email,
//           name: "Demo User",
//           createdAt: new Date().toISOString(),
//         };

//         const token = "mock-jwt-token-" + Date.now();

//         localStorage.setItem("habitTrackerUser", JSON.stringify(user));
//         localStorage.setItem("habitTrackerToken", token);

//         setCurrentUser(user);
//         setIsAuthenticated(true);

//         return { success: true, user };
//       } else {
//         throw new Error("Invalid credentials");
//       }
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (email, password, name) => {
//     try {
//       setLoading(true);

//       // Simulate API call - replace with actual backend integration
//       // For now, we'll create a mock user
//       const user = {
//         id: Date.now().toString(),
//         email: email,
//         name: name,
//         createdAt: new Date().toISOString(),
//       };

//       const token = "mock-jwt-token-" + Date.now();

//       localStorage.setItem("habitTrackerUser", JSON.stringify(user));
//       localStorage.setItem("habitTrackerToken", token);

//       setCurrentUser(user);
//       setIsAuthenticated(true);

//       return { success: true, user };
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("habitTrackerUser");
//     localStorage.removeItem("habitTrackerToken");
//     setCurrentUser(null);
//     setIsAuthenticated(false);
//   };

//   const updateProfile = (updates) => {
//     if (currentUser) {
//       const updatedUser = { ...currentUser, ...updates };
//       setCurrentUser(updatedUser);
//       localStorage.setItem("habitTrackerUser", JSON.stringify(updatedUser));
//     }
//   };

//   const value = {
//     currentUser,
//     isAuthenticated,
//     loading,
//     login,
//     signup,
//     logout,
//     updateProfile,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };










// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage (localStorage or sessionStorage)
  useEffect(() => {
    const storedUser =
      localStorage.getItem("currentUser") ||
      sessionStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- SIGNUP ---
  const signup = (email, password, name) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.find((u) => u.email === email)) {
        return reject(new Error("Email already exists"));
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password, // ⚠️ should be hashed in real apps
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      // Default signup session: store in session until first login
      sessionStorage.setItem("currentUser", JSON.stringify(newUser));
      setCurrentUser(newUser);
      resolve(newUser);
    });
  };

  // --- LOGIN ---
  const login = (email, password, rememberMe = false) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return reject(new Error("Invalid credentials"));
      }

      // Save user based on rememberMe
      if (rememberMe) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        sessionStorage.removeItem("currentUser");
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.removeItem("currentUser");
      }

      setCurrentUser(user);
      resolve(user);
    });
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  // --- UPDATE PROFILE ---
  const updateProfile = (updates) => {
    return new Promise((resolve) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUser = { ...currentUser, ...updates };

      const updatedUsers = users.map((u) =>
        u.email === currentUser.email ? updatedUser : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update in whichever storage is active
      if (localStorage.getItem("currentUser")) {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }

      setCurrentUser(updatedUser);
      resolve(updatedUser);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        signup,
        login,
        logout,
        updateProfile,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
