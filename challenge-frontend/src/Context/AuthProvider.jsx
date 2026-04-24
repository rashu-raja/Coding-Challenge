import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [user, setUser] = useState(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const [itemsPerPage, setItemsPerPage] = useState(
    () => Number(localStorage.getItem("itemsPerPage")) || 10
  );

  // theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // pagination
  useEffect(() => {
    localStorage.setItem("itemsPerPage", itemsPerPage);
  }, [itemsPerPage]);

  // login
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  //  logout
  const logout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  // fetch designations & departments
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [desRes, depRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/designations", {
            headers: { Accept: "application/json" },
          }),
          fetch("http://127.0.0.1:8000/api/departments", {
            headers: { Accept: "application/json" },
          }),
        ]);

        const desData = await desRes.json();
        const depData = await depRes.json();

        setDesignations(desData.data ?? []);
        setDepartments(depData.data ?? []);
      } catch (err) {
        console.error("Failed to load designations/departments", err);
      }
    };

    fetchOptions();
  }, []);

  // me
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [token]);

  // favorites
  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(`favorites_${user.id}`);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const toggleFavorite = (targetUser) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === targetUser.id)
        ? prev.filter((f) => f.id !== targetUser.id)
        : [...prev, targetUser]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isLoggedIn: !!token,

        theme,
        setTheme,

        itemsPerPage,
        setItemsPerPage,

        designations,
        departments,

        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
