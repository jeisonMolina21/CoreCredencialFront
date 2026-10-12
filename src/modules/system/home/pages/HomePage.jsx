import React, { useState, useEffect } from 'react';
import {
    Building2,
    Activity,
    CreditCard
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { companyService } from '../../companies';
import { subscriptionService } from '../../subscriptions';
import { systemLogService } from '../../logs';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './home.module.css';

const SystemHome = () => {
    const [stats, setStats] = useState({
        totalCompanies: 0,
        activeSubscriptions: 0
    });
    const [recentLogs, setRecentLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [companiesData, subscriptionsData, logsData] = await Promise.all([
                    companyService.getAllCompanies(),
                    subscriptionService.getAllSubscriptions(),
                    systemLogService.getRecentLogs(10)
                ]);

                const companiesCount = companiesData.total || (Array.isArray(companiesData) ? companiesData.length : (companiesData.data?.length || 0));
                const subscriptions = subscriptionsData.data || (Array.isArray(subscriptionsData) ? subscriptionsData : []);
                const logs = logsData.data || (Array.isArray(logsData) ? logsData : []);

                // Si las suscripciones también vienen paginadas, usamos .total
                const activeSubsCount = subscriptionsData.totalActive || subscriptions.filter(sub => sub.status === 'ACTIVE').length;

                setStats({
                    totalCompanies: companiesCount,
                    activeSubscriptions: activeSubsCount
                });

                setRecentLogs(logs);

            } catch (error) {
                console.error("Error cargando dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const dashboardStats = [
        { label: 'Total Empresas en Red', value: stats.totalCompanies, icon: <Building2 />, color: '#0062E3' },
        { label: 'Suscripciones Activas', value: stats.activeSubscriptions, icon: <CreditCard />, color: '#10B981' }
    ];

    const getActionSpanish = (action) => {
        const m = { 'CREATE': 'Creó', 'UPDATE': 'Actualizó', 'DELETE': 'Eliminó', 'READ': 'Leyó' };
        return m[action] || action;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Sincronizando consola métrica...</div>;
    }

    return (
        <Motion.div
            className={styles.dashboard}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {dashboardStats.map((stat, index) => (
                    <Motion.div
                        key={index}
                        className={styles.statCard}
                        variants={itemVariants}
                    >
                        <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <h3 className={styles.statValue}>{stat.value}</h3>
                        </div>
                    </Motion.div>
                ))}
            </div>

            <div className={styles.mainGrid}>
                {/* Recent Activity (Full API Connected) */}
                <Motion.div className={styles.activitySection} variants={itemVariants} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} />
                            Actividad Reciente del Backoffice
                        </h3>
                    </div>
                    <div className={styles.activityList}>
                        {recentLogs.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>No hay actividad registrada aún.</div>
                        ) : (
                            recentLogs.map((log) => (
                                <div key={log.id} className={styles.activityItem}>
                                    <div className={styles.activityBullet} style={{
                                        backgroundColor: log.action === 'DELETE' ? '#EF4444' : log.action === 'CREATE' ? '#10B981' : '#F59E0B'
                                    }} />
                                    <div className={styles.activityContent}>
                                        <p>
                                            <strong>{log.user ? log.user.name : 'Sistema'}:</strong> {getActionSpanish(log.action)} un registro en el módulo de <b>{log.table_name || 'Desconocido'}</b>.
                                        </p>
                                        <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: es })}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Motion.div>
            </div>
        </Motion.div>
    );
};

export default SystemHome;
