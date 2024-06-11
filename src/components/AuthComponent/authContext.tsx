import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

export interface AuthContextType {
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
  }

const defaultState={
    dialogOpen:false,
    setDialogOpen:(dialogOpen:boolean)=>{}

} as AuthContextType
export const AuthContext=createContext(defaultState);

type AuthProviderProps ={
    children: ReactNode
}

export function AuthProvider({children}:AuthProviderProps){
    const [dialogOpen,setDialogOpen]= useState<boolean>(false);

    return(
        <AuthContext.Provider value={{dialogOpen,setDialogOpen}}>
            {children}
        </AuthContext.Provider>

    );
}