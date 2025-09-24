import { createContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);
  const value = { user, setUser, loading, setLoading };
  return (
    <AppContext.Provider value={value}>
      {loading ? <p>Loading...</p> : children}
    </AppContext.Provider>
  );
};

export default AppContext;
