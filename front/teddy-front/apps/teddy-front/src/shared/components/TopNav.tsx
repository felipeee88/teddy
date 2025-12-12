import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/auth.store';
import './TopNav.css';

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-logo">Teddy Open Finance</div>
          <div className="nav-links">
            <Link 
              to="/clients" 
              className={location.pathname === '/clients' ? 'active' : ''}
            >
              Clientes
            </Link>
            <Link 
              to="/selected-clients"
              className={location.pathname === '/selected-clients' ? 'active' : ''}
            >
              Clientes selecionados
            </Link>
          </div>
        </div>
        <div className="nav-right">
          <span className="user-greeting">Olá, {userName || 'Usuário'}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
