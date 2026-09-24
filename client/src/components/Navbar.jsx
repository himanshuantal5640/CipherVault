import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Cpu, 
  Key, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Menu, 
  X,
  Layers,
  Zap,
  Code
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const scrollToAnchor = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-vault-border/80 bg-vault-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: VaultX Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan group-hover:bg-vault-cyan/20 transition-all duration-300 shadow-glow-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1 font-mono">
                Vault<span className="text-vault-cyan font-black">X</span>
              </span>
              <span className="text-[9px] text-vault-muted font-mono tracking-widest uppercase -mt-1">
                Zero-Trust Vault
              </span>
            </div>
          </Link>

          {/* Center: Navigation Anchors */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono">
            <button
              onClick={() => scrollToAnchor('how-it-works')}
              className="text-slate-400 hover:text-vault-cyan transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToAnchor('architecture')}
              className="text-slate-400 hover:text-vault-cyan transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToAnchor('security-features')}
              className="text-slate-400 hover:text-vault-cyan transition-colors"
            >
              Security
            </button>
            <button
              onClick={() => scrollToAnchor('technology')}
              className="text-slate-400 hover:text-vault-cyan transition-colors"
            >
              Technology
            </button>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive('/dashboard') 
                      ? 'text-vault-cyan bg-vault-cyan/10 border border-vault-cyan/30 font-bold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                <Link
                  to="/security"
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive('/security') 
                      ? 'text-vault-cyan bg-vault-cyan/10 border border-vault-cyan/30 font-bold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Security Center
                </Link>
              </>
            )}
          </nav>

          {/* Right: Auth Action CTAs */}
          <div className="hidden md:flex items-center space-x-3 font-mono text-xs">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
                  <User className="w-3.5 h-3.5 text-vault-cyan" />
                  <span className="max-w-[140px] truncate">{user?.email}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700 hover:border-slate-500 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-vault-cyan to-vault-indigo text-slate-950 hover:brightness-110 shadow-glow-cyan transition-all flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-vault-border px-4 pt-3 pb-6 space-y-3 font-mono text-xs">
          <button
            onClick={() => scrollToAnchor('how-it-works')}
            className="block w-full text-left py-2 text-slate-300 hover:text-vault-cyan"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToAnchor('architecture')}
            className="block w-full text-left py-2 text-slate-300 hover:text-vault-cyan"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollToAnchor('security-features')}
            className="block w-full text-left py-2 text-slate-300 hover:text-vault-cyan"
          >
            Security Features
          </button>
          <button
            onClick={() => scrollToAnchor('technology')}
            className="block w-full text-left py-2 text-slate-300 hover:text-vault-cyan"
          >
            Technology Stack
          </button>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-vault-cyan font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Vault Dashboard
                </Link>
                <Link
                  to="/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-slate-300"
                >
                  <Cpu className="w-4 h-4" />
                  Security Center
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 py-2 text-red-400 font-bold w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout ({user?.email})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl border border-slate-700 text-slate-200 font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-vault-cyan text-slate-950 font-bold shadow-glow-cyan"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
