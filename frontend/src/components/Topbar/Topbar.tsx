import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './Topbar.module.css';

interface TopbarProps {
    onSearch?: (query: string) => void;
    clusterStatus?: 'active' | 'inactive';
}

const Topbar: React.FC<TopbarProps> = ({
    onSearch,
    clusterStatus = 'active',
}) => {
    const [query, setQuery] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Filtrar servicios activos..."
                    value={query}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.rightSection}>
                <div className={styles.clusterBadge}>
                    <span className={`${styles.statusDot} ${clusterStatus === 'active' ? styles.dotActive : styles.dotInactive}`} />
                    <span className={styles.clusterLabel}>
                        Cluster: {clusterStatus === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;