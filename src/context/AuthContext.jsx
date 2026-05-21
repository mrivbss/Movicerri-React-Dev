import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMockMode, setIsMockMode] = useState(() => {
        const saved = localStorage.getItem('movicerri_mock_auth');
        if (saved !== null) return saved === 'true';
        const envMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const noCredentials = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('pega_aqui');
        return envMock || noCredentials;
    });

    const toggleMockMode = (mode) => {
        localStorage.setItem('movicerri_mock_auth', mode ? 'true' : 'false');
        setIsMockMode(mode);
    };

    useEffect(() => {
        setLoading(true);
        if (isMockMode) {
            const savedSession = localStorage.getItem('movicerri_mock_session');
            if (savedSession) {
                try {
                    setUser(JSON.parse(savedSession));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
            return () => {};
        } else {
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
        }
    }, [isMockMode]);

    // Función de Login
    const login = async (email, password) => {
        if (isMockMode) {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (email === 'admin@movicerri.cl' && password === 'admin') {
                const adminUser = {
                    id: 'mock-admin-id',
                    email: 'admin@movicerri.cl',
                    user_metadata: { nombre: 'Administrador Municipal' },
                    role: 'admin'
                };
                localStorage.setItem('movicerri_mock_session', JSON.stringify(adminUser));
                setUser(adminUser);
                toast.success('Sesión iniciada correctamente (Modo Simulación)');
                return adminUser;
            }

            const savedUsers = JSON.parse(localStorage.getItem('movicerri_mock_users') || '[]');
            const foundUser = savedUsers.find(u => u.email === email && u.password === password);
            
            if (!foundUser) {
                throw new Error('Correo o contraseña incorrectos.');
            }

            const normalUser = {
                id: foundUser.id || 'mock-user-id',
                email: foundUser.email,
                user_metadata: { nombre: foundUser.nombre },
                role: foundUser.email === 'admin@movicerri.cl' ? 'admin' : 'user'
            };
            localStorage.setItem('movicerri_mock_session', JSON.stringify(normalUser));
            setUser(normalUser);
            toast.success(`Bienvenido, ${foundUser.nombre} (Modo Simulación)`);
            return normalUser;
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw new Error(error.message);
            }
            return data.user;
        }
    };

    // Función de Registro
    const signup = async (email, password, nombre) => {
        if (isMockMode) {
            await new Promise(resolve => setTimeout(resolve, 800));

            const savedUsers = JSON.parse(localStorage.getItem('movicerri_mock_users') || '[]');
            
            if (savedUsers.some(u => u.email === email) || email === 'admin@movicerri.cl') {
                throw new Error('Este correo ya tiene una cuenta registrada.');
            }

            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres.');
            }

            const newUser = {
                id: crypto.randomUUID ? crypto.randomUUID() : 'mock-' + Math.random().toString(36).substring(2, 11),
                email,
                password,
                nombre
            };

            savedUsers.push(newUser);
            localStorage.setItem('movicerri_mock_users', JSON.stringify(savedUsers));

            const normalUser = {
                id: newUser.id,
                email: newUser.email,
                user_metadata: { nombre: newUser.nombre },
                role: 'user'
            };
            localStorage.setItem('movicerri_mock_session', JSON.stringify(normalUser));
            setUser(normalUser);
            
            toast.success('Cuenta creada y sesión iniciada (Modo Simulación)');
            return normalUser;
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nombre: nombre
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }
            
            toast.success('Cuenta creada. Revisa tu correo para verificar tu cuenta (si tienes habilitada la confirmación por email en Supabase).');
            return data.user;
        }
    };

    // Función de Logout
    const logout = async () => {
        if (isMockMode) {
            localStorage.removeItem('movicerri_mock_session');
            setUser(null);
            toast.info('Sesión cerrada (Modo Simulación)');
        } else {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error('Error al cerrar sesión: ' + error.message);
            } else {
                setUser(null);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, isMockMode, toggleMockMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
