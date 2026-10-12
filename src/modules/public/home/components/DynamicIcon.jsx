import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Sparkles } from 'lucide-react';

/**
 * =============================================================================
 * COMPONENTE: DynamicIcon
 * =============================================================================
 * Responsabilidad: Resuelve y renderiza dinámicamente cualquier ícono de 
 * lucide-react por nombre en string, función componente o elemento JSX.
 * =============================================================================
 */

/**
 * Renderizador dinámico de íconos de Lucide.
 *
 * ¿Qué hace?
 *   - Busca en el catálogo completo de lucide-react el ícono solicitado por nombre.
 *   - Si no existe o no se provee, retorna Sparkles como fallback por defecto.
 *
 * ¿Qué recibe?
 *   - icon (string | React.ComponentType | React.ReactNode): Identificador o componente.
 *   - size (number, opcional, default 32): Tamaño en píxeles del ícono.
 *   - className (string, opcional): Clases CSS adicionales.
 *
 * ¿Qué analiza/valida?
 *   - Normaliza primera letra a mayúscula (ej: 'graduationCap' -> 'GraduationCap').
 *   - Valida si el ícono ya es un elemento JSX o función antes de buscar en el catálogo.
 *
 * ¿Qué envía?
 *   - React.ReactElement: Componente SVG del ícono solicitado.
 */
const DynamicIcon = ({ icon, size = 32, className = '' }) => {
  if (!icon) {
    return <Sparkles size={size} className={className} />;
  }

  // Si ya es un elemento React instanciado (ej: <Car size={32} />)
  if (React.isValidElement(icon)) {
    return icon;
  }

  // Si es un componente React directamente (ej: icon: Car)
  if (typeof icon === 'function') {
    const Component = icon;
    return <Component size={size} className={className} />;
  }

  // Si es un string con el nombre del ícono (ej: 'GraduationCap', 'Calendar', 'ShieldCheck')
  if (typeof icon === 'string') {
    const trimmed = icon.trim();
    const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const Component = LucideIcons[trimmed] || LucideIcons[formattedName];

    if (Component && (typeof Component === 'function' || typeof Component === 'object')) {
      return <Component size={size} className={className} />;
    }
    return <Sparkles size={size} className={className} />;
  }

  return <Sparkles size={size} className={className} />;
};

export default DynamicIcon;

