import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, AlertTriangle, UserPlus, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
    const { login, signup, user, isMockMode, toggleMockMode } = useAuth();
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
                await signup(email, password, nombre);
                // Si el signUp es exitoso, Supabase loguea al usuario automáticamente (dependiendo de la config de confirmación de email)
            } else {
                await login(email, password);
                navigate('/sesion');
            }
        } catch (err) {
            let msg = err.message;
            if (msg.includes('Invalid login credentials')) msg = 'Correo o contraseña incorrectos.';
            if (msg.includes('User already registered')) msg = 'Este correo ya tiene una cuenta registrada.';
            if (msg.includes('Password should be at least')) msg = 'La contraseña debe tener al menos 6 caracteres.';
            if (msg.includes('missing_credentials')) msg = 'Faltan credenciales en la configuración (Revisa el archivo .env).';
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

                {/* Selector de Modo (Supabase vs Simulación) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-glass-border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>
                            {isMockMode ? '🔌 Modo Simulación (Offline)' : '🌐 Conexión Supabase'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            {isMockMode ? 'Usando base de datos local' : 'Usando servidor Supabase real'}
                        </span>
                    </div>
                    <label className="switch" style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '46px',
                        height: '24px'
                    }}>
                        <input
                            type="checkbox"
                            checked={isMockMode}
                            onChange={(e) => toggleMockMode(e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span className="slider" style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            transition: '.3s',
                            borderRadius: '24px',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                height: '16px',
                                width: '16px',
                                left: isMockMode ? '24px' : '4px',
                                bottom: '3px',
                                backgroundColor: isMockMode ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                                transition: '.3s',
                                borderRadius: '50%',
                                position: 'absolute',
                                boxShadow: isMockMode ? '0 0 10px var(--color-primary)' : 'none'
                            }} />
                        </span>
                    </label>
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
                {!isRegistering && (
                    <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                        Para pruebas de Admin: admin@movicerri.cl / admin<br/>
                        {isMockMode ? (
                            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                (¡Listo para usar en Modo Simulación!)
                            </span>
                        ) : (
                            <span>(Requiere que esa cuenta exista en tu base de datos de Supabase)</span>
                        )}
                    </div>
                )}
            </motion.div>
        </section>
    );
}
