import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Database, Route, Video, Bell, Building, Bus, BarChart3, ShieldAlert, PenSquare, Tag, MapPin, MessageSquare, Send, CreditCard, Search, CalendarPlus, Banknote, Hash, RefreshCw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const datosRecorridos = {
    'I14': [5, 15, 8, 12, 4, 7],
    'I18': [10, 5, 20, 15, 8, 12],
    'I01': [2, 8, 5, 3, 10, 4]
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function Home() {
    // --- Dashboard: Chart ---
    const [recorridoActivo, setRecorridoActivo] = useState('I14');
    
    const chartData = {
        labels: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
        datasets: [{
            label: 'Minutos de espera',
            data: datosRecorridos[recorridoActivo],
            borderColor: '#ff4500', // Neon Orange
            backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                    return 'rgba(255, 69, 0, 0.2)';
                }
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(255, 69, 0, 0.5)');
                gradient.addColorStop(1, 'rgba(255, 69, 0, 0.01)');
                return gradient;
            },
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#09090b',
            pointBorderColor: '#ff4500',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#ff4500'
        }]
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        },
        plugins: {
            legend: { labels: { color: '#f8fafc', font: { family: 'Inter' } } },
            tooltip: {
                backgroundColor: 'rgba(15, 15, 20, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,69,0,0.5)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    // --- Dashboard: Services Status ---
    const [lastUpdate, setLastUpdate] = useState('hace 2 minutos');
    const [serviceStatuses, setServiceStatuses] = useState([
        { id: 'I14', class: 'badge-green', icon: <CheckCircle size={14} />, text: 'Fluido' },
        { id: 'I18', class: 'badge-yellow', icon: <AlertTriangle size={14} />, text: 'Retraso 5 min' },
        { id: 'I01', class: 'badge-green', icon: <CheckCircle size={14} />, text: 'Fluido' }
    ]);

    const actualizarEstadoServicios = () => {
        const statuses = [
            { class: 'badge-green', icon: <CheckCircle size={14} />, text: 'Fluido' },
            { class: 'badge-yellow', icon: <AlertTriangle size={14} />, text: 'Retraso leve' },
            { class: 'badge-red', icon: <AlertTriangle size={14} />, text: 'Retraso grave' }
        ];
        
        setServiceStatuses(prev => prev.map(s => {
            const random = statuses[Math.floor(Math.random() * statuses.length)];
            return { ...s, class: random.class, icon: random.icon, text: random.text };
        }));
        setLastUpdate('hace unos segundos');
    };

    // --- Dashboard: Simulation ---
    const [isSimulating, setIsSimulating] = useState(false);
    const [peopleCount, setPeopleCount] = useState(12);
    const [peopleBar, setPeopleBar] = useState(60);
    const [protocolStatus, setProtocolStatus] = useState({ class: 'protocol-normal', icon: <CheckCircle size={14} />, text: 'Normal' });

    const simularProtocolo = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        let current = 0;
        const max = 20;

        const interval = setInterval(() => {
            current += 2;
            if (current >= max) current = max;
            const perc = Math.round((current / max) * 100);
            
            setPeopleBar(perc);
            setPeopleCount(current);

            if (current >= 15 && protocolStatus.class === 'protocol-normal') {
                setProtocolStatus({ class: 'protocol-alert', icon: <AlertTriangle size={14} />, text: 'Alta Demanda' });
                toast.error('¡Alerta de Aglomeración!', {
                    description: 'Umbral superado en Paradero Lo Errázuriz. Activando protocolo.',
                    icon: <ShieldAlert />
                });
            }

            if (current === max) {
                clearInterval(interval);
                toast.success('Buses Adicionales Despachados', {
                    description: 'La municipalidad ha enviado unidades extra. Tiempos normalizándose.',
                    icon: <Bus />
                });
                setTimeout(() => {
                    setPeopleBar(60);
                    setPeopleCount(12);
                    setProtocolStatus({ class: 'protocol-normal', icon: <CheckCircle size={14} />, text: 'Normal' });
                    setIsSimulating(false);
                }, 5000);
            }
        }, 300);
    };

    // --- Reportes ---
    const [listaReportes, setListaReportes] = useState([]);
    const [filtroReporte, setFiltroReporte] = useState('todos');

    useEffect(() => {
        const raw = localStorage.getItem('movicerri_reportes');
        if (raw) {
            try { setListaReportes(JSON.parse(raw)); } catch (e) { setListaReportes([]); }
        }
    }, []);

    const enviarReporte = (e) => {
        e.preventDefault();
        const tipo = e.target.reportType.value;
        const ruta = e.target.reportRoute.value;
        const loc = e.target.reportLocation.value.trim();
        const desc = e.target.reportDesc.value.trim();

        if (!tipo || !ruta || !loc || !desc) {
            toast.warning('Campos incompletos', { description: 'Por favor completa todos los campos del reporte.' });
            return;
        }

        const nuevoReporte = {
            id: Date.now(),
            tipo,
            ruta,
            loc,
            desc,
            fecha: new Date().toISOString()
        };

        const nuevaLista = [nuevoReporte, ...listaReportes];
        setListaReportes(nuevaLista);
        localStorage.setItem('movicerri_reportes', JSON.stringify(nuevaLista));
        e.target.reset();
        
        toast.success('Reporte enviado correctamente', {
            description: 'Gracias por ayudar a mejorar el transporte en Cerrillos.',
        });
    };

    const reportesFiltrados = listaReportes.filter(r => filtroReporte === 'todos' || r.tipo === filtroReporte);

    // --- Saldo ---
    const [bipNumber, setBipNumber] = useState('');
    const [saldoResult, setSaldoResult] = useState(null);
    const [saldoError, setSaldoError] = useState(false);

    const formatBipVisual = () => {
        const val = bipNumber.replace(/\D/g, '').padEnd(8, '•');
        return val.replace(/(.{4})/g, '$1 ').trim();
    };

    const consultarSaldo = () => {
        const num = bipNumber.replace(/\D/g, '');
        if (!num || num.length < 8) {
            alert('Ingresa un número de tarjeta BIP válido (8 dígitos).');
            return;
        }

        let MOCK_SALDOS = {};
        const raw = localStorage.getItem('movicerri_saldos');
        if (raw) {
            try { MOCK_SALDOS = JSON.parse(raw); } catch(e) {}
        }

        if (!MOCK_SALDOS[num]) {
            const saldoRandom = Math.floor(Math.random() * 8000) + 500;
            const viajesRandom = Math.floor(Math.random() * 20);
            const hoy = new Date();
            const fechaViaje = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')} ${String(hoy.getHours()).padStart(2, '0')}:${String(hoy.getMinutes()).padStart(2, '0')}`;
            
            MOCK_SALDOS[num] = {
                saldo: saldoRandom,
                ultimaCarga: `2026-04-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                ultimoViaje: fechaViaje,
                costoViaje: 730,
                viajesMes: viajesRandom
            };
            localStorage.setItem('movicerri_saldos', JSON.stringify(MOCK_SALDOS));
        }

        setSaldoResult(MOCK_SALDOS[num]);
        setSaldoError(false);
    };

    return (
        <>
            <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="hero-bg-animation" style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,69,0,0.15) 0%, rgba(0,0,0,0) 50%)', animation: 'spin 20s linear infinite', zIndex: 0 }}></div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-content reveal" style={{ position: 'relative', zIndex: 1 }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} className="hero-badge" style={{ border: '1px solid rgba(255,69,0,0.3)', background: 'rgba(255,69,0,0.1)', backdropFilter: 'blur(10px)' }}>🚌 Proyecto Universitario — Comuna de Cerrillos</motion.div>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', fontWeight: '800', letterSpacing: '-1px' }}>Transporte público <span className="text-gradient" style={{ background: 'linear-gradient(90deg, #ff4500, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 30px rgba(255,69,0,0.3)' }}>inteligente</span> para Cerrillos</h1>
                    <p className="hero-desc" style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '20px auto' }}>Utilizamos inteligencia artificial y visión computacional para detectar aglomeraciones en paraderos y activar protocolos que despachan más buses en tiempo real.</p>
                    <div className="hero-buttons">
                        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#solucion" className="btn-primary"><Lightbulb size={20} /> Conoce la Solución</motion.a>
                        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#dashboard" className="btn-secondary"><TrendingUp size={20} /> Ver Dashboard</motion.a>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="hero-stats" style={{ marginTop: '50px', borderTop: '1px solid var(--color-glass-border)', paddingTop: '30px' }}
                    >
                        <div className="hero-stat">
                            <span className="hero-stat-number" style={{ textShadow: '0 0 15px rgba(255,69,0,0.4)' }}>5</span>
                            <span className="hero-stat-label">Paraderos Monitoreados</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-number" style={{ textShadow: '0 0 15px rgba(255,69,0,0.4)' }}>40</span><span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>%</span>
                            <span className="hero-stat-label">Reducción de Espera</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-number" style={{ textShadow: '0 0 15px rgba(255,69,0,0.4)' }}>9</span>
                            <span className="hero-stat-label">Recorridos Activos</span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            <section className="section" id="problema">
                <div className="section-header reveal">
                    <span className="section-tag">El Problema</span>
                    <h2>Transporte público en <span className="text-gradient" style={{ color: '#ff4500' }}>crisis</span></h2>
                    <p className="section-desc">Los vecinos de Cerrillos enfrentan diariamente tiempos de espera excesivos, buses saturados y falta de información en tiempo real.</p>
                </div>
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="problems-grid"
                >
                    <motion.div variants={itemVariant} className="problem-card card">
                        <div className="problem-icon" style={{ background: 'rgba(255,69,0,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><Clock size={32} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.3rem' }}>Esperas Excesivas</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>En hora pico los tiempos de espera superan los 25 minutos, afectando la calidad de vida.</p>
                        <div className="problem-stat" style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>+25 min</div>
                    </motion.div>
                    <motion.div variants={itemVariant} className="problem-card card">
                        <div className="problem-icon" style={{ background: 'rgba(255,69,0,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><Users size={32} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.3rem' }}>Buses Saturados</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Los buses circulan al máximo de su capacidad en horarios punta, generando incomodidad.</p>
                        <div className="problem-stat" style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>150%</div>
                    </motion.div>
                    <motion.div variants={itemVariant} className="problem-card card">
                        <div className="problem-icon" style={{ background: 'rgba(255,69,0,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><Database size={32} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.3rem' }}>Sin Datos Reales</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>La municipalidad no cuenta con información actualizada sobre la demanda en los paraderos.</p>
                        <div className="problem-stat" style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>0 datos</div>
                    </motion.div>
                    <motion.div variants={itemVariant} className="problem-card card">
                        <div className="problem-icon" style={{ background: 'rgba(255,69,0,0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><Route size={32} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.3rem' }}>Rutas Ineficientes</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>No existe un sistema dinámico que adapte la frecuencia de buses según la demanda.</p>
                        <div className="problem-stat" style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Estático</div>
                    </motion.div>
                </motion.div>
            </section>

            <section className="section" id="solucion" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}></div>
                <div className="section-header reveal">
                    <span className="section-tag">Nuestra Solución</span>
                    <h2>¿Cómo funciona <span className="text-gradient" style={{ color: '#ff4500' }}>MOVICERRI</span>?</h2>
                    <p className="section-desc">Un sistema inteligente de 4 pasos que conecta la detección automática con la acción municipal.</p>
                </div>
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="steps-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}
                >
                    <motion.div variants={itemVariant} className="step-card card">
                        <div className="step-number" style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '10px', right: '20px' }}>01</div>
                        <div className="step-icon" style={{ marginBottom: '15px' }}><Video size={40} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Detección con IA</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Cámaras en paraderos clave utilizan visión computacional para contar personas y detectar aglomeraciones en tiempo real.</p>
                    </motion.div>
                    <motion.div variants={itemVariant} className="step-card card">
                        <div className="step-number" style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '10px', right: '20px' }}>02</div>
                        <div className="step-icon" style={{ marginBottom: '15px' }}><Bell size={40} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Protocolo de Alerta</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Cuando se supera el umbral de personas, se activa automáticamente un protocolo de alerta con prioridad.</p>
                    </motion.div>
                    <motion.div variants={itemVariant} className="step-card card">
                        <div className="step-number" style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '10px', right: '20px' }}>03</div>
                        <div className="step-icon" style={{ marginBottom: '15px' }}><Building size={40} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Aviso Municipal</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>La municipalidad recibe una notificación con datos del paradero y cantidad de personas para tomar acción.</p>
                    </motion.div>
                    <motion.div variants={itemVariant} className="step-card card">
                        <div className="step-number" style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '10px', right: '20px' }}>04</div>
                        <div className="step-icon" style={{ marginBottom: '15px' }}><Bus size={40} color="var(--color-primary)" /></div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Más Buses en Ruta</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Se despachan vehículos adicionales en la ruta congestionada, reduciendo tiempos de espera.</p>
                    </motion.div>
                </motion.div>
            </section>

            <section className="section" id="dashboard" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="section-header reveal">
                    <span className="section-tag">Dashboard en Vivo</span>
                    <h2>Monitoreo <span className="text-gradient" style={{ color: '#ff4500' }}>en tiempo real</span></h2>
                    <p className="section-desc">Visualiza el estado actual de los recorridos de transporte público en Cerrillos.</p>
                </div>
                <div className="dashboard-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><BarChart3 size={20} color="var(--color-primary)" /> Tiempos de espera</h3>
                        <div className="selector-recorrido" style={{ marginBottom: '20px', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '12px', width: 'fit-content' }}>
                            {['I14', 'I18', 'I01'].map(r => (
                                <button key={r} className={`btn-micro ${recorridoActivo === r ? 'active' : ''}`} onClick={() => setRecorridoActivo(r)} style={{ background: recorridoActivo === r ? 'var(--color-primary)' : 'transparent', color: recorridoActivo === r ? 'white' : 'var(--color-text-secondary)', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}>{r}</button>
                            ))}
                        </div>
                        <div style={{ position: 'relative', height: '250px' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card">
                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Route size={20} color="var(--color-primary)" /> Estado de Servicios</span>
                            <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} className="btn-micro" onClick={actualizarEstadoServicios} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><RefreshCw size={16} color="white" /></motion.button>
                        </h3>
                        <div className="status-list" style={{ marginTop: '20px' }}>
                            {serviceStatuses.map(s => (
                                <motion.div key={s.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="status-item" style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-glass-border)' }}>
                                    <div className="status-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Bus size={18} color="var(--color-primary)" /><span style={{ fontWeight: 600 }}>Recorrido {s.id}</span></div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', background: s.class === 'badge-green' ? 'rgba(76, 175, 80, 0.15)' : s.class === 'badge-yellow' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(244, 67, 54, 0.15)', color: s.class === 'badge-green' ? '#4caf50' : s.class === 'badge-yellow' ? '#ff9800' : '#f44336' }}>
                                        {s.icon} {s.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="alerts" style={{ background: 'rgba(255, 152, 0, 0.1)', borderLeft: '3px solid #ff9800', padding: '12px 15px', borderRadius: '4px', margin: '20px 0', display: 'flex', gap: '10px' }}>
                            <AlertTriangle size={20} color="#ff9800" style={{ flexShrink: 0 }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Alerta:</strong> Desvío en Av. Pedro Aguirre Cerda por trabajos en la vía.</p>
                        </div>
                        <p className="last-update" style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Última actualización: <span>{lastUpdate}</span></p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="card card-protocol">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={20} color="var(--color-primary)" /> Protocolo de Alerta</h3>
                        <div className="protocol-visual" style={{ marginTop: '25px' }}>
                            <div className="protocol-paradero" style={{ background: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--color-glass-border)' }}>
                                <div className="paradero-label" style={{ fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="var(--color-text-secondary)" /> Paradero Av. Lo Errázuriz</div>
                                <div className="people-counter" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'baseline', gap: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                    <Users size={30} color="var(--color-primary)" />
                                    <motion.span animate={{ scale: isSimulating ? [1, 1.1, 1] : 1 }} transition={{ repeat: isSimulating ? Infinity : 0, duration: 0.5 }} className="people-count">{peopleCount}</motion.span>
                                    <span className="people-max" style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>/ 20 máx</span>
                                </div>
                                <div className="progress-bar-container" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '12px', margin: '20px 0', overflow: 'hidden' }}>
                                    <motion.div animate={{ width: `${peopleBar}%`, backgroundColor: peopleBar >= 75 ? '#f44336' : '#ff4500' }} transition={{ duration: 0.3 }} style={{ height: '100%', borderRadius: '10px' }}></motion.div>
                                </div>
                                <div className="protocol-status" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: protocolStatus.class === 'protocol-normal' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)', color: protocolStatus.class === 'protocol-normal' ? '#4caf50' : '#f44336', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {protocolStatus.icon} {protocolStatus.text}
                                </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,69,0,0.4)' }} whileTap={{ scale: 0.98 }} className="btn-primary btn-full" onClick={simularProtocolo} disabled={isSimulating} style={{ opacity: isSimulating ? 0.5 : 1, padding: '15px' }}>
                                <RefreshCw size={18} className={isSimulating ? "fa-spin" : ""} /> {isSimulating ? 'Simulando...' : 'Simular Hora Pico'}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="section" id="reportes">
                <div className="section-header reveal">
                    <span className="section-tag">Reportes Ciudadanos</span>
                    <h2>Sistema de <span className="text-gradient" style={{ color: '#ff4500' }}>reportes en tiempo real</span></h2>
                    <p className="section-desc">Reporta problemas del transporte público y ayuda a mejorar el servicio.</p>
                </div>
                <div className="reportes-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><PenSquare size={20} color="var(--color-primary)" /> Nuevo Reporte</h3>
                        <form onSubmit={enviarReporte}>
                            <div className="form-group">
                                <label htmlFor="reportType" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={16} /> Tipo de problema</label>
                                <select id="reportType" name="reportType" required style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <option value="">Selecciona...</option>
                                    <option value="retraso">🕐 Retraso excesivo</option>
                                    <option value="saturacion">👥 Bus saturado</option>
                                    <option value="no-paso">🚫 Bus no pasó</option>
                                    <option value="seguridad">⚠️ Problema de seguridad</option>
                                    <option value="infraestructura">🔧 Paradero en mal estado</option>
                                    <option value="conductor">🚗 Conducción peligrosa</option>
                                    <option value="otro">📝 Otro</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reportRoute" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Route size={16} /> Recorrido</label>
                                <select id="reportRoute" name="reportRoute" required style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <option value="">Selecciona...</option>
                                    <option value="I14">I14</option>
                                    <option value="I18">I18</option>
                                    <option value="I01">I01</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reportLocation" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Ubicación / Paradero</label>
                                <input type="text" id="reportLocation" name="reportLocation" placeholder="Ej: Av. Lo Errázuriz con P.A.C" required style={{ background: 'rgba(0,0,0,0.3)' }} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reportDesc" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={16} /> Descripción</label>
                                <textarea id="reportDesc" name="reportDesc" rows="3" placeholder="Describe el problema..." required style={{ background: 'rgba(0,0,0,0.3)', resize: 'none' }}></textarea>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary btn-full" style={{ marginTop: '10px' }}><Send size={18} /> Enviar Reporte</motion.button>
                        </form>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <MessageSquare size={20} color="var(--color-primary)" /> Reportes Recientes 
                            <span className="report-count" style={{ background: 'var(--color-primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', marginLeft: 'auto' }}>{listaReportes.length}</span>
                        </h3>
                        <div className="reports-filter" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '12px' }}>
                            {['todos', 'retraso', 'saturacion', 'seguridad'].map(f => (
                                <button key={f} onClick={() => setFiltroReporte(f)} style={{ background: filtroReporte === f ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: filtroReporte === f ? 'white' : 'var(--color-text-secondary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                            ))}
                        </div>
                        <div className="reports-list" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                            {reportesFiltrados.length === 0 ? (
                                <div className="empty-reports" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '40px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                    <MessageSquare size={40} style={{ opacity: 0.5, marginBottom: '15px' }} />
                                    <p>No hay reportes aún. ¡Sé el primero en reportar!</p>
                                </div>
                            ) : (
                                reportesFiltrados.map((r, i) => (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={r.id} className="report-item" style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderLeft: '4px solid var(--color-primary)', borderRadius: '12px', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <strong style={{ color: 'white' }}>{r.tipo.toUpperCase()}</strong>
                                            <small style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{r.ruta}</small>
                                        </div>
                                        <p style={{ margin: '5px 0', color: '#e2e8f0' }}>"{r.desc}"</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {r.loc}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {new Date(r.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="section" id="saldo" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="section-header reveal">
                    <span className="section-tag">Consulta tu Saldo</span>
                    <h2>Saldo de <span className="text-gradient" style={{ color: '#ff4500' }}>tarjeta BIP!</span></h2>
                    <p className="section-desc">Consulta el saldo real de tu tarjeta BIP! ingresando el número.</p>
                </div>
                <div className="saldo-container reveal" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="card saldo-card" style={{ padding: '40px' }}>
                        <div className="saldo-form" style={{ marginBottom: '30px' }}>
                            <div className="form-group" style={{ textAlign: 'left', marginBottom: 0 }}>
                                <label htmlFor="bipNumber" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '10px' }}><CreditCard size={20} color="var(--color-primary)" /> Número de tarjeta BIP!</label>
                                <div className="input-with-btn" style={{ display: 'flex', gap: '10px' }}>
                                    <input type="text" id="bipNumber" value={bipNumber} onChange={(e) => setBipNumber(e.target.value)} placeholder="Ej: 12345678" maxLength="8" style={{ flex: 1, fontSize: '1.1rem', background: 'rgba(0,0,0,0.3)', padding: '15px' }} />
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" className="btn-primary" onClick={consultarSaldo} style={{ padding: '0 25px' }}><Search size={20} /></motion.button>
                                </div>
                            </div>
                        </div>
                        
                        {saldoResult && !saldoError && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="saldo-result" style={{ textAlign: 'left' }}>
                                <div className="saldo-info-grid" style={{ display: 'grid', gap: '20px' }}>
                                    <div className="saldo-main" style={{ background: 'rgba(0,0,0,0.4)', padding: '25px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span className="saldo-label" style={{ display: 'block', color: 'var(--color-text-secondary)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Saldo Disponible</span>
                                        <span className="saldo-amount" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>${saldoResult.saldo.toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="saldo-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="saldo-detail" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <CalendarPlus size={24} color="var(--color-primary)" />
                                            <div>
                                                <span className="detail-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Última Carga</span>
                                                <span className="detail-value" style={{ color: 'white', fontWeight: 600 }}>{saldoResult.ultimaCarga}</span>
                                            </div>
                                        </div>
                                        <div className="saldo-detail" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Bus size={24} color="var(--color-primary)" />
                                            <div>
                                                <span className="detail-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Último Viaje</span>
                                                <span className="detail-value" style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{saldoResult.ultimoViaje.split(' ')[0]}</span>
                                            </div>
                                        </div>
                                        <div className="saldo-detail" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Banknote size={24} color="var(--color-primary)" />
                                            <div>
                                                <span className="detail-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Costo Viaje</span>
                                                <span className="detail-value" style={{ color: 'white', fontWeight: 600 }}>${saldoResult.costoViaje}</span>
                                            </div>
                                        </div>
                                        <div className="saldo-detail" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Hash size={24} color="var(--color-primary)" />
                                            <div>
                                                <span className="detail-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Viajes Mes</span>
                                                <span className="detail-value" style={{ color: 'white', fontWeight: 600 }}>{saldoResult.viajesMes}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {saldoError && (
                            <div className="saldo-error" style={{ color: '#f44336', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <AlertTriangle size={18} />
                                <p style={{ margin: 0 }}>Tarjeta no encontrada. Verifica el número.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="section" id="mapa-section">
                <div className="section-header reveal">
                    <span className="section-tag">Ubicación</span>
                    <h2>Mapa de <span className="text-gradient" style={{ color: '#ff4500' }}>Cerrillos</span></h2>
                </div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mapa-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="paraderos-list" style={{ background: 'var(--color-glass)', padding: '25px', borderRadius: 'var(--radius)', border: '1px solid var(--color-glass-border)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><MapPin size={20} color="var(--color-primary)" /> Paraderos Clave</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div className="paradero-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f44336', marginTop: '6px', boxShadow: '0 0 10px #f44336' }}></span>
                                <div>
                                    <strong style={{ display: 'block', color: 'white' }}>Av. Lo Errázuriz</strong>
                                    <small style={{ color: 'var(--color-text-secondary)' }}>Alta demanda — I14</small>
                                </div>
                            </div>
                            <div className="paradero-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff9800', marginTop: '6px', boxShadow: '0 0 10px #ff9800' }}></span>
                                <div>
                                    <strong style={{ display: 'block', color: 'white' }}>Av. Departamental</strong>
                                    <small style={{ color: 'var(--color-text-secondary)' }}>Demanda media — I01</small>
                                </div>
                            </div>
                            <div className="paradero-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4caf50', marginTop: '6px', boxShadow: '0 0 10px #4caf50' }}></span>
                                <div>
                                    <strong style={{ display: 'block', color: 'white' }}>Costanera Sur</strong>
                                    <small style={{ color: 'var(--color-text-secondary)' }}>Demanda normal</small>
                                </div>
                            </div>
                            <div className="paradero-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f44336', marginTop: '6px', boxShadow: '0 0 10px #f44336' }}></span>
                                <div>
                                    <strong style={{ display: 'block', color: 'white' }}>Metro Cerrillos</strong>
                                    <small style={{ color: 'var(--color-text-secondary)' }}>Alta demanda</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '5px', background: 'var(--color-glass)', borderRadius: 'var(--radius)', border: '1px solid var(--color-glass-border)', height: '400px', overflow: 'hidden', position: 'relative' }}>
                        <MapContainer center={[-33.4939, -70.7483]} zoom={14} style={{ height: '100%', width: '100%', borderRadius: '12px' }} zoomControl={false}>
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {/* Paraderos */}
                            <CircleMarker center={[-33.4939, -70.7483]} radius={8} pathOptions={{ color: '#f44336', fillColor: '#f44336', fillOpacity: 0.8 }}>
                                <Popup><div style={{color: 'black'}}><strong>Av. Lo Errázuriz</strong><br/>Alta demanda — I14</div></Popup>
                            </CircleMarker>
                            <CircleMarker center={[-33.4850, -70.7350]} radius={8} pathOptions={{ color: '#ff9800', fillColor: '#ff9800', fillOpacity: 0.8 }}>
                                <Popup><div style={{color: 'black'}}><strong>Av. Departamental</strong><br/>Demanda media — I01</div></Popup>
                            </CircleMarker>
                            <CircleMarker center={[-33.5020, -70.7600]} radius={8} pathOptions={{ color: '#4caf50', fillColor: '#4caf50', fillOpacity: 0.8 }}>
                                <Popup><div style={{color: 'black'}}><strong>Costanera Sur</strong><br/>Demanda normal</div></Popup>
                            </CircleMarker>
                            <CircleMarker center={[-33.5002, -70.7188]} radius={8} pathOptions={{ color: '#f44336', fillColor: '#f44336', fillOpacity: 0.8 }}>
                                <Popup><div style={{color: 'black'}}><strong>Metro Cerrillos</strong><br/>Alta demanda</div></Popup>
                            </CircleMarker>

                            {/* Buses Simulación */}
                            <CircleMarker center={[-33.4900, -70.7400]} radius={6} pathOptions={{ color: '#2196f3', fillColor: '#2196f3', fillOpacity: 1 }}>
                                <Popup><div style={{color: 'black'}}><Bus size={12}/> Bus I14 - En tránsito</div></Popup>
                            </CircleMarker>
                        </MapContainer>
                    </div>
                </motion.div>
            </section>
        </>
    );
}
