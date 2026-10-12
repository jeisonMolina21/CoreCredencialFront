/**
 * ==============================================================================
 * PROYECTO: CoreCredential - Sistema de Carnetización y Credenciales Digitales
 * ARCHIVO: data.js
 * DESCRIPCIÓN: Modelos de datos de credenciales, persistencia en LocalStorage
 *              y catálogo inicial de titulares de carnet.
 * AUTOR: Jeison Molina
 * ==============================================================================
 */

const STORAGE_KEYS = {
  CREDENTIALS: 'corecred_credentials',
  SESSION: 'corecred_session'
};

// ==============================================================================
// 1. CREDENCIALES INICIALES DE DEMOSTRACIÓN (Nombres Ficticios)
// ==============================================================================
const INITIAL_CREDENTIALS = [
  {
    code: 'CC-2026-001',
    fullName: 'Alejandro Morales',
    role: 'Ingeniero de Software Senior',
    department: 'Dirección de Tecnología',
    docId: '1018234567',
    company: 'Innovatech Global',
    type: 'CORPORATIVO', // 'CORPORATIVO', 'CONTRATISTA', 'ESTUDIANTIL'
    status: 'ACTIVO',    // 'ACTIVO', 'REVISION', 'VENCIDO'
    issueDate: '2026-01-15',
    expiryDate: '2027-01-15',
    bloodType: 'O+',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
  },
  {
    code: 'CC-2026-002',
    fullName: 'Camila Restrepo',
    role: 'Especialista en Ciberseguridad',
    department: 'Seguridad de la Información',
    docId: '52987123',
    company: 'Innovatech Global',
    type: 'CORPORATIVO',
    status: 'ACTIVO',
    issueDate: '2026-03-01',
    expiryDate: '2027-03-01',
    bloodType: 'A+',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
  },
  {
    code: 'CC-2026-003',
    fullName: 'David Quintana',
    role: 'Auditor Externo de Sistemas',
    department: 'Consultoría y Riesgos',
    docId: '80452119',
    company: 'Innovatech Global',
    type: 'CONTRATISTA',
    status: 'REVISION',
    issueDate: '2026-06-10',
    expiryDate: '2026-12-10',
    bloodType: 'B+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'
  }
];

// ==============================================================================
// 2. DATASTORE (Gestión de Estado Local)
// ==============================================================================
const DataStore = {
  getCredentials() {
    const raw = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(INITIAL_CREDENTIALS));
      return INITIAL_CREDENTIALS;
    }
    return JSON.parse(raw);
  },

  getCredentialByCode(code) {
    const list = this.getCredentials();
    return list.find(c => c.code.toUpperCase() === code.trim().toUpperCase()) || null;
  },

  saveCredential(cred) {
    const list = this.getCredentials();
    const index = list.findIndex(c => c.code === cred.code);
    if (index >= 0) {
      list[index] = cred;
    } else {
      list.unshift(cred);
    }
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(list));
    return cred;
  }
};
