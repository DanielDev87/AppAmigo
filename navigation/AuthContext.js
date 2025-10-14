import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('el useAuth deberia estarse usando dentro del proveedor que autoriza al acceso al app');
    }
    return context;
}