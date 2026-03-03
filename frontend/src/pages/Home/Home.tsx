import React, { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';
import {
    FaDocker, FaReact, FaPython, FaNodeJs,
    FaRocket, FaNetworkWired, FaCogs, FaLayerGroup,
    FaCheckCircle, FaCode
} from 'react-icons/fa';
import { SiFlask, SiFastapi } from 'react-icons/si';

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 1200) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            let start = 0;
            const step = target / (duration / 16);
            const timer = setInterval(() => {
                start += step;
                if (start >= target) { setValue(target); clearInterval(timer); }
                else setValue(Math.floor(start));
            }, 16);
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);
    return { value, ref };
}

/* ── Architecture Diagram ── */
const ArchDiagram = () => {
    const [active, setActive] = useState<string | null>(null);

    const nodes = [
        { id: 'browser', label: 'Browser', sub: 'React + Vite', icon: <FaReact />, color: '#61dafb', x: 10, y: 38 },
        { id: 'backend', label: 'Backend', sub: 'API REST', icon: <FaPython />, color: '#e53935', x: 40, y: 38 },
        { id: 'docker', label: 'Docker Engine', sub: 'Orquestador', icon: <FaDocker />, color: '#2496ed', x: 70, y: 38 },
        { id: 'ms1', label: 'Microservicio A', sub: 'Python / Flask', icon: <SiFlask />, color: '#4ade80', x: 88, y: 15 },
        { id: 'ms2', label: 'Microservicio B', sub: 'Node.js', icon: <FaNodeJs />, color: '#f59e0b', x: 88, y: 38 },
        { id: 'ms3', label: 'Microservicio C', sub: 'FastAPI', icon: <SiFastapi />, color: '#a78bfa', x: 88, y: 61 },
    ];

    const edges = [
        { from: 'browser', to: 'backend' },
        { from: 'backend', to: 'docker' },
        { from: 'docker', to: 'ms1' },
        { from: 'docker', to: 'ms2' },
        { from: 'docker', to: 'ms3' },
    ];

    const getPos = (id: string) => nodes.find(n => n.id === id)!;

    return (
        <div className={styles.archWrapper}>
            <svg className={styles.archSvg} viewBox="0 0 100 76" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <marker id="arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                        <path d="M0,0 L0,4 L4,2 z" fill="#334155" />
                    </marker>
                    {nodes.map(n => (
                        <filter key={`glow-${n.id}`} id={`glow-${n.id}`}>
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    ))}
                </defs>

                {/* Edges */}
                {edges.map(({ from, to }) => {
                    const f = getPos(from); const t = getPos(to);
                    const isActive = active === from || active === to;
                    return (
                        <line key={`${from}-${to}`}
                            x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                            stroke={isActive ? '#e53935' : '#1e2a3a'}
                            strokeWidth={isActive ? '0.5' : '0.3'}
                            strokeDasharray={isActive ? 'none' : '1 1'}
                            markerEnd="url(#arrow)"
                            style={{ transition: 'all 0.3s' }}
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map(n => (
                    <g key={n.id}
                        transform={`translate(${n.x}, ${n.y})`}
                        className={styles.archNode}
                        onMouseEnter={() => setActive(n.id)}
                        onMouseLeave={() => setActive(null)}
                        style={{ cursor: 'pointer' }}
                        filter={active === n.id ? `url(#glow-${n.id})` : undefined}
                    >
                        <rect x="-8" y="-7" width="16" height="14" rx="2"
                            fill={active === n.id ? '#1a2235' : '#111827'}
                            stroke={active === n.id ? n.color : '#1e2a3a'}
                            strokeWidth="0.5"
                            style={{ transition: 'all 0.3s' }}
                        />
                        <text x="0" y="-1" textAnchor="middle" fontSize="2.5"
                            fill={n.color} fontFamily="monospace">
                            {n.label}
                        </text>
                        <text x="0" y="3.5" textAnchor="middle" fontSize="1.8" fill="#555f7a">
                            {n.sub}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Legend */}
            <div className={styles.archLegend}>
                {nodes.map(n => (
                    <div key={n.id} className={styles.legendItem}
                        onMouseEnter={() => setActive(n.id)}
                        onMouseLeave={() => setActive(null)}>
                        <span style={{ color: n.color }}>{n.icon}</span>
                        <span>{n.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Main Home Component ── */
const Home = () => {
    const c1 = useCounter(2);
    const c2 = useCounter(100);
    const c3 = useCounter(1);

    const objectives = [
        { icon: <FaCode />, title: 'Crear dinámicamente', desc: 'Pega tu código fuente directamente en el dashboard y la plataforma construye la imagen Docker automáticamente.' },
        { icon: <FaNetworkWired />, title: 'Exponer via HTTP', desc: 'Cada microservicio se expone como un endpoint HTTP accesible con soporte para parámetros vía query o body.' },
        { icon: <FaCogs />, title: 'Administrar servicios', desc: 'Lista, habilita, deshabilita y elimina microservicios en tiempo real desde una interfaz unificada.' },
        { icon: <FaRocket />, title: 'Despliegue automático', desc: 'Todo el sistema se levanta con un solo comando: docker-compose up. Sin configuración adicional.' },
    ];

    const stack = [
        { icon: <FaReact />, name: 'React + Vite', color: '#61dafb', role: 'Frontend' },
        { icon: <FaPython />, name: 'Python', color: '#3b82f6', role: 'Backend' },
        { icon: <FaDocker />, name: 'Docker', color: '#2496ed', role: 'Contenedores' },
        { icon: <FaNodeJs />, name: 'Node.js', color: '#4ade80', role: 'Runtime alternativo' },
        { icon: <FaLayerGroup />, name: 'Docker Compose', color: '#e53935', role: 'Orquestación' },
    ];

    const notMS = [
        'Una función interna del dashboard',
        'Un archivo suelto sin contenedor',
        'Una ruta adicional del backend principal',
    ];

    return (
        <div className={styles.page}>

            {/* ── HERO ── */}
            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroBadge}>
                    <FaLayerGroup /> Trabajo Universitario · Semana 9
                </div>
                <h1 className={styles.heroTitle}>
                    System<span className={styles.accent}>Core</span>
                </h1>
                <p className={styles.heroSub}>
                    Plataforma de gestión de microservicios en contenedores Docker.<br />
                    Crea, despliega y administra servicios independientes desde una interfaz web unificada.
                </p>
                <div className={styles.heroStats}>
                    <div className={styles.stat}>
                        <span ref={c1.ref} className={styles.statNum}>{c1.value}+</span>
                        <span className={styles.statLabel}>Lenguajes soportados</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span ref={c2.ref} className={styles.statNum}>{c2.value}%</span>
                        <span className={styles.statLabel}>Contenerizado</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span ref={c3.ref} className={styles.statNum}>{c3.value} CMD</span>
                        <span className={styles.statLabel}>Para levantar todo</span>
                    </div>
                </div>
            </section>

            {/* ── QUÉ ES UN MICROSERVICIO ── */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>¿Qué es un microservicio <span className={styles.accent}>en este proyecto?</span></h2>
                <div className={styles.msGrid}>
                    <div className={styles.msCard}>
                        <h3 className={styles.msCardTitle}><FaCheckCircle style={{ color: '#4ade80' }} /> Un microservicio ES</h3>
                        <ul className={styles.msList}>
                            <li>Una aplicación independiente</li>
                            <li>Empaquetada en su propio contenedor Docker</li>
                            <li>Que expone al menos un endpoint HTTP</li>
                            <li>Recibe parámetros y retorna JSON</li>
                            <li>Creada dinámicamente desde la plataforma</li>
                        </ul>
                    </div>
                    <div className={`${styles.msCard} ${styles.msCardDanger}`}>
                        <h3 className={styles.msCardTitle}><span style={{ color: '#e53935' }}>✕</span> Un microservicio NO ES</h3>
                        <ul className={styles.msList}>
                            {notMS.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── ARQUITECTURA ── */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Diagrama de <span className={styles.accent}>Arquitectura</span></h2>
                <p className={styles.sectionDesc}>Pasa el cursor sobre los nodos para explorar cómo se conectan los componentes del sistema.</p>
                <ArchDiagram />
            </section>

            {/* ── OBJETIVOS ── */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Objetivos del <span className={styles.accent}>Proyecto</span></h2>
                <div className={styles.objGrid}>
                    {objectives.map((o, i) => (
                        <div key={i} className={styles.objCard} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className={styles.objIcon}>{o.icon}</div>
                            <h3 className={styles.objTitle}>{o.title}</h3>
                            <p className={styles.objDesc}>{o.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── STACK ── */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Stack <span className={styles.accent}>Tecnológico</span></h2>
                <div className={styles.stackRow}>
                    {stack.map((s, i) => (
                        <div key={i} className={styles.stackItem}>
                            <span className={styles.stackIcon} style={{ color: s.color }}>{s.icon}</span>
                            <span className={styles.stackName}>{s.name}</span>
                            <span className={styles.stackRole}>{s.role}</span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;