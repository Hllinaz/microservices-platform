import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaEllipsisV, FaLayerGroup, FaChartLine, FaMicrochip, FaTerminal, FaDatabase, FaSlidersH, FaHome } from 'react-icons/fa';
import styles from './sidebar.module.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles['sidebar-top']}>
                <button className={styles['menu-trigger']} onClick={() => setIsCollapsed(!isCollapsed)}>
                    <FaEllipsisV />
                </button>
                <div className={styles['logo-area']}>
                    <FaLayerGroup />
                    <span className={styles['nav-text']}>System<span style={{ color: 'white' }}>Core</span></span>
                </div>
            </div>

            <nav className={styles['main-nav']}>
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `${styles['nav-link']} ${isActive ? styles.active : ''}`
                    }
                >
                    <FaHome className={styles['nav-icon']} />
                    <span className={styles['nav-text']}>Home</span>
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `${styles['nav-link']} ${isActive ? styles.active : ''}`
                    }
                >
                    <FaChartLine className={styles['nav-icon']} />
                    <span className={styles['nav-text']}>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/instancias"
                    className={({ isActive }) =>
                        `${styles['nav-link']} ${isActive ? styles.active : ''}`
                    }
                >
                    <FaMicrochip className={styles['nav-icon']} />
                    <span className={styles['nav-text']}>Instancias</span>
                </NavLink>

                <NavLink
                    to="/consola"
                    className={({ isActive }) =>
                        `${styles['nav-link']} ${isActive ? styles.active : ''}`
                    }
                >
                    <FaTerminal className={styles['nav-icon']} />
                    <span className={styles['nav-text']}>Consola</span>
                </NavLink>

                <NavLink
                    to="/clusters"
                    className={({ isActive }) =>
                        `${styles['nav-link']} ${isActive ? styles.active : ''}`
                    }
                >
                    <FaDatabase className={styles['nav-icon']} />
                    <span className={styles['nav-text']}>Clusters</span>
                </NavLink>

                <div className={styles.spacer}></div>

                <NavLink
                    to="/ajustes"
                    className={({ isActive }) =>
                        `${styles['nav-link']} ${isActive ? styles.active : ''}`
                    }
                >
                    <FaSlidersH className={styles['nav-icon']} />
                    <span className={styles['nav-text']}>Ajustes</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;