import { useState } from 'react';
import { FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import styles from './DeleteModal.module.css';

interface Service { id: string; name: string; status: string; }

interface Props {
    service: Service;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteModal({ service, onClose, onConfirm }: Props) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.iconWrapper}>
                    <FaExclamationTriangle className={styles.icon} />
                </div>
                <h2 className={styles.title}>Eliminar microservicio</h2>
                <p className={styles.message}>
                    Estás a punto de eliminar <strong>{service.name}</strong>.
                    Esto detendrá el contenedor, eliminará la imagen Docker y borrará todos los archivos generados.
                </p>
                <p className={styles.warning}>Esta acción no se puede deshacer.</p>
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                        <FaTimes /> Cancelar
                    </button>
                    <button className={styles.deleteBtn} onClick={handleConfirm} disabled={loading}>
                        <FaTrash /> {loading ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}