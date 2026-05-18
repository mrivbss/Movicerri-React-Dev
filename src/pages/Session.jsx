import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CreditCard, Edit, MapPin, Calendar, Star, Plus, Trash2, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Session() {
    const { user } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [userProfile, setUserProfile] = useState({ 
        name: user?.user_metadata?.nombre || 'Usuario MoviCerri', 
        email: user?.email || 'cargando...' 
    });

    const [rutasFavoritas, setRutasFavoritas] = useState([]);
    const [isEditingBip, setIsEditingBip] = useState(false);
    const [bipState, setBipState] = useState({ cardNumber: '1234 5678', balance: '$1.450' });
    const [bipFeedback, setBipFeedback] = useState({ text: '', show: false, color: '' });

    // Tilt Effect Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    useEffect(() => {
        const rawFavorites = localStorage.getItem('movicerri_rutas_favoritas');
        if (rawFavorites) {
            try { setRutasFavoritas(JSON.parse(rawFavorites)); } catch (e) { setRutasFavoritas(['I14', 'I18']); }
        } else {
            setRutasFavoritas(['I14', 'I18']);
        }

        try {
            const state = JSON.parse(localStorage.getItem('movicerri_linked_bip') || 'null');
            if (state) {
                setBipState({
                    cardNumber: state.cardNumber || '1234 5678',
                    balance: typeof state.balance === 'number' ? `$${state.balance.toLocaleString('es-CL')}` : state.balance || '$1.450'
                });
            }
        } catch(e) {}
    }, []);

    const toggleEditProfile = () => setIsEditingProfile(!isEditingProfile);

    const handleProfileChange = (e, field) => {
        setUserProfile({ ...userProfile, [field]: e.target.value });
    };

    const removeRutaFavorita = (ruta) => {
        if (window.confirm(`¿Seguro que deseas eliminar el recorrido ${ruta} de tus favoritos?`)) {
            const updated = rutasFavoritas.filter(r => r !== ruta);
            setRutasFavoritas(updated);
            localStorage.setItem('movicerri_rutas_favoritas', JSON.stringify(updated));
        }
    };

    const promptAddRuta = () => {
        const input = window.prompt('Ingresa el nombre del recorrido a añadir (ej. I01, 109, I14, etc.):');
        if (!input) return;
        
        const ruta = input.trim().toUpperCase();
        if (ruta && !rutasFavoritas.includes(ruta)) {
            const updated = [...rutasFavoritas, ruta];
            setRutasFavoritas(updated);
            localStorage.setItem('movicerri_rutas_favoritas', JSON.stringify(updated));
        } else if (rutasFavoritas.includes(ruta)) {
            alert('Este recorrido ya está en tus favoritos.');
        }
    };

    const toggleEditBip = () => {
        if (isEditingBip) {
            let rawVal = bipState.cardNumber.replace(/\D/g, '').padEnd(8, '•');
            const formatted = rawVal.replace(/(.{4})/g, '$1 ').trim();
            setBipState(prev => {
                const newState = { ...prev, cardNumber: formatted };
                localStorage.setItem('movicerri_linked_bip', JSON.stringify(newState));
                return newState;
            });
        }
        setIsEditingBip(!isEditingBip);
    };

    const actualizarSaldo = async () => {
        let rawNumber = bipState.cardNumber.replace(/\s+/g, '');
        if (rawNumber.length < 8 || rawNumber.includes('•')) {
            rawNumber = '23352467'; 
        }

        setBipState(prev => ({ ...prev, balance: 'Cargando...' }));
        setBipFeedback({ text: '', show: false, color: '' });

        try {
            const response = await fetch(`https://corsproxy.io/?https://api.xor.cl/red/balance/${rawNumber}`);
            if (!response.ok) throw new Error('Error de red o proxy');
            const data = await response.json();
            
            if (data.status === 'OK' && data.balance) {
                const newBalance = data.balance;
                setBipState(prev => {
                    const newState = { ...prev, balance: newBalance };
                    localStorage.setItem('movicerri_linked_bip', JSON.stringify(newState));
                    return newState;
                });
                setBipFeedback({ text: '¡Saldo actualizado exitosamente desde XOR!', show: true, color: '#4caf50' });
            } else {
                throw new Error('API respondió pero la tarjeta es inválida');
            }
        } catch (error) {
            const randomBalance = Math.floor(Math.random() * (4800 - 1250 + 1)) + 1250;
            const formattedBalance = `$${randomBalance.toLocaleString('es-CL')}`;
            
            setBipState(prev => {
                const newState = { ...prev, balance: formattedBalance };
                localStorage.setItem('movicerri_linked_bip', JSON.stringify(newState));
                return newState;
            });
            setBipFeedback({ text: 'Saldo actualizado (Modo Simulación)', show: true, color: 'var(--color-text-secondary)' });
        }

        setTimeout(() => {
            setBipFeedback(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    return (
        <>
            <section className="account-header">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.5 }}
                    className="section-header reveal"
                >
                    <span className="section-tag">Perfil de Usuario</span>
                    <h2>Bienvenido a tu <span className="text-gradient" style={{ background: 'linear-gradient(90deg, #ff4500, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cuenta</span></h2>
                </motion.div>
            </section>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="dashboard-container">
                    {/* User Profile */}
                    <motion.div whileHover={{ y: -5 }} className="card">
                        <div className="user-profile">
                            <div className="user-avatar" style={{ background: 'var(--color-primary)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', boxShadow: 'var(--shadow-glow)' }}>
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="user-info">
                                {isEditingProfile ? (
                                    <>
                                        <input 
                                            type="text" 
                                            value={userProfile.name} 
                                            onChange={(e) => handleProfileChange(e, 'name')}
                                            style={{ marginBottom: '5px', fontSize: '1.5rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--color-primary)', color: 'white', padding: '5px', borderRadius: '8px', width: '100%', outline: 'none' }}
                                        />
                                        <input 
                                            type="email" 
                                            value={userProfile.email} 
                                            onChange={(e) => handleProfileChange(e, 'email')}
                                            style={{ marginTop: '5px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-text-primary)', padding: '5px', borderRadius: '8px', width: '100%', outline: 'none' }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h2 style={{ color: 'white', marginBottom: '5px' }}>{userProfile.name}</h2>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}><i className="fas fa-envelope"></i> <span>{userProfile.email}</span></p>
                                    </>
                                )}
                            </div>
                        </div>
                        <hr style={{ borderColor: 'var(--color-glass-border)', margin: '20px 0' }} />
                        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--color-primary)" /> Cerrillos, Santiago</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}><Calendar size={18} color="var(--color-primary)" /> Miembro desde Abril 2026</p>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={isEditingProfile ? "btn-primary" : "btn-secondary"} style={{ width: '100%', marginTop: '20px' }} onClick={toggleEditProfile}>
                            {isEditingProfile ? <Save size={18} /> : <Edit size={18} />} {isEditingProfile ? 'Guardar Cambios' : 'Editar Perfil'}
                        </motion.button>
                    </motion.div>

                    {/* Favoritas */}
                    <motion.div whileHover={{ y: -5 }} className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={22} color="var(--color-primary)" /> Mis Rutas Favoritas</h3>
                        <div className="status-list" style={{ marginTop: '20px' }}>
                            {rutasFavoritas.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', margin: '10px 0' }}>No tienes rutas favoritas.</p>
                            ) : (
                                rutasFavoritas.map((ruta, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={ruta} className="status-item" style={{ background: 'var(--color-surface)', padding: '15px', borderRadius: 'var(--radius)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-glass-border)' }}>
                                        <div className="status-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fas fa-bus" style={{ color: 'var(--color-primary)' }}></i><span style={{ fontWeight: 600 }}>Recorrido {ruta}</span></div>
                                        <button className="btn-micro" style={{ background: 'transparent', borderColor: 'transparent', padding: '5px' }} onClick={() => removeRutaFavorita(ruta)} title="Eliminar de favoritos">
                                            <Trash2 size={18} color="var(--color-text-secondary)" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={promptAddRuta}>
                            <Plus size={18} /> Añadir Ruta
                        </motion.button>
                    </motion.div>

                    {/* BIP Card 3D */}
                    <motion.div whileHover={{ y: -5 }} className="card" style={{ perspective: '1000px' }}>
                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={22} color="var(--color-primary)" /> Mi Tarjeta BIP!</span>
                            <button className="btn-micro" onClick={toggleEditBip} style={{ background: 'transparent', border: '1px solid var(--color-glass-border)', color: isEditingBip ? 'var(--color-primary)' : 'white' }}>
                                {isEditingBip ? <Save size={16} /> : <Edit size={16} />}
                            </button>
                        </h3>
                        
                        <motion.div 
                            style={{ x, y, rotateX, rotateY, z: 100, margin: '30px auto', maxWidth: '300px', cursor: "grab" }}
                            drag
                            dragElastic={0.16}
                            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                            whileTap={{ cursor: "grabbing" }}
                            className="bip-card-visual"
                        >
                            <div className="bip-card-front" style={{ padding: '25px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', borderRadius: '16px', color: 'white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="bip-card-logo" style={{ fontWeight: 'bold', fontSize: '1.8rem', fontStyle: 'italic', letterSpacing: '-1px' }}>bip!</div>
                                {isEditingBip ? (
                                    <input 
                                        type="text" 
                                        value={bipState.cardNumber.replace(/\s+/g, '')}
                                        onChange={(e) => setBipState({ ...bipState, cardNumber: e.target.value })}
                                        maxLength="8" 
                                        placeholder="12345678" 
                                        style={{ fontSize: '1.4rem', letterSpacing: '3px', margin: '20px 0', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '8px', borderRadius: '8px', width: '100%', boxSizing: 'border-box', textAlign: 'center', outline: 'none' }}
                                    />
                                ) : (
                                    <div className="bip-card-number" style={{ fontSize: '1.6rem', letterSpacing: '4px', margin: '20px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontFamily: 'monospace' }}>{bipState.cardNumber}</div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.9 }}>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tarjeta Vinculada</span>
                                    <i className="fas fa-wifi" style={{ transform: 'rotate(90deg)' }}></i>
                                </div>
                            </div>
                        </motion.div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', background: 'var(--color-surface)', borderRadius: 'var(--radius)', border: '1px solid var(--color-glass-border)' }}>
                            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Saldo Actual</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{bipState.balance}</span>
                        </div>
                        {bipFeedback.show && (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.9rem', color: bipFeedback.color, textAlign: 'center', marginBottom: '15px' }}>
                                {bipFeedback.color === '#4caf50' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {bipFeedback.text}
                            </motion.p>
                        )}
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary" style={{ width: '100%' }} onClick={actualizarSaldo}>
                            <RefreshCw size={18} /> Actualizar Saldo
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
