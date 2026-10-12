import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

/**
 * Componente de paginación reutilizable.
 *
 * Props:
 *  - page: número de página actual (1-based)
 *  - totalPages: total de páginas
 *  - total: total de registros
 *  - limit: registros por página
 *  - onPageChange: (newPage: number) => void
 */
const Pagination = ({ page, totalPages, total, limit, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Genera el rango de páginas visibles (máx 5 botones centrados en la actual)
  const buildPageRange = () => {
    const delta = 2; // páginas a cada lado de la actual
    const range = [];
    const left  = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push('...');
    }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) range.push('...');
      range.push(totalPages);
    }
    return range;
  };

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div className={styles.wrapper}>
      {/* Info de registros */}
      <span className={styles.info}>
        Mostrando <strong>{from}–{to}</strong> de <strong>{total}</strong> empresas
      </span>

      {/* Controles de página */}
      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          title="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {buildPageRange().map((item, idx) =>
          item === '...' ? (
            <span key={`dot-${idx}`} className={styles.dots}>…</span>
          ) : (
            <button
              key={item}
              className={`${styles.pageBtn} ${item === page ? styles.active : ''}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          className={styles.navBtn}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          title="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
