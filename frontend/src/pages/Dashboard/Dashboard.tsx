import { useState, useEffect, useCallback } from 'react';
import Topbar from '../../components/Topbar/Topbar';
import ServiceModal from '../../components/ServiceModal/ServiceModal';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import styles from './Dashboard.module.css';
import {
    FaPlay, FaStop, FaTrash, FaTerminal, FaPlus,
    FaPython, FaNodeJs, FaCircle, FaSyncAlt, FaEdit
} from 'react-icons/fa';

const API = 'http://localhost:5000';

type Status = 'created' | 'running' | 'stopped' | 'removed';

interface Service {
    id: string;
    name: string;
    description: string;
    language: 'python' | 'node';
    port: number;
    status: Status;
    containerId: string | null;
    createdAt: string;
    code: string;
}

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
    created: { label: 'Creado', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
    running: { label: 'Activo', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    stopped: { label: 'Detenido', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    removed: { label: 'Eliminado', color: '#e53935', bg: 'rgba(229,57,53,0.1)' },
};

function ServiceCard({
    service, onStatusChange, onEdit, onDelete, loading,
}: {
    service: Service;
    onStatusChange: (id: string, status: Status) => void;
    onEdit: (service: Service) => void;
    onDelete: (service: Service) => void;
    loading: boolean;
}) {
    const cfg = statusConfig[service.status];
    const langIcon = service.language === 'python'
        ? <FaPython style={{ color: '#3b82f6' }} />
        : <FaNodeJs style={{ color: '#4ade80' }} />;

    return (
        <div className={`${styles.card} ${loading ? styles.cardLoading : ''}`}>
            <div className={styles.cardHeader}>
                <div className={styles.cardLang}>{langIcon}</div>
                <div className={styles.cardMeta}>
                    <span className={styles.cardName}>{service.name}</span>
                    <span className={styles.cardDesc}>{service.description || 'Sin descripción'}</span>
                </div>
                <div className={styles.cardStatus} style={{ color: cfg.color, background: cfg.bg }}>
                    <FaCircle style={{ fontSize: '0.5rem' }} />
                    {cfg.label}
                </div>
            </div>

            <div className={styles.cardInfo}>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Puerto</span>
                    <span className={styles.infoValue}>:{service.port}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Lenguaje</span>
                    <span className={styles.infoValue}>{service.language}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>ID</span>
                    <span className={styles.infoValue}>{service.id.slice(0, 8)}...</span>
                </div>
            </div>

            <div className={styles.cardActions}>
                {(service.status === 'created' || service.status === 'stopped') && (
                    <button className={`${styles.btn} ${styles.btnPlay}`}
                        onClick={() => onStatusChange(service.id, 'running')}
                        disabled={loading} title="Iniciar">
                        <FaPlay />
                    </button>
                )}
                {service.status === 'running' && (
                    <button className={`${styles.btn} ${styles.btnStop}`}
                        onClick={() => onStatusChange(service.id, 'stopped')}
                        disabled={loading} title="Detener">
                        <FaStop />
                    </button>
                )}
                {service.status === 'running' && (
                    <a className={`${styles.btn} ${styles.btnConsole}`}
                        href={`http://localhost:${service.port}`}
                        target="_blank" rel="noreferrer" title="Abrir endpoint">
                        <FaTerminal />
                    </a>
                )}
                {service.status !== 'removed' && (
                    <button className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => onEdit(service)}
                        disabled={loading} title="Editar">
                        <FaEdit />
                    </button>
                )}
                {service.status !== 'removed' && (
                    <button className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => onDelete(service)}
                        disabled={loading} title="Eliminar">
                        <FaTrash />
                    </button>
                )}
                {loading && <FaSyncAlt className={styles.spinner} />}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [services, setServices] = useState<Service[]>([]);
    const [fetching, setFetching] = useState(true);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState<Service | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
    const [search, setSearch] = useState('');

    const fetchServices = useCallback(async () => {
        try {
            const res = await fetch(`${API}/services`);
            const data = await res.json();
            setServices(data.services.filter((s: Service) => s.status !== 'removed'));
        } catch {
            setError('No se pudo conectar con el backend.');
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { fetchServices(); }, [fetchServices]);

    const changeStatus = async (id: string, status: Status) => {
        setLoadingId(id);
        try {
            const res = await fetch(`${API}/services/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            setServices(prev =>
                status === 'removed'
                    ? prev.filter(s => s.id !== id)
                    : prev.map(s => s.id === id ? { ...s, status } : s)
            );
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleCreate = async (payload: { name: string; description: string; language: string; code: string }) => {
        const res = await fetch(`${API}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setServices(prev => [data.service, ...prev]);
    };

    const handleEdit = async (id: string, payload: {
        description: string;
        code: string;
    }) => {

        const res = await fetch(`${API}/services/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setServices(prev =>
            prev.map(s =>
                s.id === id ? { ...s, ...payload } : s
            )
        );
    };

    const filtered = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const runningCount = services.filter(s => s.status === 'running').length;
    const stoppedCount = services.filter(s => s.status === 'stopped').length;
    const createdCount = services.filter(s => s.status === 'created').length;

    return (
        <div className={styles.page}>
            <Topbar clusterStatus="active" onSearch={setSearch} />

            <div className={styles.content}>
                <div className={styles.titleRow}>
                    <div>
                        <h1 className={styles.title}>Microservicios</h1>
                        <p className={styles.subtitle}>
                            {services.length} servicios &mdash;{' '}
                            <span style={{ color: '#22c55e' }}>{runningCount} activos</span>,{' '}
                            <span style={{ color: '#f59e0b' }}>{stoppedCount} detenidos</span>,{' '}
                            <span style={{ color: '#94a3b8' }}>{createdCount} creados</span>
                        </p>
                    </div>
                    <button className={styles.btnCreate} onClick={() => setShowCreate(true)}>
                        <FaPlus /> Desplegar
                    </button>
                </div>

                {error && (
                    <div className={styles.errorBanner}>
                        {error}
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                {fetching ? (
                    <div className={styles.empty}>Cargando servicios...</div>
                ) : filtered.length === 0 ? (
                    <div className={styles.empty}>
                        {search ? `Sin resultados para "${search}"` : 'No hay microservicios. ¡Crea el primero!'}
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filtered.map(s => (
                            <ServiceCard key={s.id} service={s}
                                onStatusChange={changeStatus}
                                onEdit={setEditTarget}
                                onDelete={setDeleteTarget}
                                loading={loadingId === s.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showCreate && (
                <ServiceModal mode="create"
                    onClose={() => setShowCreate(false)}
                    onSubmit={handleCreate} />
            )}
            {editTarget && (
                <ServiceModal mode="edit" service={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSubmit={async (payload) => {
                        await handleEdit(editTarget.id, payload);
                        setEditTarget(null)
                    }} />
            )}
            {deleteTarget && (
                <DeleteModal service={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={async () => {
                        await changeStatus(deleteTarget.id, 'removed');
                        setDeleteTarget(null);
                    }} />
            )}
        </div>
    );
}