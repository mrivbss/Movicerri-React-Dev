import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar sesión actual al cargar la app
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Attach a fake role to keep the admin feature working
                const isSysAdmin = session.user.email === 'admin@movicerri.cl';
                setUser({ ...session.user, role: isSysAdmin ? 'admin' : 'user' });
            }
            setLoading(false);
        });

        // Escuchar cambios de sesión (login, logout, refresh token)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const isSysAdmin = session.user.email === 'admin@movicerri.cl';
                setUser({ ...session.user, role: isSysAdmin ? 'admin' : 'user' });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Función de Login Real
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }
        return data.user;
    };

    // Función de Registro Real
    const signup = async (email, password, nombre) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre: nombre // Guarda el nombre en los metadatos del usuario
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }
        
        toast.success('Cuenta creada. Revisa tu correo para verificar tu cuenta (si tienes habilitada la confirmación por email en Supabase).');
        return data.user;
    };

    // Función de Logout
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Error al cerrar sesión: ' + error.message);
        } else {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
