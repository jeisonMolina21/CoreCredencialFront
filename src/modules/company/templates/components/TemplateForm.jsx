import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import templateService from '../services/templateService';
import styles from '../pages/Templates.module.css';

const DEFAULT_WIDTH = 350;
const DEFAULT_HEIGHT = 550;

const FIELD_OPTIONS = [
  { value: 'company_logo', label: 'Logo de la Empresa', type: 'image' },
  { value: 'company_name', label: 'Nombre de la Empresa', type: 'text' },
  { value: 'employee_name', label: 'Nombres del Colaborador', type: 'text' },
  { value: 'employee_last_name', label: 'Apellidos del Colaborador', type: 'text' },
  { value: 'employee_role', label: 'Cargo', type: 'text' },
  { value: 'employee_area', label: 'Área', type: 'text' },
  { value: 'employee_blood_type', label: 'Tipo de Sangre', type: 'text' },
  { value: 'document_id', label: 'Identificación', type: 'text' },
  { value: 'employee_photo', label: 'Foto del Empleado', type: 'image' }
];

const TemplateForm = ({ isModalOpen, setIsModalOpen, editingTemplate, onSaveSuccess }) => {
  const [templateName, setTemplateName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let active = true;

    const initModal = async () => {
      if (isModalOpen) {
        await Promise.resolve();
        if (!active) return;

        if (editingTemplate) {
          setTemplateName(editingTemplate.template_name);
          setIsActive(editingTemplate.is_active);
          setBackgroundImage(editingTemplate.path_image_template || '');
          
          let parsedValue = { elements: [] };
          try {
             if (typeof editingTemplate.value_template === 'string') {
                 parsedValue = JSON.parse(editingTemplate.value_template);
             } else if (editingTemplate.value_template) {
                 parsedValue = editingTemplate.value_template;
             }
          } catch(e) {
             console.error("Error al parsear value_template:", e);
          }
          
          setElements(parsedValue.elements || []);
          setSelectedElementId(null);
        } else {
          setTemplateName('');
          setIsActive(true);
          setBackgroundImage('');
          setElements([]);
          setSelectedElementId(null);
        }
      }
    };

    initModal();
    return () => { active = false; };
  }, [isModalOpen, editingTemplate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB restriction for DB storage practicalities
        alert('La imagen es muy grande. Intente con una imagen menor a 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearBackgroundImage = () => {
    setBackgroundImage('');
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const addElement = (e) => {
    const fieldType = e.target.value;
    if (!fieldType) return;
    
    const option = FIELD_OPTIONS.find(opt => opt.value === fieldType);
    const isImage = option.type === 'image';
    
    const newElement = {
      id: "el_" + Date.now().toString(),
      type: option.type,
      field: option.value,
      label: option.label,
      x: 50,
      y: 50,
      width: isImage ? 100 : null,
      height: isImage ? 100 : null,
      fontSize: isImage ? null : 16,
      fontFamily: isImage ? null : 'Arial, sans-serif',
      color: isImage ? null : '#000000',
      fontWeight: isImage ? null : 'normal',
      textAlign: isImage ? null : 'left'
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
    e.target.value = ''; // reset select
  };

  const updateElement = (id, changes) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...changes } : el));
  };

  const removeElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Generate HTML from elements
  const generateHtmlTemplate = () => {
    let internalHtml = elements.map(el => {
      const style = `position: absolute; left: ${el.x}px; top: ${el.y}px; ` +
        (el.type === 'text' ? `font-size: ${el.fontSize}px; color: ${el.color}; font-family: ${el.fontFamily}; font-weight: ${el.fontWeight}; text-align: ${el.textAlign}; margin: 0; white-space: nowrap;` : `width: ${el.width}px; height: ${el.height}px; object-fit: cover; border-radius: ${el.field === 'employee_photo' ? '8px' : '0'};`);
      
      if (el.type === 'text') {
        return `<div style="${style}">{{${el.field}}}</div>`;
      } else {
        // Backend can substitute {{field}} inside src OR we can render it dynamically on display.
        return `<img src="{{${el.field}}}" style="${style}" alt="${el.label}" />`; 
      }
    }).join('\n');

    return `<div class="carnet-container" style="width: ${DEFAULT_WIDTH}px; height: ${DEFAULT_HEIGHT}px; position: relative; background-image: url('${backgroundImage}'); background-size: cover; background-position: center; border-radius: 10px; overflow: hidden; box-sizing: border-box; font-family: Arial, sans-serif;">
      ${internalHtml}
    </div>`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!templateName.trim()) return alert('Ingrese un nombre para la plantilla');

    try {
      const value_template = {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        elements: elements
      };

      const html_template = generateHtmlTemplate();

      const payload = {
        template_name: templateName,
        value_template: value_template,
        html_template: html_template,
        path_image_template: backgroundImage,
        is_active: isActive
      };

      if (editingTemplate) {
        await templateService.updateTemplate(editingTemplate.id, payload);
      } else {
        await templateService.createTemplate(payload);
      }
      setIsModalOpen(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch (error) {
      alert(error.message || 'Error al guardar la plantilla');
    }
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <Motion.div
            className={`${styles.modalContent} ${styles.editorModal}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => setSelectedElementId(null)} // Click outside canvas deselects
          >
            <div className={styles.modalHeader}>
              <h3>{editingTemplate ? 'Editor Visual: ' + editingTemplate.template_name : 'Nuevo Diseño de Carnet'}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.editorBody}>
              {/* Sidebar */}
              <div className={styles.editorSidebar} onClick={(e) => e.stopPropagation()}>
                <div className={styles.sidebarSection}>
                  <h4>General</h4>
                  <div className={styles.formGroup}>
                    <input 
                      type="text" 
                      value={templateName} 
                      onChange={e => setTemplateName(e.target.value)} 
                      placeholder="Nombre Plantilla (Ej: Visitante)" 
                      required
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      style={{ width: 'auto' }}
                    />
                    <label htmlFor="is_active" style={{ cursor: 'pointer', margin: 0 }}>Plantilla Habilitada</label>
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <h4>Fondo (Background)</h4>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                    ref={fileInputRef} 
                  />
                  {!backgroundImage ? (
                    <button type="button" className={styles.fileUploadBtn} onClick={() => fileInputRef.current?.click()}>
                      <Upload size={18} style={{ margin: '0 auto 0.5rem', display: 'block' }}/>
                      Subir Imagen (Max 2MB)
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" className={styles.cancelBtn} onClick={() => fileInputRef.current?.click()} style={{ flex: 1, padding: '0.5rem' }}>Cambiar</button>
                      <button type="button" className={`${styles.iconBtn} ${styles.danger}`} onClick={clearBackgroundImage} title="Remover Fondo" style={{ padding: '0.5rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.sidebarSection}>
                  <h4>Añadir Campos</h4>
                  <div className={styles.formGroup}>
                    <select onChange={addElement} value="">
                      <option value="" disabled>Seleccione campo...</option>
                      {FIELD_OPTIONS.filter(opt => !elements.some(el => el.field === opt.value)).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Element Properties */}
                {selectedElement && (
                <div className={styles.sidebarSection}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                     <h4 style={{ margin: 0, color: 'var(--primary)' }}>{selectedElement.label}</h4>
                     <button type="button" className={`${styles.iconBtn} ${styles.danger}`} onClick={() => removeElement(selectedElement.id)} title="Eliminar Campo">
                       <Trash2 size={16} />
                     </button>
                  </div>

                  {selectedElement.type === 'text' && (
                  <>
                    <div className={styles.propertyRow}>
                      <label>Tamaño (px)</label>
                      <div style={{ display: 'flex', gap: '0.25rem', width: '60%' }}>
                        <button type="button" className={styles.iconBtn} style={{ flex: 1, padding: '0.2rem' }} onClick={() => updateElement(selectedElement.id, { fontSize: Math.max(8, (selectedElement.fontSize || 16) - 1) })}>-</button>
                        <input type="number" style={{ flex: 2, width: '100%', textAlign: 'center' }} value={selectedElement.fontSize || 16} onChange={e => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}/>
                        <button type="button" className={styles.iconBtn} style={{ flex: 1, padding: '0.2rem' }} onClick={() => updateElement(selectedElement.id, { fontSize: (selectedElement.fontSize || 16) + 1 })}>+</button>
                      </div>
                    </div>
                    <div className={styles.propertyRow}>
                      <label>Color</label>
                      <input type="color" value={selectedElement.color} onChange={e => updateElement(selectedElement.id, { color: e.target.value })}/>
                    </div>
                    <div className={styles.propertyRow}>
                      <label>Fuente</label>
                      <select value={selectedElement.fontFamily} onChange={e => updateElement(selectedElement.id, { fontFamily: e.target.value })}>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="Georgia, serif">Georgia</option>
                      </select>
                    </div>
                    <div className={styles.propertyRow}>
                      <label>Estilo</label>
                      <select value={selectedElement.fontWeight} onChange={e => updateElement(selectedElement.id, { fontWeight: e.target.value })}>
                        <option value="normal">Normal</option>
                        <option value="bold">Negrita (Bold)</option>
                      </select>
                    </div>
                    <div className={styles.propertyRow}>
                      <label>Alineación</label>
                      <select value={selectedElement.textAlign} onChange={e => updateElement(selectedElement.id, { textAlign: e.target.value })}>
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                      </select>
                    </div>
                  </>
                  )}

                  {selectedElement.type === 'image' && (
                  <>
                    <div className={styles.propertyRow}>
                      <label>Ancho (px)</label>
                      <div style={{ display: 'flex', gap: '0.25rem', width: '60%' }}>
                        <button type="button" className={styles.iconBtn} style={{ flex: 1, padding: '0.2rem' }} onClick={() => updateElement(selectedElement.id, { width: Math.max(10, (selectedElement.width || 100) - 5) })}>-</button>
                        <input type="number" style={{ flex: 2, width: '100%', textAlign: 'center' }} value={selectedElement.width || 100} onChange={e => updateElement(selectedElement.id, { width: Number(e.target.value) })}/>
                        <button type="button" className={styles.iconBtn} style={{ flex: 1, padding: '0.2rem' }} onClick={() => updateElement(selectedElement.id, { width: (selectedElement.width || 100) + 5 })}>+</button>
                      </div>
                    </div>
                    <div className={styles.propertyRow}>
                      <label>Alto (px)</label>
                      <div style={{ display: 'flex', gap: '0.25rem', width: '60%' }}>
                        <button type="button" className={styles.iconBtn} style={{ flex: 1, padding: '0.2rem' }} onClick={() => updateElement(selectedElement.id, { height: Math.max(10, (selectedElement.height || 100) - 5) })}>-</button>
                        <input type="number" style={{ flex: 2, width: '100%', textAlign: 'center' }} value={selectedElement.height || 100} onChange={e => updateElement(selectedElement.id, { height: Number(e.target.value) })}/>
                        <button type="button" className={styles.iconBtn} style={{ flex: 1, padding: '0.2rem' }} onClick={() => updateElement(selectedElement.id, { height: (selectedElement.height || 100) + 5 })}>+</button>
                      </div>
                    </div>
                  </>
                  )}
                  
                </div>
                )}
              </div>

              {/* Canvas Workspace */}
              <div className={styles.editorWorkspace}>
                <div 
                  ref={canvasRef}
                  className={styles.canvasContainer} 
                  style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!backgroundImage && <div style={{ color: '#cbd5e1', textAlign: 'center', marginTop: '50%', transform: 'translateY(-50%)' }}>Sube tu diseño de fondo</div>}
                  
                  {elements.map(el => (
                    <Motion.div
                      key={el.id}
                      drag
                      dragMomentum={false}
                      dragConstraints={canvasRef}
                      style={{
                        position: 'absolute',
                        x: el.x,
                        y: el.y,
                        cursor: 'grab',
                        padding: '4px',
                        border: selectedElementId === el.id ? '2px dashed #6366f1' : '1px dashed transparent',
                        backgroundColor: selectedElementId === el.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        fontSize: el.type === 'text' ? `${el.fontSize}px` : 'inherit',
                        color: el.type === 'text' ? el.color : 'inherit',
                        fontFamily: el.type === 'text' ? el.fontFamily : 'inherit',
                        fontWeight: el.type === 'text' ? el.fontWeight : 'inherit',
                        textAlign: el.type === 'text' ? el.textAlign : 'inherit',
                        width: el.type === 'image' ? `${el.width}px` : 'auto',
                        height: el.type === 'image' ? `${el.height}px` : 'auto',
                        whiteSpace: 'nowrap',
                        zIndex: selectedElementId === el.id ? 100 : 1
                      }}
                      onDragEnd={(e, info) => {
                        updateElement(el.id, { 
                          x: Math.round(el.x + info.offset.x), 
                          y: Math.round(el.y + info.offset.y) 
                        });
                      }}
                      onPointerDown={() => setSelectedElementId(el.id)}
                    >
                      {el.type === 'text' ? `[ ${el.label} ]` : (
                        <div style={{ width: '100%', height: '100%', border: '2px solid #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                          [{el.label}]
                        </div>
                      )}

                      {/* Controles de Redimensionamiento (Resize Handles) */}
                      {selectedElementId === el.id && (
                        <>
                          {(el.type === 'image' ? [
                            { dir: 'nw', top: -6, left: -6, cursor: 'nwse-resize' },
                            { dir: 'n', top: -6, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
                            { dir: 'ne', top: -6, right: -6, cursor: 'nesw-resize' },
                            { dir: 'w', top: '50%', left: -6, transform: 'translateY(-50%)', cursor: 'ew-resize' },
                            { dir: 'e', top: '50%', right: -6, transform: 'translateY(-50%)', cursor: 'ew-resize' },
                            { dir: 'sw', bottom: -6, left: -6, cursor: 'nesw-resize' },
                            { dir: 's', bottom: -6, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
                            { dir: 'se', bottom: -6, right: -6, cursor: 'nwse-resize' },
                          ] : [
                            { dir: 'w', top: '50%', left: -6, transform: 'translateY(-50%)', cursor: 'ew-resize' },
                            { dir: 'e', top: '50%', right: -6, transform: 'translateY(-50%)', cursor: 'ew-resize' }
                          ]).map(handle => (
                            <div 
                              key={handle.dir}
                              style={{
                                position: 'absolute',
                                top: handle.top,
                                bottom: handle.bottom,
                                left: handle.left,
                                right: handle.right,
                                transform: handle.transform,
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#ffffff',
                                border: '2px solid #6366f1',
                                borderRadius: '50%',
                                cursor: handle.cursor,
                                zIndex: 10,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                              onPointerDown={(e) => {
                                e.stopPropagation(); 
                                
                                const startX = e.clientX;
                                const startY = e.clientY;
                                const startElemX = el.x;
                                const startElemY = el.y;
                                const startWidth = el.width || 100;
                                const startHeight = el.height || 100;
                                const startFontSize = el.fontSize || 16;

                                const handlePointerMove = (moveEvent) => {
                                  const deltaX = moveEvent.clientX - startX;
                                  const deltaY = moveEvent.clientY - startY;

                                  if (el.type === 'text') {
                                    // Escalar fuente (se estira del lado que se jale)
                                    const sign = handle.dir === 'e' ? 1 : -1;
                                    const newFontSize = Math.max(8, startFontSize + Math.round(deltaX * 0.3 * sign));
                                    updateElement(el.id, { fontSize: newFontSize });
                                  } else {
                                    // Escalar imagen anclando el polo opuesto
                                    let newWidth = startWidth;
                                    let newHeight = startHeight;
                                    let newX = startElemX;
                                    let newY = startElemY;

                                    if (handle.dir.includes('e')) newWidth = startWidth + deltaX;
                                    if (handle.dir.includes('s')) newHeight = startHeight + deltaY;
                                    if (handle.dir.includes('w')) {
                                      newWidth = startWidth - deltaX;
                                      newX = startElemX + deltaX;
                                    }
                                    if (handle.dir.includes('n')) {
                                      newHeight = startHeight - deltaY;
                                      newY = startElemY + deltaY;
                                    }

                                    // Limites mínimos para evitar inversión de contenedor
                                    if (newWidth < 10) { 
                                      newWidth = 10; 
                                      if (handle.dir.includes('w')) newX = startElemX + startWidth - 10; 
                                    }
                                    if (newHeight < 10) { 
                                      newHeight = 10; 
                                      if (handle.dir.includes('n')) newY = startElemY + startHeight - 10; 
                                    }

                                    updateElement(el.id, { 
                                      width: Math.round(newWidth), 
                                      height: Math.round(newHeight),
                                      x: Math.round(newX),
                                      y: Math.round(newY)
                                    });
                                  }
                                };

                                const handlePointerUp = () => {
                                  window.removeEventListener('pointermove', handlePointerMove);
                                  window.removeEventListener('pointerup', handlePointerUp);
                                };

                                window.addEventListener('pointermove', handlePointerMove);
                                window.addEventListener('pointerup', handlePointerUp);
                              }}
                            />
                          ))}
                        </>
                      )}
                    </Motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Descartar</button>
              <button type="button" className={styles.submitBtn} onClick={handleSave}>
                {editingTemplate ? 'Guardar Cambios' : 'Crear Carnet'}
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TemplateForm;
