import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, ShieldAlert } from 'lucide-react';

export default function Navbar() {
    const [navActive, setNavActive] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const toggleNav = () => setNavActive(!navActive);
    const handleLinkClick = () => setNavActive(false);

    const isHome = location.pathname === '/';

    return (
        <nav id="navbar" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div className="logo" style={{ zIndex: 10 }}>
                <Link to="/" onClick={handleLinkClick} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: 'white', gap: '10px' }}>
                    <div style={{ background: 'var(--color-primary)', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255,69,0,0.5)' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>M</span>
                    </div>
                    <span style={{ letterSpacing: '1px' }}>MOVICERRI</span>
                </Link>
            </div>
            
            <div className="nav-toggle" id="navToggle" onClick={toggleNav} style={{ cursor: 'pointer', zIndex: 10 }}>
                {navActive ? <X size={28} /> : <Menu size={28} />}
            </div>
            
            <ul id="navMenu" className={navActive ? 'nav-active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {isHome ? (
                    <>
                        <li><a href="#top" onClick={handleLinkClick}>INICIO</a></li>
                        <li><a href="#dashboard" onClick={handleLinkClick}>DASHBOARD</a></li>
                        <li><a href="#reportes" onClick={handleLinkClick}>REPORTES</a></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/#top" onClick={handleLinkClick}>INICIO</Link></li>
                        <li><Link to="/#dashboard" onClick={handleLinkClick}>DASHBOARD</Link></li>
                        <li><Link to="/#reportes" onClick={handleLinkClick}>REPORTES</Link></li>
                    </>
                )}

                {user && user.role === 'admin' && (
                    <li>
                        <Link to="/admin" onClick={handleLinkClick} style={location.pathname === '/admin' ? { color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px' } : { display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ShieldAlert size={16} /> ADMIN
                        </Link>
                    </li>
                )}

                {!user ? (
                    <li>
                        <Link to="/login" onClick={handleLinkClick} className="btn-primary" style={{ padding: '8px 15px', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '0.9rem' }}>
                            Ingresar
                        </Link>
                    </li>
                ) : (
                    <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to="/sesion" onClick={handleLinkClick} style={location.pathname === '/sesion' ? { color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px' } : { display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <User size={16} /> MI CUENTA
                        </Link>
                        <button onClick={() => { logout(); handleLinkClick(); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LogOut size={16} /> Salir
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
