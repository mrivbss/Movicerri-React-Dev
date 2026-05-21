import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, AlertTriangle, UserPlus, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();
    
    const [isRegistering, setIsRegistering] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Si ya está logueado, lo mandamos a sesion
    if (user) {
        return <Navigate to="/sesion" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isRegistering) {
                const registeredUser = await signup(email, password, nombre);
                // Si el signUp es exitoso pero la confirmación por correo está activada,
                // no habrá sesión activa (el usuario es null). Cambiamos a modo login.
                if (registeredUser) {
                    setIsRegistering(false);
                    setPassword('');
                }
            } else {
                await login(email, password);
                navigate('/sesion');
            }
        } catch (err) {
            let msg = err.message;
            if (msg.includes('Invalid login credentials')) {
                msg = 'Correo o contraseña incorrectos.';
            } else if (msg.includes('User already registered')) {
                msg = 'Este correo ya tiene una cuenta registrada.';
            } else if (msg.includes('Password should be at least')) {
                msg = 'La contraseña debe tener al menos 6 caracteres.';
            } else if (msg.includes('missing_credentials')) {
                msg = 'Faltan credenciales en la configuración (Revisa el archivo .env).';
            } else if (msg.includes('email rate limit exceeded') || msg.includes('over_email_send_rate_limit')) {
                msg = 'Se ha excedido el límite de envío de correos de Supabase. Te recomendamos desactivar "Confirm email" (Confirmar correo) en el panel de Supabase (Authentication -> Providers -> Email).';
            } else if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
                msg = 'Debes confirmar tu correo electrónico antes de iniciar sesión, o desactiva "Confirm email" en tu panel de Supabase.';
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setPassword('');
    };

    return (
        <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card" 
                style={{ maxWidth: '400px', width: '100%', padding: '40px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="logo" style={{ color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '10px' }}>MOVICERRI</div>
                    <h2 style={{ fontSize: '1.5rem' }}>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {isRegistering ? 'Únete para guardar tus paraderos favoritos' : 'Ingresa a tu cuenta para ver tus viajes y saldo'}
                    </p>
                </div>


                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} style={{ background: 'rgba(244, 67, 54, 0.1)', border: '1px solid #f44336', color: '#f44336', padding: '10px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                            <AlertTriangle size={16} style={{ flexShrink: 0 }} /> <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    <AnimatePresence>
                        {isRegistering && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }}
                                className="form-group" style={{ overflow: 'hidden' }}
                            >
                                <label htmlFor="nombre" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><UserIcon size={16} /> Tu Nombre</label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Juan Pérez" 
                                    required={isRegistering}
                                    style={{ background: 'rgba(0,0,0,0.3)' }} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="form-group">
                        <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com" 
                            required 
                            style={{ background: 'rgba(0,0,0,0.3)' }} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            required 
                            style={{ background: 'rgba(0,0,0,0.3)' }} 
                        />
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255,69,0,0.4)' }} 
                        whileTap={{ scale: 0.98 }} 
                        type="submit" 
                        className="btn-primary btn-full" 
                        disabled={isLoading}
                        style={{ marginTop: '20px', padding: '12px' }}
                    >
                        {isLoading ? (
                            <span className="fas fa-spinner fa-spin"></span>
                        ) : isRegistering ? (
                            <><UserPlus size={18} /> Registrarse</>
                        ) : (
                            <><LogIn size={18} /> Entrar</>
                        )}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {isRegistering ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
                    <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
                    </button>
                </p>

            </motion.div>
        </section>
    );
}
