import { motion } from 'framer-motion';
import { Headset, User, MessageSquare, Send } from 'lucide-react';

export default function Support() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Mensaje de prueba enviado. ¡Todo funciona correctamente!');
        window.location.href = '/';
    };

    return (
        <section className="section" style={{ minHeight: '70vh' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section-header reveal"
            >
                <span className="section-tag">Ayuda y Contacto</span>
                <h2>Centro de <span className="text-gradient" style={{ background: 'linear-gradient(90deg, #ff4500, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Soporte</span></h2>
                <p className="section-desc">Página de prueba para soporte técnico.</p>
            </motion.div>
            
            <div className="dashboard-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="card reveal"
                >
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><Headset size={24} color="var(--color-primary)" /> Envíanos un mensaje</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> Tu Nombre</label>
                            <input type="text" id="nombre" placeholder="Ingresa tu nombre" required style={{ background: 'rgba(0,0,0,0.3)' }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mensaje" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={16} /> Mensaje</label>
                            <textarea id="mensaje" rows="4" placeholder="¿En qué podemos ayudarte?" required style={{ background: 'rgba(0,0,0,0.3)', resize: 'none' }}></textarea>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255,69,0,0.4)' }} 
                            whileTap={{ scale: 0.98 }} 
                            type="submit" 
                            className="btn-primary btn-full" 
                            style={{ marginTop: '10px' }}
                        >
                            <Send size={18} /> Enviar Mensaje de Prueba
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
