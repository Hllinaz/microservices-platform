import { useState } from 'react';
import { FaTimes, FaPython, FaNodeJs } from 'react-icons/fa';
import styles from './ServiceModal.module.css';

interface Service {
    id: string;
    name: string;
    description: string;
    language: 'python' | 'node';
    code: string;
}

interface Props {
    mode: 'create' | 'edit';
    service?: Service;
    onClose: () => void;
    onSubmit: (payload: any) => Promise<void>;
}

const EXAMPLES = {
    python: `# Hola Mundo
result = "Hola Mundo desde Python"`,
    node: `// Hola Mundo
result = "Hola Mundo desde Node.js"`,
};

export default function ServiceModal({ mode, service, onClose, onSubmit }: Props) {
    const [name, setName]               = useState(service?.name ?? '');
    const [description, setDescription] = useState(service?.description ?? '');
    const [language, setLanguage]       = useState<'python' | 'node'>(service?.language ?? 'python');
    const [code, setCode]               = useState(service?.code ?? EXAMPLES.python);
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState<string | null>(null);

    const handleLangChange = (lang: 'python' | 'node') => {
        setLanguage(lang);
        if (!service) setCode(EXAMPLES[lang]);
    };

    const handleSubmit = async () => {
        if (!name.trim())  return setError('El nombre es obligatorio.');
        if (!code.trim())  return setError('El código es obligatorio.');
        setLoading(true);
        setError(null);
        try {
            await onSubmit({ name: name.trim(), description: description.trim(), language, code });
            onClose();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div>
                        <h2 className={styles.modalTitle}>
                            {mode === 'create' ? 'Nuevo Microservicio' : 'Editar Microservicio'}
                        </h2>
                        <p className={styles.modalSub}>
                            {mode === 'create'
                                ? 'Pega tu código y configura el servicio'
                                : `Editando: ${service?.name}`}
                        </p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* Name */}
                    <div className={styles.field}>
                        <label className={styles.label}>Nombre <span className={styles.required}>*</span></label>
                        <input
                            className={styles.input}
                            placeholder="ej: auth-api-manager"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={mode === 'edit'}
                        />
                    </div>

                    {/* Description */}
                    <div className={styles.field}>
                        <label className={styles.label}>Descripción</label>
                        <input
                            className={styles.input}
                            placeholder="Descripción breve del servicio"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Language */}
                    <div className={styles.field}>
                        <label className={styles.label}>Lenguaje <span className={styles.required}>*</span></label>
                        <div className={styles.langRow}>
                            <button
                                className={`${styles.langBtn} ${language === 'python' ? styles.langActive : ''}`}
                                onClick={() => handleLangChange('python')}
                                disabled={mode === 'edit'}
                            >
                                <FaPython /> Python
                            </button>
                            <button
                                className={`${styles.langBtn} ${language === 'node' ? styles.langActive : ''}`}
                                onClick={() => handleLangChange('node')}
                                disabled={mode === 'edit'}
                            >
                                <FaNodeJs /> Node.js
                            </button>
                        </div>
                    </div>

                    {/* Code */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Código <span className={styles.required}>*</span>
                            <span className={styles.labelHint}>— asigna el resultado a la variable <code>result</code></span>
                        </label>
                        <textarea
                            className={styles.codeArea}
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            rows={10}
                            spellCheck={false}
                        />
                    </div>

                    {error && <div className={styles.errorMsg}>{error}</div>}
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                        {loading
                            ? 'Procesando...'
                            : mode === 'create' ? 'Crear servicio' : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
}