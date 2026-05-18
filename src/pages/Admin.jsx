import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShieldAlert, BarChart3, Users, Bus, AlertTriangle, MessageSquare, MapPin, Clock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Admin() {
    const { user, loading } = useAuth();
    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        const raw = localStorage.getItem('movicerri_reportes');
        if (raw) {
            try { setReportes(JSON.parse(raw)); } catch (e) { setReportes([]); }
        }
    }, []);

    if (loading) return null;
    
    // Protect route: Only 'admin' role can access
    if (!user || user.role !== 'admin') {
        return <Navigate to="/sesion" replace />;
    }

    const chartData = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
            {
                label: 'Reportes Recibidos',
                data: [12, 19, 15, 25, 22, 10, 5],
                backgroundColor: 'rgba(255, 69, 0, 0.6)',
                borderColor: '#ff4500',
                borderWidth: 1,
            },
            {
                label: 'Aglomeraciones Detectadas',
                data: [8, 15, 10, 20, 18, 5, 2],
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: '#4caf50',
                borderWidth: 1,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        },
        plugins: {
            legend: { labels: { color: '#f8fafc' } }
        }
    };

    return (
        <section className="section">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section-header reveal"
            >
                <span className="section-tag" style={{ background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }}>Acceso Restringido</span>
                <h2>Panel de <span className="text-gradient" style={{ color: '#ff4500' }}>Administración</span></h2>
                <p className="section-desc">Sala de control municipal MoviCerri</p>
            </motion.div>

            <div className="dashboard-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,69,0,0.1)', padding: '20px', borderRadius: '16px' }}><ShieldAlert size={40} color="var(--color-primary)" /></div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '2rem' }}>14</h3>
                        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Alertas Activas</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(76,175,80,0.1)', padding: '20px', borderRadius: '16px' }}><Bus size={40} color="#4caf50" /></div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '2rem' }}>42</h3>
                        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Buses en Ruta</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(33,150,243,0.1)', padding: '20px', borderRadius: '16px' }}><Users size={40} color="#2196f3" /></div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '2rem' }}>1,204</h3>
                        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Pasajeros Hora Actual</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><BarChart3 size={20} color="var(--color-primary)" /> Estadísticas de Demanda Semanal</h3>
                    <Bar data={chartData} options={chartOptions} height={100} />
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}><MessageSquare size={20} color="var(--color-primary)" /> Reportes Ciudadanos ({reportes.length})</h3>
                    <div style={{ overflowY: 'auto', flex: 1, maxHeight: '300px', paddingRight: '10px' }}>
                        {reportes.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '40px' }}>Sin reportes recientes.</p>
                        ) : (
                            reportes.map((r, i) => (
                                <div key={r.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '10px', borderLeft: r.tipo === 'seguridad' ? '3px solid #f44336' : '3px solid var(--color-primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <strong style={{ color: r.tipo === 'seguridad' ? '#f44336' : 'white', fontSize: '0.9rem' }}>{r.tipo.toUpperCase()}</strong>
                                        <small style={{ color: 'var(--color-primary)' }}>{r.ruta}</small>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: '5px 0' }}>{r.desc}</p>
                                    <small style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}><MapPin size={10} /> {r.loc}</small>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
