import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer>
            <div className="footer-grid">
                <div className="footer-col">
                    <h4><img src="/favicon.png" alt="Logo" style={{ height: '24px', verticalAlign: 'middle' }} /> MOVICERRI</h4>
                    <p>Solución inteligente para el transporte público de Cerrillos. Proyecto estudiantil que utiliza IA para mejorar la movilidad urbana.</p>
                </div>
                <div className="footer-col">
                    <h4>Links Rápidos</h4>
                    <Link to="/#top">Inicio</Link>
                    <Link to="/#problema">El Problema</Link>
                    <Link to="/#solucion">Solución</Link>
                    <Link to="/#dashboard">Dashboard</Link>
                    <Link to="/#reportes">Reportes</Link>
                </div>
                <div className="footer-col">
                    <h4>Recursos</h4>
                    <Link to="/#saldo">Saldo BIP!</Link>
                    <Link to="/#mapa-section">Mapa</Link>
                    <Link to="/soporte">Soporte</Link>
                    <Link to="/sesion">Mi Cuenta</Link>
                </div>
                <div className="footer-col">
                    <h4>Contacto</h4>
                    <p><i className="fas fa-envelope"></i> contacto@movicerri.cl</p>
                    <p><i className="fas fa-map-marker-alt"></i> Cerrillos, Santiago, Chile</p>
                    <div className="social-links">
                        <a href="https://instagram.com/m.vlejandroo" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="https://github.com/mrivbss" target="_blank" rel="noopener noreferrer" title="GitHub"><i className="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 MOVICERRI — Proyecto Estudiantil, Comuna de Cerrillos</p>
            </div>
        </footer>
    );
}
