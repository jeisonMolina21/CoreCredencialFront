/**
 * ==============================================================================
 * PROYECTO: CoreCredential - Sistema de Carnetización y Credenciales Digitales
 * ARCHIVO: verificador.js
 * DESCRIPCIÓN: Controlador del Validador de Credenciales y Códigos QR:
 *              Comprobación de autenticidad en tiempo real contra DataStore.
 * AUTOR: Jeison Molina
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initVerifier();
});

function initVerifier() {
  const form = document.getElementById('verifierForm');
  const codeInput = document.getElementById('verifyCodeInput');
  const resultBox = document.getElementById('verifyResultBox');

  if (!form || !codeInput || !resultBox) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const query = codeInput.value.trim().toUpperCase();

    if (!query) {
      showToast('Por favor ingresa un código de credencial o documento', 'warning');
      return;
    }

    const credentials = DataStore.getCredentials();
    const found = credentials.find(c => c.code.toUpperCase() === query || c.docId === query);

    renderVerificationResult(found, query, resultBox);
  });

  // Botones de prueba rápida
  const quickTestBtns = document.querySelectorAll('[data-verify-test]');
  quickTestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-verify-test');
      codeInput.value = code;
      form.dispatchEvent(new Event('submit'));
    });
  });
}

function renderVerificationResult(cred, query, container) {
  container.classList.add('active');

  if (foundCredValid(cred)) {
    container.className = 'verifier-result active status-valid';
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span class="badge" style="background-color:var(--color-status-active); color:#FFFFFF; font-weight:bold; padding:4px 12px; border-radius:var(--radius-full);">
          ✓ CREDENCIAL AUTÉNTICA Y ACTIVA
        </span>
        <span style="font-size:0.75rem; color:var(--color-text-muted); font-family:var(--font-mono);">${new Date().toLocaleTimeString()}</span>
      </div>

      <div style="display:flex; gap:16px; align-items:center; margin-bottom:14px;">
        <img src="${cred.avatar}" alt="${cred.fullName}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid var(--color-primary);">
        <div>
          <h3 style="font-size:1.15rem; margin:0; color:var(--color-text-title);">${cred.fullName}</h3>
          <p style="font-size:0.85rem; color:var(--color-primary); margin:0; font-weight:600;">${cred.role}</p>
          <span style="font-size:0.75rem; color:var(--color-text-muted);">${cred.department} &bull; ${cred.company}</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; font-size:0.75rem; background-color:rgba(255,255,255,0.7); padding:10px; border-radius:var(--radius-sm);">
        <div><strong>Código:</strong><br>${cred.code}</div>
        <div><strong>Documento:</strong><br>${cred.docId}</div>
        <div><strong>Vigencia:</strong><br>${cred.expiryDate}</div>
      </div>
    `;
    showToast('Credencial verificada con éxito', 'success');
  } else {
    container.className = 'verifier-result active status-invalid';
    container.innerHTML = `
      <div style="margin-bottom:8px;">
        <span class="badge" style="background-color:var(--color-status-expired); color:#FFFFFF; font-weight:bold; padding:4px 12px; border-radius:var(--radius-full);">
          ✕ CREDENCIAL NO REGISTRADA O INVÁLIDA
        </span>
      </div>
      <h3 style="font-size:1.1rem; color:var(--color-status-expired); margin-bottom:4px;">No se encontraron registros activos</h3>
      <p style="font-size:0.85rem; color:var(--color-text-body); margin:0;">
        El código o documento <strong>"${query}"</strong> no corresponde a una credencial digital válida expedida por el sistema CoreCredential.
      </p>
    `;
    showToast('Código de credencial no válido', 'danger');
  }
}

function foundCredValid(cred) {
  return cred && cred.status === 'ACTIVO';
}
