import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let active = true;

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (active) {
                if (session?.user) {
                    const isSysAdmin = session.user.email === 'admin@movicerri.cl';
                    setUser({ ...session.user, role: isSysAdmin ? 'admin' : 'user' });
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (active) {
                if (session?.user) {
                    const isSysAdmin = session.user.email === 'admin@movicerri.cl';
                    setUser({ ...session.user, role: isSysAdmin ? 'admin' : 'user' });
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    // Función de Login
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

    // Función de Registro
    const signup = async (email, password, nombre) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { nombre }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        toast.success('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
        return data.user;
    };

    // Función de Logout
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Error al cerrar sesión: ' + error.message);
        } else {
            setUser(null);
            toast.info('Sesión cerrada correctamente.');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
