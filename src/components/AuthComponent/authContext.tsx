import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ dialogOpen, setDialogOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthDialog = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthDialog must be used within an AuthProvider');
  }
  return context;
};
