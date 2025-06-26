import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
