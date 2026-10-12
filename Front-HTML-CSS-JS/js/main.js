/**
 * ==============================================================================
 * PROYECTO: CoreCredential - Sistema de Carnetización y Credenciales Digitales
 * ARCHIVO: main.js
 * DESCRIPCIÓN: Controlador de interfaz: Menú responsive y notificaciones Toast.
 * AUTOR: Jeison Molina
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initToastContainer();
});

function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
}

let toastContainer = null;

function initToastContainer() {
  toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

/**
 * Despliega una alerta visual Toast
 * @param {string} message 
 * @param {'success'|'warning'|'danger'} type 
 */
function showToast(message, type = 'success') {
  if (!toastContainer) initToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button style="margin-left:12px; font-weight:bold; color:var(--color-text-muted);">&times;</button>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);

  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', () => removeToast(toast));

  setTimeout(() => removeToast(toast), 3500);

  function removeToast(el) {
    el.classList.remove('show');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }
}
