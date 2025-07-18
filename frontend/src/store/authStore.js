import { useEffect, useState } from "react";

let listeners = [];
let role = localStorage.getItem('role') || '';
let token = localStorage.getItem('token') || '';

export const setAuth = (newRole, newToken) => {
    localStorage.setItem('role', newRole);
    localStorage.setItem('token', newToken);
    role = newRole;
    token = newToken;
    listeners.forEach(fn => fn({ role, token }));
};

export const clearAuth = () => {
    localStorage.clear();
    role = '';
    token = '';
    listeners.forEach(fn => fn({ role, token }));
};

export const useAuthStore = () => {
    const [auth, setAuthState] = useState({ role, token });

    useEffect(() => {
        const fn = (newAuth) => setAuthState(newAuth);
        listeners.push(fn);
        return () => {
            listeners = listeners.filter(listener => listener !== fn);
        };
    }, []);

    return auth;
};
