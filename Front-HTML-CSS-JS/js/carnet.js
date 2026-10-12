/**
 * ==============================================================================
 * PROYECTO: CoreCredential - Sistema de Carnetización y Credenciales Digitales
 * ARCHIVO: carnet.js
 * DESCRIPCIÓN: Controlador reactivo de la emisión y previsualización de carnet:
 *              Actualización en tiempo real del carnet según el formulario,
 *              carga interactiva de fotografía y generación dinámica de QR.
 * AUTOR: Jeison Molina
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCarnetFormListeners();
  initDemoProfiles();
});

function initCarnetFormListeners() {
  const form = document.getElementById('carnetForm');
  if (!form) return;

  const inputName = document.getElementById('holderName');
  const inputRole = document.getElementById('holderRole');
  const inputDept = document.getElementById('holderDept');
  const inputDoc = document.getElementById('holderDoc');
  const inputCode = document.getElementById('holderCode');
  const inputBlood = document.getElementById('holderBlood');
  const selectType = document.getElementById('holderType');
  const selectStatus = document.getElementById('holderStatus');
  const photoInput = document.getElementById('holderPhotoInput');

  // Elementos de la tarjeta visual (Live Preview)
  const cardName = document.getElementById('cardHolderName');
  const cardRole = document.getElementById('cardHolderRole');
  const cardDept = document.getElementById('cardHolderDept');
  const cardDoc = document.getElementById('cardHolderDoc');
  const cardCode = document.getElementById('cardHolderCode');
  const cardBlood = document.getElementById('cardHolderBlood');
  const cardType = document.getElementById('cardTypeBadge');
  const cardFooter = document.getElementById('cardStatusFooter');
  const cardPhoto = document.getElementById('cardPhotoImg');
  const qrHash = document.getElementById('cardQrHash');

  // Escuchar cambios en vivo
  if (inputName) {
    inputName.addEventListener('input', e => {
      cardName.textContent = e.target.value.trim() || 'Nombre del Titular';
    });
  }

  if (inputRole) {
    inputRole.addEventListener('input', e => {
      cardRole.textContent = e.target.value.trim() || 'Cargo / Ocupación';
    });
  }

  if (inputDept) {
    inputDept.addEventListener('input', e => {
      cardDept.textContent = e.target.value.trim() || 'Área General';
    });
  }

  if (inputDoc) {
    inputDoc.addEventListener('input', e => {
      cardDoc.textContent = e.target.value.trim() || '00000000';
    });
  }

  if (inputCode) {
    inputCode.addEventListener('input', e => {
      const code = e.target.value.trim() || 'CC-2026-000';
      cardCode.textContent = code;
      if (qrHash) qrHash.textContent = `HASH: ${generateSimpleHash(code)}`;
    });
  }

  if (inputBlood) {
    inputBlood.addEventListener('input', e => {
      cardBlood.textContent = e.target.value.trim() || 'O+';
    });
  }

  if (selectType) {
    selectType.addEventListener('change', e => {
      cardType.textContent = e.target.value;
    });
  }

  if (selectStatus) {
    selectStatus.addEventListener('change', e => {
      const status = e.target.value;
      cardFooter.className = 'carnet-footer';
      cardFooter.textContent = `ESTADO: ${status}`;

      if (status === 'REVISION') {
        cardFooter.classList.add('status-review');
      } else if (status === 'VENCIDO') {
        cardFooter.classList.add('status-expired');
      }
    });
  }

  // Carga interactiva de fotografía local
  if (photoInput) {
    photoInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          cardPhoto.src = event.target.result;
          showToast('Fotografía cargada exitosamente', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Guardar credencial en DataStore
  form.addEventListener('submit', e => {
    e.preventDefault();

    const newCred = {
      code: inputCode.value.trim() || `CC-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: inputName.value.trim(),
      role: inputRole.value.trim(),
      department: inputDept.value.trim(),
      docId: inputDoc.value.trim(),
      company: 'Innovatech Global',
      type: selectType.value,
      status: selectStatus.value,
      bloodType: inputBlood.value.trim() || 'O+',
      avatar: cardPhoto.src,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-12-31'
    };

    DataStore.saveCredential(newCred);
    showToast(`Credencial ${newCred.code} emitida y guardada en el sistema`, 'success');
  });
}

function initDemoProfiles() {
  const demoBtns = document.querySelectorAll('[data-load-profile]');
  demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-load-profile');
      const cred = DataStore.getCredentialByCode(code);
      if (cred) {
        populateForm(cred);
        showToast(`Perfil de ${cred.fullName} cargado en el visualizador`, 'success');
      }
    });
  });
}

function populateForm(cred) {
  document.getElementById('holderName').value = cred.fullName;
  document.getElementById('holderRole').value = cred.role;
  document.getElementById('holderDept').value = cred.department;
  document.getElementById('holderDoc').value = cred.docId;
  document.getElementById('holderCode').value = cred.code;
  document.getElementById('holderBlood').value = cred.bloodType;
  document.getElementById('holderType').value = cred.type;
  document.getElementById('holderStatus').value = cred.status;

  // Actualizar tarjeta visual
  document.getElementById('cardHolderName').textContent = cred.fullName;
  document.getElementById('cardHolderRole').textContent = cred.role;
  document.getElementById('cardHolderDept').textContent = cred.department;
  document.getElementById('cardHolderDoc').textContent = cred.docId;
  document.getElementById('cardHolderCode').textContent = cred.code;
  document.getElementById('cardHolderBlood').textContent = cred.bloodType;
  document.getElementById('cardTypeBadge').textContent = cred.type;
  document.getElementById('cardPhotoImg').src = cred.avatar;

  const cardFooter = document.getElementById('cardStatusFooter');
  cardFooter.className = 'carnet-footer';
  cardFooter.textContent = `ESTADO: ${cred.status}`;
  if (cred.status === 'REVISION') cardFooter.classList.add('status-review');
  if (cred.status === 'VENCIDO') cardFooter.classList.add('status-expired');

  const qrHash = document.getElementById('cardQrHash');
  if (qrHash) qrHash.textContent = `HASH: ${generateSimpleHash(cred.code)}`;
}

function generateSimpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}
