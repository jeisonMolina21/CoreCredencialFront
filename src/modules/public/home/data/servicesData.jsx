import React from 'react';

/**
 * =============================================================================
 * MÓDULO: servicesData
 * =============================================================================
 * Responsabilidad: Centraliza el catálogo de funcionalidades y servicios de la
 * plataforma mostrados en la página principal.
 *
 * Estructura de cada item de servicio:
 *   - id (string, requerido): Identificador único slug (ej: 'control-acceso').
 *   - icon (string): Nombre del ícono de Lucide (ej: 'GraduationCap', 'ShieldCheck').
 *   - title (string): Título descriptivo de la funcionalidad.
 *   - text (string | React.ReactNode): Detalle explicativo de la tarjeta.
 *   - badge (string, opcional): Etiqueta informativa visible (ej: 'Nuevo', 'Popular').
 *   - highlight (boolean, opcional): Si es true, aplica estilo visual destacado.
 * =============================================================================
 */

export const defaultServices = [
  {
    id: 'constructor-plantillas',
    icon: 'Layout',
    title: 'Diseñador Visual de Carnets',
    text: 'Crea carnets digitales y físicos profesionales con un potente editor visual. Personaliza tipografías, colores corporativos, logos y campos dinámicos para fortalecer la identidad de tu marca.'
  },
  {
    id: 'directorio-centralizado',
    icon: 'Users',
    title: 'Directorio Central de Identidad',
    text: 'Administra perfiles de colaboradores, áreas departamentales y cargos en una estructura jerárquica unificada, accesible y protegida con cifrado de datos.'
  },
  {
    id: 'emision-instantanea',
    icon: 'Zap',
    title: 'Emisión Instantánea con QR',
    text: 'Genera carnets digitales con códigos QR criptográficos listos para uso en smartphones (PWA/Wallet) o impresión de alta resolución sin tiempos de espera.'
  },
  {
    id: 'control-acceso',
    icon: 'ShieldCheck',
    title: 'Control de Acceso y Asistencia',
    text: (
      <>
        Monitorea asistencias y valida identidades en segundos mediante escaneo de QR. Registra ingresos y salidas con trazabilidad en vivo, con capacidad de <strong style={{ color: '#000000' }}>revocar accesos en tiempo real a ex-empleados.</strong>
      </>
    )
  },
  {
    id: 'gestion-multi-sede',
    icon: 'Globe',
    title: 'Administración Multi-Sede',
    text: 'Controla sedes, sucursales y campus desde un panel único centralizado. Ideal para empresas con operaciones distribuidas a nivel nacional o regional.'
  },
  {
    id: 'pagos-integrados',
    icon: 'CreditCard',
    title: 'Validación de Membresías y Pagos',
    text: 'Verifica al instante el estado de membresías, cuotas y pagos asociados al carnet digital, integrado de forma fluida con pasarelas de pago digitales.'
  },
  {
    id: 'gestion-eventos',
    icon: 'Calendar',
    title: 'Control de Eventos y Aforos',
    text: 'Gestiona acreditaciones, registro de invitados y control de aforo en congresos y eventos corporativos mediante pases y carnets QR con validación en milisegundos.'
  },
  {
    id: 'control-parqueaderos',
    icon: 'Car',
    title: 'Control Vehicular y Parqueaderos',
    text: 'Asocia vehículos a los carnets del personal para agilizar el ingreso a estacionamientos, verificar permisos activos y prevenir accesos no autorizados.'
  },
  {
    id: 'carnets-estudiantiles',
    icon: 'GraduationCap',
    title: 'Carnets Estudiantiles Digitales',
    text: 'Solución integral para colegios, institutos y universidades. Carnetización de estudiantes, control de ingresos en puertas y comunicación institucional confiable e integrada con Q10.'
  },
  {
    id: 'acceso-a-instalaciones',
    icon: 'Building2',
    title: 'Seguridad en Instalaciones',
    text: 'Garantiza que solo personal autenticado y acreditado ingrese a áreas restringidas, laboratorios y oficinas mediante credenciales digitales seguras.'
  }
];
