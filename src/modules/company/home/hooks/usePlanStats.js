import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';

export const usePlanStats = () => {
    const [stats, setStats] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getStats();
            if (data) {
                setStats(data.stats);
                setSubscription(data.subscription);
            }
        } catch (error) {
            console.error('Error loading plan stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const checkLimit = (type) => {
        if (!stats || !subscription) return { reached: false };

        const limits = subscription.limits;
        let current = 0;
        let max = 0;
        let name = '';

        switch (type) {
            case 'headquarters':
                current = stats.totalHeadquarters;
                max = limits.maxHeadquarters;
                name = 'Sedes';
                break;
            case 'areas':
                current = stats.totalAreas;
                max = limits.maxAreas;
                name = 'Áreas';
                break;
            case 'roles':
                current = stats.totalRoles;
                max = limits.maxRoles;
                name = 'Cargos';
                break;
            case 'users':
                current = stats.totalEmployees;
                max = limits.maxUsers;
                name = 'Colaboradores';
                break;
            case 'templates':
                current = stats.totalTemplates;
                max = limits.maxTemplates;
                name = 'Plantillas';
                break;
            case 'carnets':
                current = stats.totalCarnets;
                max = limits.maxCarnets;
                name = 'Carnets';
                break;
            default:
                return { reached: false };
        }

        // Si el límite es 0, suele significar ilimitado en algunos sistemas, 
        // pero en nuestro modelo del backend, 0 es el valor por defecto si no se definió.
        // Asumiremos que si max es > 0, se aplica el límite.
        if (max > 0 && current >= max) {
            return { reached: true, current, max, name };
        }

        return { reached: false, current, max, name };
    };

    return { stats, subscription, loading, checkLimit, refreshStats: loadStats };
};
