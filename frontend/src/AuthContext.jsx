import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('aroha_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('aroha_user'); }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('aroha_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aroha_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
