import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import planService from '../services/planService';
import PlanList from '../components/PlanList';
import PlanForm from '../components/PlanForm';
import styles from './Plans.module.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const data = await planService.getAllPlans();
      setPlans(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenForm = (plan = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (payload) => {
    try {
      if (editingPlan) {
        await planService.updatePlan(editingPlan.id, payload);
      } else {
        await planService.createPlan(payload);
      }
      handleCloseForm();
      loadPlans();
    } catch (error) {
      alert(error.message || 'Error al guardar el plan');
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este plan?')) {
      try {
        await planService.deletePlan(id);
        loadPlans();
      } catch (error) {
        alert(error.message || 'Error al eliminar el plan');
      }
    }
  };

  return (
    <Motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Gestión de Planes</h1>
          <p className={styles.subtitle}>Define y administra la oferta comercial de la plataforma.</p>
        </div>
        <button className={styles.addBtn} onClick={() => handleOpenForm()}>
          <Plus size={20} />
          Nuevo Plan
        </button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Buscar planes..." />
        </div>
      </div>

      {/* Content */}
      <PlanList 
        plans={plans} 
        isLoading={isLoading} 
        onEdit={handleOpenForm} 
        onDelete={handleDeletePlan} 
      />

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <PlanForm 
            key={editingPlan?.id || 'new'}
            onClose={handleCloseForm} 
            onSave={handleSavePlan} 
            editingPlan={editingPlan} 
          />
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default Plans;
