// Admin Layout Component
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Theme management
const getInitialTheme = (): 'dark' | 'light' => {
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }
    return 'dark'; // Default theme
};

export const AdminLayout: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const mainRef = useRef<HTMLElement>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Get user info from auth
    const currentAdmin = {
        name: user?.email?.split('@')[0] || 'Admin User',
        role: 'Admin',
        email: user?.email || '',
    };

    const getInitials = (name: string) => {
        return name
            .split(/[._-]/)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'AD';
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    // Handle scroll to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            if (mainRef.current) {
                setShowScrollTop(mainRef.current.scrollTop > 300);
            }
        };

        const mainElement = mainRef.current;
        if (mainElement) {
            mainElement.addEventListener('scroll', handleScroll);
            return () => mainElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToTop = () => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('admin-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <div className="admin-layout" data-theme={theme}>
            {/* Top Navigation */}
            <header className="admin-header">
                <div className="admin-header__brand">
                    <span className="admin-header__logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <div className="admin-header__title">
                        <h1>Citizen Services</h1>
                        <span className="admin-header__subtitle">Admin Panel</span>
                    </div>
                </div>

                <nav className="admin-header__nav">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
                        }
                    >
                        Analytics
                    </NavLink>
                    <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                            `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
                        }
                    >
                        Notifications
                    </NavLink>
                </nav>

                <div className="admin-header__user">
                    <div className="admin-header__user-info">
                        <span className="admin-header__user-name">{currentAdmin.name}</span>
                        <span className="admin-header__user-role">{currentAdmin.email}</span>
                    </div>
                    <div className="admin-header__avatar">
                        {getInitials(currentAdmin.name)}
                    </div>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="admin-header__theme-toggle"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="admin-header__logout"
                        title="Sign Out"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="admin-main" ref={mainRef}>
                <Outlet />
            </main>

            {/* Scroll to Top Button */}
            <button
                className={`scroll-to-top ${showScrollTop ? '' : 'hidden'}`}
                onClick={scrollToTop}
                title="Scroll to top"
            >
                ↑
            </button>
        </div>
    );
};
