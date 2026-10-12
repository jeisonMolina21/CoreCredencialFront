# -*- coding: utf-8 -*-
"""
Generador Maestro del Documento Word Oficial:
DIRECCIÓN TIC - MANUAL OFICIAL DE USUARIO E INSTRUCTIVO OPERATIVO
APLICATIVO CARNET DIGITAL (VERSIÓN 2026)
Estandarizado según la Guía de Estilo de Escritura de Microsoft (Microsoft Writing Style Guide)
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT_FRONT = r"f:\personal\CoreCredential-Front-main\MANUAL_DE_USUARIO_CARNET_DIGITAL.docx"
DOCX_OUTPUT_BACK = r"f:\personal\CoreCredential-Back-main\MANUAL_DE_USUARIO_CARNET_DIGITAL.docx"
IMAGES_DIR = r"f:\personal\CoreCredential-Front-main\manual_capturas\recortadas"

def set_cell_background(cell, hex_color):
    """Establece el color de fondo de una celda de tabla."""
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    """Establece el relleno interno de una celda en dxa."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_callout(doc, text, callout_type="TIP"):
    """Inserta un cuadro destacado estilizado."""
    bg_colors = {
        "TIP": "F0FDF4",      # Verde suave
        "NOTE": "F8FAFC",     # Azul/gris suave
        "WARNING": "FFFBEB",  # Ámbar suave
        "ALERT": "FEF2F2"     # Rojo suave
    }
    border_colors = {
        "TIP": "16A34A",
        "NOTE": "2563EB",
        "WARNING": "D97706",
        "ALERT": "DC2626"
    }
    prefixes = {
        "TIP": "Sugerencia: ",
        "NOTE": "Nota técnica: ",
        "WARNING": "Advertencia: ",
        "ALERT": "Acción crítica: "
    }

    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_colors.get(callout_type, "F8FAFC"))
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    b_color = border_colors.get(callout_type, "2563EB")
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:left w:val="single" w:sz="36" w:space="0" w:color="{b_color}"/>'
        f'  <w:top w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    run_pre = p.add_run(prefixes.get(callout_type, ""))
    run_pre.bold = True
    run_pre.font.size = Pt(9.5)
    run_pre.font.name = "Calibri"
    run_pre.font.color.rgb = RGBColor(0, 31, 63)

    run_text = p.add_run(text)
    run_text.font.size = Pt(9.5)
    run_text.font.name = "Calibri"
    run_text.font.color.rgb = RGBColor(51, 65, 85)

    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def format_table(table, col_widths, headers, data, header_bg="001F3F"):
    """Aplica formato estructurado institucional a tablas."""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.size = Pt(9)
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.name = "Calibri"

    for row_idx, row_data in enumerate(data):
        row = table.add_row()
        bg_row = "FFFFFF" if row_idx % 2 == 0 else "F8FAFC"
        for col_idx, val in enumerate(row_data):
            cell = row.cells[col_idx]
            cell.text = str(val)
            set_cell_background(cell, bg_row)
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            p = cell.paragraphs[0]
            for run in p.runs:
                run.font.size = Pt(8.5)
                run.font.color.rgb = RGBColor(51, 65, 85)
                run.font.name = "Calibri"

    for row in table.rows:
        for i, w in enumerate(col_widths):
            row.cells[i].width = Inches(w)

def add_screenshot(doc, img_name, fig_number, caption, max_width_inches=6.0):
    """Inserta capturas de pantalla centradas con pie de foto formal."""
    img_path = os.path.join(IMAGES_DIR, img_name)
    if not os.path.exists(img_path):
        p_err = doc.add_paragraph(f"[Imagen no encontrada: {img_name}]")
        p_err.runs[0].font.color.rgb = RGBColor(220, 38, 38)
        return

    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(2)
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(max_width_inches))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(10)
    
    r_fig = p_cap.add_run(f"Figura {fig_number}. ")
    r_fig.bold = True
    r_fig.font.size = Pt(8.5)
    r_fig.font.color.rgb = RGBColor(0, 31, 63)
    
    r_cap = p_cap.add_run(caption)
    r_cap.italic = True
    r_cap.font.size = Pt(8.5)
    r_cap.font.color.rgb = RGBColor(71, 85, 105)

def build_user_manual():
    print("Iniciando compilacion del Manual Oficial de Usuario en Word...")
    doc = Document()

    # Configuración de márgenes estándar de 1 pulgada (72 pt)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # =========================================================================
    # PORTADA INSTITUCIONAL
    # =========================================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run("DIRECCIÓN DE TECNOLOGÍAS DE LA INFORMACIÓN Y COMUNICACIONES (TIC)")
    r_inst.font.size = Pt(12)
    r_inst.font.bold = True
    r_inst.font.color.rgb = RGBColor(0, 31, 63)
    p_inst.paragraph_format.space_before = Pt(40)
    p_inst.paragraph_format.space_after = Pt(60)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("MANUAL OFICIAL DE USUARIO E INSTRUCTIVO OPERATIVO")
    r_title.font.size = Pt(24)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0, 31, 63)
    p_title.paragraph_format.space_after = Pt(12)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Guía Oficial Paso a Paso para la Emisión, Administración y Verificación de Credenciales Digitales")
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(71, 85, 105)
    p_sub.paragraph_format.space_after = Pt(20)

    p_app = doc.add_paragraph()
    p_app.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_app = p_app.add_run("APLICATIVO CARNET DIGITAL — VERSIÓN 2026")
    r_app.font.size = Pt(11)
    r_app.font.bold = True
    r_app.font.color.rgb = RGBColor(22, 163, 74)
    p_app.paragraph_format.space_after = Pt(100)

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_meta = p_meta.add_run("Versión Oficial: 2.5.0  |  Vigencia: 2026\nElaborado para la Capacitación Integral y Autonomía Operativa")
    r_meta.font.size = Pt(9.5)
    r_meta.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_page_break()

    # =========================================================================
    # CONTROL DE VERSIONES Y FIRMAS INSTITUCIONALES
    # =========================================================================
    doc.add_heading("Control de versiones", level=1)
    tbl_version = doc.add_table(rows=1, cols=6)
    headers_ver = ["Fecha", "Versión", "Autor / Elaboró", "Revisó", "Modificación", "Aprobación"]
    data_ver = [
        ("28/09/2026", "2.5.0", "Ing. Especialista TIC\nLíder de Soporte y UX", "Dirección de Planeación y TIC", "Manual Oficial de Usuario completo e ilustrado con 35 vistas recortadas de la plataforma.", "Dirección TIC /\nRectoría General")
    ]
    format_table(tbl_version, [0.9, 0.6, 1.3, 1.2, 1.5, 1.0], headers_ver, data_ver, "001F3F")

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    doc.add_heading("Firmas de responsabilidad institucional", level=2)
    tbl_firmas = doc.add_table(rows=3, cols=3)
    tbl_firmas.alignment = WD_TABLE_ALIGNMENT.CENTER
    firmas_data = [
        ("Elaboró / Modificó", "Revisó", "Aprobó"),
        (
            "\n\n\n_________________________________\nIng. Especialista TIC\nLíder de Soporte y Experiencia de Usuario\nDirección TIC",
            "\n\n\n_________________________________\nDirectora de Planeación y TIC\nDirección de Planeación y Calidad (E)\nInstitución / Organización",
            "\n\n\n_________________________________\nDirección General / Rectoría\nDirección Ejecutiva Institucional\nInstitución / Organización"
        ),
        ("Fecha: 28 de septiembre de 2026", "Fecha: 28 de septiembre de 2026", "Fecha: 28 de septiembre de 2026")
    ]
    for row_idx, row_values in enumerate(firmas_data):
        row = tbl_firmas.rows[row_idx]
        for col_idx, text_val in enumerate(row_values):
            cell = row.cells[col_idx]
            cell.text = text_val
            cell.width = Inches(2.16)
            if row_idx == 0:
                set_cell_background(cell, "F1F5F9")
                cell.paragraphs[0].runs[0].bold = True
                cell.paragraphs[0].runs[0].font.size = Pt(9)
                cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(0, 31, 63)
            else:
                set_cell_background(cell, "FFFFFF")
                cell.paragraphs[0].runs[0].font.size = Pt(8.5)
                cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(51, 65, 85)
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)

    doc.add_page_break()

    # =========================================================================
    # INTRODUCCIÓN GENERAL AL USUARIO
    # =========================================================================
    doc.add_heading("Introducción y guía de navegación", level=1)
    doc.add_paragraph(
        "El aplicativo de Gestión y Emisión de Carnets Digitales (Carnet Digital) ha sido diseñado para simplificar, "
        "agilizar y garantizar la seguridad en la identificación de colaboradores, estudiantes, visitantes y contratistas. "
        "Este manual operativo provee una guía paso a paso, ilustrada con las 35 pantallas y ventanas de la plataforma, "
        "para que cualquier operador o administrador domine las funcionalidades del sistema en pocos minutos."
    )

    doc.add_heading("Estructura de módulos de la guía de usuario", level=2)
    tbl_index = doc.add_table(rows=1, cols=3)
    headers_index = ["Módulo Operativo", "Cobertura de Funcionalidades", "Figuras Ilustradas"]
    data_index = [
        ("Módulo 1", "Ingreso, Registro, Cotizador de Planes y Pasarela de Pago", "Figuras 1 a 9"),
        ("Módulo 2", "Consola SuperAdmin de Sistema (Empresas, Planes, Suscripciones, Usuarios)", "Figuras 10 a 20"),
        ("Módulo 3", "Panel Corporativo de Empresa (Sedes, Áreas, Cargos, Nómina, Canvas y Carnetización)", "Figuras 21 a 35"),
        ("Anexo", "Mesa de Ayuda, Preguntas Frecuentes (FAQ) y Protocolo de Incidentes", "Tablas y Flujogramas")
    ]
    format_table(tbl_index, [1.5, 3.8, 1.2], headers_index, data_index, "001F3F")

    doc.add_page_break()

    # =========================================================================
    # MÓDULO 1: INGRESO, REGISTRO Y PAGO
    # =========================================================================
    doc.add_heading("Módulo 1. Ingreso, registro y pasarela de pago", level=1)

    # 1
    doc.add_heading("1. Portada principal y bienvenida comercial", level=2)
    doc.add_paragraph(
        "1. Abre tu navegador web (Google Chrome, Microsoft Edge o Mozilla Firefox).\n"
        "2. Ingresa a la URL oficial de la plataforma: `http://localhost:5173/`.\n"
        "3. Examina las opciones del menú de navegación superior y la propuesta de valor institucional."
    )
    add_screenshot(doc, "01_public_landing_hero.png", 1, "Pantalla de ingreso al portal web de Carnet Digital.")
    add_callout(doc, "Haz clic en el botón Empezar Ahora para comunicarte vía WhatsApp con un asesor de servicio institucional.", "TIP")

    # 2
    doc.add_heading("2. Catálogo interactivo de servicios y soluciones", level=2)
    doc.add_paragraph(
        "1. Desplázate hacia abajo en la página principal hasta la sección Servicios.\n"
        "2. Explora las soluciones de credencialización: Identificación Digital, Control de Asistencia, Acceso a Sedes y Eventos."
    )
    add_screenshot(doc, "02_public_landing_servicios.png", 2, "Catálogo de soluciones y funciones de credencialización.")

    # 3
    doc.add_heading("3. Consulta de planes y tarifas comerciales", level=2)
    doc.add_paragraph(
        "1. Haz clic en la opción Suscripciones del menú superior.\n"
        "2. Alterna entre la facturación mensual o anual (con descuento por pago anticipado).\n"
        "3. Selecciona el paquete comercial que cubra el número de colaboradores de tu organización."
    )
    add_screenshot(doc, "03_public_landing_planes.png", 3, "Selector de planes y tarifas de suscripción corporativa.")

    # 4
    doc.add_heading("4. Opciones de arquitectura e infraestructura", level=2)
    doc.add_paragraph(
        "1. Revisa las dos modalidades de despliegue disponibles.\n"
        "2. Compara las ventajas del servicio Cloud SaaS gestionado frente a la instalación On-Premises en servidores institucionales."
    )
    add_screenshot(doc, "04_public_landing_despliegue.png", 4, "Comparativa de arquitectura Cloud SaaS frente a On-Premises.")

    # 5
    doc.add_heading("5. Contacto comercial y pie de página", level=2)
    doc.add_paragraph(
        "1. Utiliza los canales directos del pie de página para resolver inquietudes técnicas o comerciales.\n"
        "2. Consulta las políticas de tratamiento de datos personales y términos de servicio institucional."
    )
    add_screenshot(doc, "05_public_landing_cta.png", 5, "Sección de llamado a la acción y enlaces institucionales.")

    # 6
    doc.add_heading("6. Portal de novedades y artículos técnicos", level=2)
    doc.add_paragraph(
        "1. Haz clic en la opción Blog de la barra superior.\n"
        "2. Filtra por categorías de interés para consultar guías de innovación y seguridad digital."
    )
    add_screenshot(doc, "06_public_blog.png", 6, "Directorio de publicaciones y artículos del blog institucional.")

    # 7
    doc.add_heading("7. Inicio de sesión en la plataforma", level=2)
    doc.add_paragraph(
        "1. Haz clic en el botón Entrar en la esquina superior derecha.\n"
        "2. Escribe tu correo electrónico corporativo registrado.\n"
        "3. Escribe tu contraseña de acceso asignada.\n"
        "4. Haz clic en el botón Iniciar Sesión."
    )
    add_screenshot(doc, "07_auth_login.png", 7, "Ventana de autenticación e inicio de sesión seguro.")
    add_callout(doc, "Si la plataforma está en ventana de mantenimiento técnico, el sistema mostrará un aviso informativo antes de ingresar.", "NOTE")

    # 8
    doc.add_heading("8. Registro de una nueva empresa cliente", level=2)
    doc.add_paragraph(
        "1. En el formulario de acceso, haz clic en el enlace ¿No tienes cuenta? Regístrate aquí.\n"
        "2. Escribe la razón social de tu empresa y el NIT con dígito de verificación.\n"
        "3. Ingresa los datos del administrador y define una contraseña segura de al menos 8 caracteres."
    )
    add_screenshot(doc, "08_auth_registro_paso1.png", 8, "Formulario inicial para dar de alta una nueva organización.")

    # 9
    doc.add_heading("9. Confirmación de suscripción exitosa", level=2)
    doc.add_paragraph(
        "1. Al finalizar el pago en la pasarela Mercado Pago, el sistema mostrará la confirmación con tu identificador de transacción.\n"
        "2. Haz clic en Ir al Login para iniciar sesión y acceder al panel corporativo."
    )
    add_screenshot(doc, "09_auth_pago_aprobado.png", 9, "Comprobante oficial de pago aprobado y activación de cuenta.")

    doc.add_page_break()

    # =========================================================================
    # MÓDULO 2: CONSOLA SUPERADMIN DE SISTEMA
    # =========================================================================
    doc.add_heading("Módulo 2. Consola SuperAdmin de plataforma", level=1)

    # 10
    doc.add_heading("10. Tablero de control y métricas globales", level=2)
    doc.add_paragraph(
        "1. Revisa los indicadores clave de desempeño: Empresas activas, ingresos mensuales recurrentes (MRR) y total de carnets emitidos.\n"
        "2. Examina la gráfica de crecimiento intermensual y el registro de eventos recientes."
    )
    add_screenshot(doc, "10_system_dashboard.png", 10, "Tablero de control principal de la plataforma central.")

    # 11
    doc.add_heading("11. Directorio de empresas suscritas", level=2)
    doc.add_paragraph(
        "1. Haz clic en la opción Empresas del menú lateral izquierdo.\n"
        "2. Consulta el listado de organizaciones con su plan activo, fecha de expiración y estado operativo.\n"
        "3. Utiliza la barra de búsqueda para ubicar rápidamente una empresa por su nombre o NIT."
    )
    add_screenshot(doc, "11_system_empresas.png", 11, "Directorio maestro y buscador de empresas suscritas.")

    # 12
    doc.add_heading("12. Registro manual de una nueva empresa", level=2)
    doc.add_paragraph(
        "1. Haz clic en el botón superior + Nueva Empresa.\n"
        "2. Ingresa la razón social, NIT, correo institucional, teléfono de contacto y selecciona el plan comercial asignado.\n"
        "3. Haz clic en Guardar Empresa para crear el registro y enviar las credenciales automáticas."
    )
    add_screenshot(doc, "12_system_modal_crear_empresa.png", 12, "Ventana emergente para dar de alta una nueva empresa.")

    # 13
    doc.add_heading("13. Catálogo de planes y configuración de tarifas", level=2)
    doc.add_paragraph(
        "1. Haz clic en Planes en el menú lateral.\n"
        "2. Visualiza las tarjetas de los paquetes comerciales (Básico, Profesional, Empresarial).\n"
        "3. Consulta el precio mensual, precio anual y límites de usuarios y carnets."
    )
    add_screenshot(doc, "13_system_planes.png", 13, "Catálogo comercial de planes y cuotas del sistema.")

    # 14
    doc.add_heading("14. Modal para crear un nuevo paquete comercial", level=2)
    doc.add_paragraph(
        "1. Haz clic en + Nuevo Plan en la esquina superior.\n"
        "2. Define el nombre del plan, precios en moneda local y los topes máximos de colaboradores y carnets.\n"
        "3. Haz clic en Guardar Plan."
    )
    add_screenshot(doc, "13b_system_modal_crear_plan.png", 14, "Formulario emergente para la configuración de un nuevo plan comercial.")

    # 15
    doc.add_heading("15. Auditoría de suscripciones y vigencias", level=2)
    doc.add_paragraph(
        "1. Haz clic en Suscripciones en el menú lateral.\n"
        "2. Revisa el historial de transacciones, fechas de inicio y finalización de cobertura.\n"
        "3. Filtra por estado: Activa, Vencida o Pendiente de Pago."
    )
    add_screenshot(doc, "14_system_suscripciones.png", 15, "Módulo de auditoría de suscripciones corporativas.")

    # 16
    doc.add_heading("16. Directorio de usuarios administradores del sistema", level=2)
    doc.add_paragraph(
        "1. Haz clic en Usuarios en el menú del SuperAdmin.\n"
        "2. Consulta el listado de operadores internos con acceso a la consola central."
    )
    add_screenshot(doc, "15_system_usuarios.png", 16, "Directorio de usuarios administradores de plataforma.")

    # 17
    doc.add_heading("17. Modal para dar de alta un usuario de plataforma", level=2)
    doc.add_paragraph(
        "1. Haz clic en + Nuevo Usuario.\n"
        "2. Diligencia los nombres, correo institucional, rol de sistema y contraseña inicial.\n"
        "3. Haz clic en Guardar Usuario."
    )
    add_screenshot(doc, "15b_system_modal_crear_usuario.png", 17, "Ventana para el registro de un nuevo operador del sistema.")

    # 18
    doc.add_heading("18. Matriz de roles y permisos globales", level=2)
    doc.add_paragraph(
        "1. Haz clic en Roles en el menú lateral.\n"
        "2. Visualiza los perfiles de acceso definidos (SuperAdmin, Soporte, Auditor) y su alcance de gestión."
    )
    add_screenshot(doc, "16_system_roles.png", 18, "Catálogo de roles de seguridad de la plataforma.")

    # 19
    doc.add_heading("19. Modal para crear un nuevo rol de sistema", level=2)
    doc.add_paragraph(
        "1. Haz clic en + Nuevo Rol.\n"
        "2. Asigna un nombre al perfil y marca las casillas de privilegios requeridas (Crear, Editar, Eliminar, Auditar).\n"
        "3. Haz clic en Guardar Rol."
    )
    add_screenshot(doc, "16b_system_modal_crear_rol.png", 19, "Configuración de privilegios granulares para un nuevo rol.")

    # 20
    doc.add_heading("20. Configuración de parámetros globales y comunicados", level=2)
    doc.add_paragraph(
        "1. Haz clic en Parámetros en el menú lateral.\n"
        "2. Gestiona los banners informativos mostrados a las empresas clientes.\n"
        "3. Activa o desactiva la ventana de mantenimiento del sistema cuando se realicen actualizaciones."
    )
    add_screenshot(doc, "17_system_parametros_banners.png", 20, "Panel de administración de parámetros globales y banners.")

    doc.add_page_break()

    # =========================================================================
    # MÓDULO 3: PANEL CORPORATIVO DE EMPRESA
    # =========================================================================
    doc.add_heading("Módulo 3. Panel corporativo de empresa (Tenant)", level=1)

    # 21
    doc.add_heading("21. Panel de bienvenida y estadísticas internas", level=2)
    doc.add_paragraph(
        "1. Al iniciar sesión como empresa, visualiza el consumo de cuotas del plan: Colaboradores registrados y carnets emitidos.\n"
        "2. Revisa el estado del plan contratado y los accesos rápidos a las funciones operativas."
    )
    add_screenshot(doc, "18_company_dashboard.png", 21, "Panel de control principal de la empresa cliente.")

    # 22
    doc.add_heading("22. Directorio de sedes físicas de la empresa", level=2)
    doc.add_paragraph(
        "1. Haz clic en Sedes en el menú lateral.\n"
        "2. Consulta las instalaciones físicas, sucursales y campus registrados de tu organización."
    )
    add_screenshot(doc, "19_company_sedes.png", 22, "Directorio maestro de sedes físicas corporativas.")

    # 23
    doc.add_heading("23. Modal de registro de nueva sede física", level=2)
    doc.add_paragraph(
        "1. Haz clic en + Nueva Sede.\n"
        "2. Escribe el nombre de la sede, dirección postal y ciudad correspondiente.\n"
        "3. Haz clic en Guardar Sede."
    )
    add_screenshot(doc, "20_company_modal_crear_sede.png", 23, "Ventana emergente para dar de alta una nueva sede.")

    # 24
    doc.add_heading("24. Estructura de áreas departamentales vinculadas a sedes", level=2)
    doc.add_paragraph(
        "1. Haz clic en Áreas en el menú lateral.\n"
        "2. Visualiza la distribución de departamentos (Operaciones, TI, Talento Humano) asociados a cada sede."
    )
    add_screenshot(doc, "21_company_areas.png", 24, "Gestión de departamentos organizacionales adscritos a sedes.")

    # 25
    doc.add_heading("25. Modal para registrar una nueva área de trabajo", level=2)
    doc.add_paragraph(
        "1. Haz clic en + Nueva Área.\n"
        "2. Selecciona la sede física a la que pertenece y escribe el nombre del departamento.\n"
        "3. Haz clic en Guardar Área."
    )
    add_screenshot(doc, "22_company_modal_crear_area.png", 25, "Formulario de registro de una nueva área departamental.")

    # 26
    doc.add_heading("26. Catálogo de cargos laborales de la organización", level=2)
    doc.add_paragraph(
        "1. Haz clic en Cargos en el menú lateral.\n"
        "2. Revisa el listado de cargos laborales vinculados a sus respectivas áreas departamentales."
    )
    add_screenshot(doc, "23_company_cargos.png", 26, "Directorio de cargos y puestos de trabajo de la empresa.")

    # 27
    doc.add_heading("27. Modal de creación de nuevo cargo", level=2)
    doc.add_paragraph(
        "1. Haz clic en + Nuevo Cargo.\n"
        "2. Selecciona el área a la que pertenece el puesto y digita el nombre del cargo.\n"
        "3. Haz clic en Guardar Cargo."
    )
    add_screenshot(doc, "24_company_modal_crear_cargo.png", 27, "Ventana emergente para la configuración de un nuevo cargo.")

    # 28
    doc.add_heading("28. Directorio de colaboradores a carnetizar", level=2)
    doc.add_paragraph(
        "1. Haz clic en Colaboradores en el menú lateral.\n"
        "2. Consulta el listado del personal con su documento, nombres completos, cargo y estado de carnetización.\n"
        "3. Utiliza los filtros por área y la barra de búsqueda rápida."
    )
    add_screenshot(doc, "25_company_colaboradores.png", 28, "Directorio de colaboradores y nómina activa.")

    # 29
    doc.add_heading("29. Modal de alta de colaborador con fotografía", level=2)
    doc.add_paragraph(
        "1. Haz clic en + Nuevo Colaborador.\n"
        "2. Selecciona el tipo de documento (CC, CE, TI, Pasaporte) y escribe el número de identificación.\n"
        "3. Diligencia nombres, apellidos, correo institucional, cargo asignado y carga la fotografía formal en formato JPG o PNG.\n"
        "4. Haz clic en Guardar Colaborador."
    )
    add_screenshot(doc, "26_company_modal_colaborador.png", 29, "Formulario completo para dar de alta a un colaborador con su fotografía.")
    add_callout(doc, "Para garantizar la nitidez del carnet, utiliza fotografías con fondo blanco o claro, de frente y sin accesorios que cubran el rostro.", "TIP")

    # 30
    doc.add_heading("30. Galería de plantillas gráficas de carnet", level=2)
    doc.add_paragraph(
        "1. Haz clic en Plantillas en el menú lateral.\n"
        "2. Visualiza las plantillas de carnet prediseñadas (verticales y horizontales).\n"
        "3. Haz clic en Editar en cualquier plantilla o crea una nueva desde cero."
    )
    add_screenshot(doc, "27_company_plantillas.png", 30, "Galería de diseños y plantillas de credenciales digitales.")

    # 31
    doc.add_heading("31. Diseñador gráfico Canvas interactivo", level=2)
    doc.add_paragraph(
        "1. Ingresa al editor Canvas interactivo de carnets.\n"
        "2. Arrastra y posiciona los elementos dinámicos: Foto, Nombres, Cargo, Sede, Logotipo y Código QR criptográfico.\n"
        "3. Configura tipografías, colores institucionales y haz clic en Guardar Plantilla."
    )
    add_screenshot(doc, "28_company_disenador_canvas.png", 31, "Editor gráfico interactivo sobre Canvas de HTML5 con capas en tiempo real.")

    # 32
    doc.add_heading("32. Módulo de carnetización y emisión de credenciales", level=2)
    doc.add_paragraph(
        "1. Haz clic en Carnetización en el menú lateral.\n"
        "2. Visualiza la tabla con las credenciales digitales emitidas, fechas de vencimiento y estado (Activo / Revocado).\n"
        "3. Descarga el carnet individual en formato PDF de alta resolución (300 DPI)."
    )
    add_screenshot(doc, "29_company_carnetizacion.png", 32, "Módulo de gestión y seguimiento de carnets emitidos.")

    # 33
    doc.add_heading("33. Modal de confirmación de emisión y vigencia", level=2)
    doc.add_paragraph(
        "1. Selecciona al colaborador y la plantilla gráfica a aplicar.\n"
        "2. Fija la fecha de expiración legal del carnet.\n"
        "3. Haz clic en Emitir Carnet para generar el código QR seguro con firma SHA-256."
    )
    add_screenshot(doc, "29b_company_modal_emitir_carnet.png", 33, "Ventana de confirmación y selección de parámetros para emisión de carnet.")

    # 34
    doc.add_heading("34. Personalización de marca corporativa (White-Labeling)", level=2)
    doc.add_paragraph(
        "1. Haz clic en Mi Empresa / Branding en el menú lateral.\n"
        "2. Carga el logotipo oficial de tu organización en formato PNG transparente.\n"
        "3. Escoge los colores primario y secundario corporativos y guarda los cambios para personalizar la interfaz."
    )
    add_screenshot(doc, "30_company_branding_parametros.png", 34, "Módulo de configuración de marca blanca y personalización gráfica.")

    # 35
    doc.add_heading("35. Supervisión del plan corporativo y estado de cobros", level=2)
    doc.add_paragraph(
        "1. Haz clic en Suscripción en el menú lateral.\n"
        "2. Consulta los días restantes de vigencia de tu plan comercial y el consumo actual de cuotas.\n"
        "3. Haz clic en Mejorar Plan o Renovar para acceder directamente al pago en línea."
    )
    add_screenshot(doc, "31_company_suscripcion.png", 35, "Panel de control del plan contratado y estado de la suscripción.")

    doc.add_page_break()

    # =========================================================================
    # ANEXO: MESA DE AYUDA Y CONTINGENCIAS
    # =========================================================================
    doc.add_heading("Anexo: Mesa de ayuda y solución de incidencias", level=1)
    doc.add_paragraph(
        "Si experimentas dificultades durante la operación diaria de la plataforma, consulta la siguiente matriz de preguntas frecuentes y soluciones recomendadas:"
    )

    tbl_faq = doc.add_table(rows=1, cols=3)
    headers_faq = ["Incidencia o Pregunta Frecuente", "Causa Probable", "Acción de Resolución Recomendada"]
    data_faq = [
        (
            "No puedo ingresar a la plataforma (Error 401)",
            "Contraseña errónea o correo electrónico no registrado.",
            "Verifica que el correo no tenga espacios adicionales. Si persiste, solicita a tu administrador el restablecimiento de clave."
        ),
        (
            "Aparece el mensaje 'Límite de colaboradores alcanzado'",
            "Tu plan comercial llegó al tope máximo de cupos contratados.",
            "Dirígete al menú Suscripción y solicita una ampliación de cupos o actualiza a un plan superior."
        ),
        (
            "El código QR del carnet no es reconocido por el lector",
            "Resolución insuficiente o pantalla con brillo muy bajo.",
            "Aumenta el brillo de la pantalla del dispositivo móvil o descarga el PDF oficial e imprímelo en calidad estándar (300 DPI)."
        ),
        (
            "Error al subir la fotografía del colaborador",
            "Archivo superior a 5 MB o formato no permitido.",
            "Asegúrate de que la imagen esté en formato JPG o PNG y que su tamaño no supere los 5 MB."
        ),
        (
            "El carnet aparece en estado 'Vencido'",
            "La fecha de expiración fijada durante la emisión fue superada.",
            "Ingresa al módulo Carnetización, selecciona al colaborador y genera una reemisión actualizando la fecha de vigencia."
        )
    ]
    format_table(tbl_faq, [2.0, 2.0, 2.5], headers_faq, data_faq, "001F3F")

    doc.add_paragraph().paragraph_format.space_after = Pt(20)
    add_callout(doc, "Para soporte técnico avanzado de segundo nivel, contacta a la Mesa de Ayuda institucional en soporte@carnetdigital.com o vía canal telefónico corporativo.", "NOTE")

    # Guardar en ambas ubicaciones
    print(f"Guardando documento Word en: {DOCX_OUTPUT_FRONT} ...")
    doc.save(DOCX_OUTPUT_FRONT)
    print(f"Guardando documento Word en: {DOCX_OUTPUT_BACK} ...")
    doc.save(DOCX_OUTPUT_BACK)
    print("¡MANUAL DE USUARIO GENERADO EXITOSAMENTE EN WORD!")

if __name__ == "__main__":
    build_user_manual()
