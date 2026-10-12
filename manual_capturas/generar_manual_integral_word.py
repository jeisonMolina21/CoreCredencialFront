# -*- coding: utf-8 -*-
"""
Generador Maestro del Documento Word Oficial:
DIRECCIÓN TIC - MANUAL INTEGRAL DE ARQUITECTURA TÉCNICA (FRONTEND & BACKEND) Y GUÍA OFICIAL DE USUARIO
APLICATIVO CARNET DIGITAL (VERSIÓN 2026)
Con desglose exhaustivo del backend por carpetas (config, middleware, routes, controllers, services, models, validators, utils, helpers, jobs).
Estandarizado según la Guía de Estilo de Escritura de Microsoft (Microsoft Writing Style Guide).
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT_FRONT = r"f:\personal\CoreCredential-Front-main\MANUAL_INTEGRAL_TECNICO_Y_DE_USUARIO_CARNET_DIGITAL.docx"
DOCX_OUTPUT_BACK = r"f:\personal\CoreCredential-Back-main\MANUAL_INTEGRAL_TECNICO_Y_DE_USUARIO_CARNET_DIGITAL.docx"
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

    bg = bg_colors.get(callout_type, "F8FAFC")
    bcolor = border_colors.get(callout_type, "2563EB")
    prefix = prefixes.get(callout_type, "Nota: ")

    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:left w:val="single" w:sz="36" w:space="0" w:color="{bcolor}"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    
    r_prefix = p.add_run(prefix)
    r_prefix.bold = True
    r_prefix.font.size = Pt(9.5)
    r_prefix.font.color.rgb = RGBColor(0, 31, 63)
    
    r_text = p.add_run(text)
    r_text.font.size = Pt(9.5)
    r_text.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def format_table(table, col_widths, headers, data, header_bg="001F3F"):
    """Aplica formato estructurado institucional a tablas."""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Encabezados
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

    # Filas de datos
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
    r_cap.font.size = Pt(8.5)
    r_cap.font.color.rgb = RGBColor(100, 116, 139)

def main():
    print("Iniciando compilación del Manual Integral con Desglose de Backend por Carpetas...")
    doc = Document()

    # Márgenes estándar (1 pulgada = 2.54 cm)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # =========================================================================
    # PORTADA INSTITUCIONAL
    # =========================================================================
    p_inst = doc.add_paragraph()
    p_inst.paragraph_format.space_before = Pt(36)
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run("DIRECCIÓN TIC\nDEPARTAMENTO DE DESARROLLO E INFRAESTRUCTURA TECNOLÓGICA")
    r_inst.bold = True
    r_inst.font.size = Pt(11)
    r_inst.font.color.rgb = RGBColor(0, 98, 227)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(20)
    p_title.paragraph_format.space_after = Pt(8)
    r_title = p_title.add_run("Carnet Digital")
    r_title.bold = True
    r_title.font.size = Pt(40)
    r_title.font.name = "Calibri"
    r_title.font.color.rgb = RGBColor(0, 31, 63)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(16)
    r_sub = p_sub.add_run("Manual Técnico Integral de Arquitectura (Frontend & Backend) y Guía Oficial de Usuario")
    r_sub.font.size = Pt(15)
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    p_tag = doc.add_paragraph()
    p_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tag.paragraph_format.space_after = Pt(28)
    r_tag = p_tag.add_run("Plataforma empresarial de emisión, gestión y validación de credenciales inteligentes con código QR")
    r_tag.italic = True
    r_tag.font.size = Pt(10)
    r_tag.font.color.rgb = RGBColor(100, 116, 139)

    # Control de versiones institucional
    doc.add_heading("Control de versiones", level=2)
    tbl_version = doc.add_table(rows=1, cols=6)
    headers_version = ["Fecha", "Versión", "Autor / Elaboró", "Revisó", "Modificación", "Aprobación"]
    data_version = [
        (
            "28/09/2026",
            "2.5.0",
            "Ing. Especialista TIC\nArquitectura de Software",
            "Dirección de Planeación y TIC",
            "Documento integral consolidado: Arquitectura Backend desglosada por carpetas (config, middleware, routes, controllers, services, models, validators, utils, jobs), Frontend (React 19) y Manual de Usuario de 35 vistas.",
            "Dirección TIC /\nRectoría"
        )
    ]
    format_table(tbl_version, [0.8, 0.6, 1.3, 1.2, 1.6, 1.0], headers_version, data_version, "001F3F")

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Firmas institucionales
    tbl_firmas = doc.add_table(rows=2, cols=3)
    tbl_firmas.alignment = WD_TABLE_ALIGNMENT.CENTER
    firmas_data = [
        ("Elaboró / Modificó:", "Revisó:", "Aprobó:"),
        (
            "Ing. Especialista TIC\nLíder de Desarrollo Full Stack\nDirección TIC\nFecha: 28 de septiembre de 2026",
            "Directora de Planeación y TIC\nDirección de Planeación (E)\nInstitución / Organización\nFecha: 28 de septiembre de 2026",
            "Dirección General / Rectoría\nDirección Ejecutiva Institucional\nInstitución / Organización\nFecha: 28 de septiembre de 2026"
        )
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
    # INTRODUCCIÓN GENERAL
    # =========================================================================
    doc.add_heading("Introducción", level=1)
    doc.add_paragraph(
        "El aplicativo de Gestión y Emisión de Carnets Digitales (Carnet Digital) ha sido desarrollado para modernizar, "
        "agilizar y garantizar la trazabilidad en la identificación corporativa e institucional de colaboradores, estudiantes, "
        "visitantes y contratistas, asegurando el cumplimiento de las políticas de seguridad de la información y la normativa de protección de datos personales."
    )
    doc.add_paragraph(
        "Este manual unificado reúne la documentación técnica completa del sistema. En la Parte 1 se detalla minuciosamente la arquitectura del backend "
        "desglosada por cada una de sus carpetas y componentes (config, middleware, routes, controllers, services, models, validators, utils, helpers y jobs). "
        "En la Parte 2 se aborda la arquitectura del frontend en React 19 y su motor Canvas, mientras que la Parte 3 contiene el manual operativo paso a paso ilustrado con 35 figuras recortadas."
    )

    doc.add_heading("Contenido y mapa del documento", level=2)
    tbl_index = doc.add_table(rows=1, cols=3)
    headers_index = ["Fase / Parte", "Materia técnica y temática", "Público destinatario"]
    data_index = [
        ("Parte 1", "Arquitectura del Backend: Explicación exhaustiva por carpetas (config, middleware, routes, controllers, services, models, validators, utils, jobs) y catálogo REST", "Arquitectos de software, ingenieros backend y DBAs"),
        ("Parte 2", "Arquitectura del Frontend: React 19, Vite, Canvas API, enrutamiento y servicios", "Líderes de frontend, diseñadores UI/UX y analistas QA"),
        ("Parte 3", "Manual de Usuario e Instructivo Paso a Paso (35 pantallas y modales explicados)", "Administradores de talento humano, directores y operadores"),
        ("Anexo", "Preguntas frecuentes (FAQ) y protocolo de resolución de incidentes", "Mesa de ayuda y equipo de soporte técnico")
    ]
    format_table(tbl_index, [1.0, 3.8, 1.7], headers_index, data_index, "001F3F")

    doc.add_page_break()

    # =========================================================================
    # PARTE 1: ARQUITECTURA TÉCNICA DEL BACKEND (DESGLOSE POR CARPETAS)
    # =========================================================================
    doc.add_heading("Parte 1. Arquitectura técnica del backend", level=1)

    doc.add_heading("1.1 Visión arquitectónica y topología general de carpetas", level=2)
    doc.add_paragraph(
        "El backend de Carnet Digital está implementado en Node.js (v20+ LTS) con Express 5 y Sequelize ORM sobre MySQL. "
        "El código fuente en `src/` implementa una arquitectura en capas estrictamente desacoplada, donde cada carpeta "
        "asume un rol único en el flujo de procesamiento de cada solicitud:"
    )

    tbl_b_folders = doc.add_table(rows=1, cols=3)
    headers_b_folders = ["Carpeta en src/", "Responsabilidad arquitectónica", "Archivos y módulos clave"]
    data_b_folders = [
        ("src/config/", "Conexión a base de datos y pooling de conexiones.", "database.js"),
        ("src/middleware/", "Seguridad perimetral, autenticación JWT, contexto y captura de errores.", "authMiddleware.js, contextMiddleware.js, errorMiddleware.js, validateMiddleware.js, uploadMiddleware.js"),
        ("src/routes/", "Enrutamiento modular, mapeo de rutas HTTP y vinculación de middlewares.", "index.js, authRoutes.js, companyRoutes.js, carnetRoutes.js, subscriptionRoutes.js"),
        ("src/controllers/", "Gestión de entrada HTTP, extracción de parámetros y emisión de respuestas.", "authUnifiedController.js, companyCarnetController.js, companyUserController.js, webhookController.js"),
        ("src/services/", "Lógica de negocio pura, transacciones ACID y orquestación con APIs externas.", "authService.js, companyCarnetService.js, mercadopagoService.js, planService.js"),
        ("src/models/", "Definición de modelos relacionales Sequelize (Core, Tenant y Sistema).", "models/core/ (Company), models/tenant/ (Carnet, User, Area, Sede), models/ (Plans, Subs)"),
        ("src/validators/", "Esquemas declarativos de validación y sanitización con Joi.", "authValidator.js, companyValidator.js, carnetValidator.js, planValidator.js"),
        ("src/utils/", "Herramientas transversales: límites de plan, contexto ALS, logging y caché.", "planLimits.js, context.js, logger.js, cache.js, appError.js"),
        ("src/helpers/", "Siembra inicial de datos (Seeders) y envoltorios asíncronos.", "initializeSystemData.js, asyncHandler.js"),
        ("src/jobs/ & workers/", "Tareas programadas Cron y procesamiento en segundo plano.", "subscriptionExpiryJob.js, billingWorker.js")
    ]
    format_table(tbl_b_folders, [1.5, 2.3, 2.7], headers_b_folders, data_b_folders, "001F3F")

    add_callout(doc, "La separación en capas garantiza que los controladores desconozcan la lógica SQL directa, delegándola en los servicios y modelos para facilitar pruebas y mantenimiento.", "NOTE")

    # --- 1.2 CONFIG ---
    doc.add_heading("1.2 Carpeta src/config/ (Configuración y conexiones)", level=2)
    doc.add_paragraph(
        "La carpeta `src/config/` centraliza la inicialización de conexiones externas, especialmente la base de datos MySQL mediante Sequelize (`database.js`).\n\n"
        "• Conexión mediante Sequelize: Lee las variables de entorno `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_TIMEZONE`.\n"
        "• Pool de conexiones administrado: Configura un pool de conexiones reutilizables (máximo 10 conexiones simultáneas, mínimo 0, tiempo de inactividad de 10 segundos) para evitar saturar el servidor MySQL.\n"
        "• Zona horaria unificada: Fuerza el offset `-05:00` en Sequelize y fija `process.env.TZ = 'America/Bogota'` en Node.js, garantizando que las fechas de emisión y expiración de carnets no sufran desfaces horarios."
    )

    # --- 1.3 MIDDLEWARE ---
    doc.add_heading("1.3 Carpeta src/middleware/ (Seguridad, contexto y validación)", level=2)
    doc.add_paragraph(
        "Los middlewares interceptan y procesan cada solicitud antes de que alcance los controladores de negocio:"
    )

    tbl_b_mid = doc.add_table(rows=1, cols=3)
    headers_b_mid = ["Middleware", "Archivo", "Función técnica y flujo de ejecución"]
    data_b_mid = [
        (
            "Contexto y Request-ID",
            "contextMiddleware.js",
            "Inicializa AsyncLocalStorage para la petición y asigna un identificador único x-request-id (UUIDv4) que acompaña todos los logs y respuestas."
        ),
        (
            "Autenticación JWT",
            "authMiddleware.js",
            "Extrae la cabecera Authorization: Bearer <token>, valida la firma criptográfica con JWT_SECRET y clasifica al usuario en system o company. Verifica que la empresa no esté suspendida."
        ),
        (
            "Control de Roles (RBAC)",
            "authMiddleware.js",
            "Verifica que el usuario posea los roles requeridos para el endpoint (ejemplo: requiere admin de sistema o admin de empresa)."
        ),
        (
            "Validación Joi",
            "validateMiddleware.js",
            "Ejecuta el esquema de validación correspondiente sobre req.body, req.query o req.params. Si hay errores de formato, responde con HTTP 400 y detiene la petición."
        ),
        (
            "Carga de Archivos",
            "uploadMiddleware.js",
            "Configura Multer con filtro de tipos MIME (solo JPG/PNG) y límite de 5 MB para fotos de colaboradores y logotipos institucionales."
        ),
        (
            "Manejador Global de Errores",
            "errorMiddleware.js",
            "Captura cualquier excepción no controlada, registra la traza de error en Winston con su Request-ID y devuelve un JSON uniforme con código HTTP apropiado."
        )
    ]
    format_table(tbl_b_mid, [1.5, 1.8, 3.2], headers_b_mid, data_b_mid, "001F3F")

    # --- 1.4 ROUTES ---
    doc.add_heading("1.4 Carpeta src/routes/ (Enrutamiento modular)", level=2)
    doc.add_paragraph(
        "El enrutador central `src/routes/index.js` agrupa y monta las rutas bajo prefijos semánticos RESTful:\n"
        "• `/api/auth`: Rutas de inicio de sesión unificado, registro de empresas, verificación de token y configuración de pasarela (`authRoutes.js`).\n"
        "• `/api/companies`: Gestión del ciclo de vida de empresas clientes (`companyRoutes.js`).\n"
        "• `/api/plans` y `/api/subscriptions`: Administración comercial de paquetes y auditoría de suscripciones (`planRoutes.js`, `subscriptionRoutes.js`).\n"
        "• `/api/headquarters`, `/api/areas`, `/api/cargos`: Endpoints de estructura organizacional multi-inquilino.\n"
        "• `/api/colaboradores`: Nómina de personal y carga de fotografías multipart (`companyUserRoutes.js`).\n"
        "• `/api/templates` y `/api/carnets`: Módulos de diseño visual y emisión de carnets QR (`companyCarnetRoutes.js`).\n"
        "• `/api/webhooks/mercadopago`: Recepción de notificaciones asíncronas de pago con verificación de firma HMAC."
    )

    # --- 1.5 CONTROLLERS ---
    doc.add_heading("1.5 Carpeta src/controllers/ (Controladores de peticiones HTTP)", level=2)
    doc.add_paragraph(
        "Los controladores actúan como adaptadores entre el protocolo HTTP y la lógica de negocio:\n"
        "1. Extraen los datos de la solicitud (`req.body`, `req.params`, `req.query`, `req.user`).\n"
        "2. Invocan los métodos correspondientes en la capa de servicios.\n"
        "3. Estructuran la respuesta JSON y devuelven el código de estado HTTP adecuado:\n"
        "   - `200 OK`: Consultas y actualizaciones exitosas.\n"
        "   - `201 Created`: Creación de nuevos recursos (empresa, carnet, colaborador).\n"
        "   - `204 No Content`: Eliminaciones o revocaciones sin cuerpo de retorno.\n\n"
        "Controladores clave: `authUnifiedController.js` (login universal), `companyCarnetController.js` (emisión y revocación de credenciales), `companyUserController.js` (directorio de personal) y `webhookController.js` (conciliación de pagos)."
    )

    # --- 1.6 SERVICES ---
    doc.add_heading("1.6 Carpeta src/services/ (Lógica de negocio y servicios)", level=2)
    doc.add_paragraph(
        "La capa de servicios contiene las reglas de negocio esenciales y orquesta las transacciones ACID con la base de datos:"
    )

    tbl_b_serv = doc.add_table(rows=1, cols=3)
    headers_b_serv = ["Servicio", "Archivo", "Lógica de negocio y responsabilidades"]
    data_b_serv = [
        (
            "Servicio de Autenticación",
            "authService.js",
            "Ejecuta el login unificado: busca en company_users (tenant) verificando el estado de la empresa; si no existe, busca en system_users. Compara contraseñas con bcrypt y genera el token JWT con expiración de 1 hora."
        ),
        (
            "Servicio de Carnetización",
            "companyCarnetService.js",
            "Valida que la cuota de carnets del plan no esté agotada (planLimits.js), genera un hash criptográfico único SHA-256 para el código QR, calcula la fecha de expiración y persiste el carnet en la base de datos."
        ),
        (
            "Servicio de Mercado Pago",
            "mercadopagoService.js",
            "Interactúa con la API de Mercado Pago SDK: genera las preferencias de cobro para suscripciones, valida la firma HMAC x-signature del webhook y activa automáticamente el plan de la empresa al recibir el pago aprobado."
        ),
        (
            "Servicio de Empresas",
            "companyService.js",
            "Gestiona el alta de nuevas empresas, vinculación al plan gratuito inicial o comercial y actualización de estado (activo/inactivo)."
        ),
        (
            "Servicio de Plantillas",
            "companyTemplateCarnetService.js",
            "Valida la estructura JSON del diseñador Canvas, dimensiones de carnet y asignación de plantilla predeterminada."
        )
    ]
    format_table(tbl_b_serv, [1.5, 1.8, 3.2], headers_b_serv, data_b_serv, "001F3F")

    # --- 1.7 MODELS ---
    doc.add_page_break()
    doc.add_heading("1.7 Carpeta src/models/ (Modelado relacional Sequelize)", level=2)
    doc.add_paragraph(
        "Los modelos Sequelize definen las tablas, tipos de columnas, índices y asociaciones relacionales en MySQL. "
        "Están organizados en 3 subdominios:"
    )

    doc.add_paragraph(
        "1. Subcarpeta `models/core/` (Entidades base de la organización):\n"
        "   • `company.js`: Datos de la empresa cliente (razón social, NIT, correo, teléfono, estado activo/inactivo, plan_id).\n"
        "   • `companyParameter.js`: Configuración de personalización visual (color primario, secundario, logotipo, tipografía).\n"
        "   • `companyLog.js`: Bitácora interna de acciones y modificaciones dentro del tenant.\n\n"
        "2. Subcarpeta `models/tenant/` (Entidades operativas vinculadas a company_id):\n"
        "   • `companyHeadquarter.js`: Sedes físicas y sucursales.\n"
        "   • `companyArea.js`: Áreas departamentales asociadas a sedes.\n"
        "   • `companyRol.js`: Cargos laborales adscritos a áreas.\n"
        "   • `companyUser.js`: Colaboradores con tipo de documento, nombres, correo y foto.\n"
        "   • `companyTemplateCarnet.js`: Plantillas de carnet con orientación y esquema de capas JSON.\n"
        "   • `companyCarnet.js`: Credenciales emitidas con hash QR, fechas de emisión/expiración y estado (activo/revocado).\n\n"
        "3. Subcarpeta `models/` raíz (Entidades del núcleo de sistema):\n"
        "   • `plans.js`, `subscription.js`, `systemUser.js`, `systemRol.js`, `systemParameter.js`, `systemLog.js`, `payment.js`, `paymentMethod.js`, `Banner.js`.\n\n"
        "Archivo maestro `models/index.js`:\n"
        "Establece las relaciones referenciales (`Company.hasMany(Headquarter)`, `Headquarter.hasMany(Area)`, `Area.hasMany(CompanyRol)`, "
        "`CompanyUser.hasMany(Carnet)`, etc.) configurando borrados en cascada restringidos (`ON DELETE RESTRICT`) para preservar la integridad histórica."
    )

    # --- 1.8 VALIDATORS ---
    doc.add_heading("1.8 Carpeta src/validators/ (Validación de esquemas con Joi)", level=2)
    doc.add_paragraph(
        "Garantiza que ninguna petición con datos maliciosos, tipos incorrectos o campos faltantes acceda a la base de datos:\n"
        "• `authValidator.js`: Valida que el correo tenga formato RFC válido y la contraseña cumpla longitud mínima de 6 caracteres.\n"
        "• `companyValidator.js`: Exige razón social (3 a 150 caracteres), formato de NIT numérico con dígito de verificación y teléfono válido.\n"
        "• `carnetValidator.js`: Valida que `user_id` y `template_id` sean enteros positivos y que la fecha de expiración sea estrictamente futura.\n"
        "• `planValidator.js`: Verifica que los límites (`max_users`, `max_carnets`) sean números enteros iguales o mayores a cero."
    )

    # --- 1.9 UTILS ---
    doc.add_heading("1.9 Carpeta src/utils/ (Utilidades nucleares y observabilidad)", level=2)
    doc.add_paragraph(
        "Centraliza funciones y componentes transversales de soporte:\n"
        "• `planLimits.js`: Motor de control de cuotas. Compara el conteo de registros actuales de una empresa contra los topes máximos de su plan contratado antes de permitir inserciones.\n"
        "• `context.js`: Encapsula la instancia de `AsyncLocalStorage` de Node.js, permitiendo acceder al ID de petición y datos del usuario autenticado desde cualquier capa sin pasarlos como argumentos.\n"
        "• `logger.js` y `logHooks.js`: Logger profesional Winston que escribe en consola y en archivos rotativos (`logs/error-%DATE%.log` y `logs/combined-%DATE%.log`).\n"
        "• `cache.js`: Implementa caché volátil en memoria RAM (`node-cache`) con tiempo de vida (TTL) configurable para reducir consultas repetitivas a la base de datos.\n"
        "• `appError.js`: Clase personalizada de error que extiende de `Error`, asignándole un código HTTP y tipándolo como error operacional."
    )

    # --- 1.10 HELPERS ---
    doc.add_heading("1.10 Carpeta src/helpers/ (Inicialización y envoltorios)", level=2)
    doc.add_paragraph(
        "• `initializeSystemData.js`: Se ejecuta automáticamente durante el arranque del servidor en `server.js`. "
        "Verifica si existe el SuperAdmin en la base de datos; si no existe, lo crea con el correo `Admin@admin` hasheando su contraseña con bcrypt. "
        "Asimismo, asegura la existencia del plan gratuito básico (`Plan Gratuito`) con sus cuotas iniciales.\n"
        "• `asyncHandler.js`: Envoltorio de conveniencia para funciones middleware asíncronas."
    )

    # --- 1.11 JOBS & WORKERS ---
    doc.add_heading("1.11 Carpeta src/jobs/ y src/workers/ (Procesamiento en segundo plano)", level=2)
    doc.add_paragraph(
        "• `jobs/subscriptionExpiryJob.js`: Tarea automatizada con `node-cron` configurada para ejecutarse todos los días a las 00:05 AM (`5 0 * * *`). "
        "Consulta las suscripciones cuya fecha de finalización (`end_date`) haya vencido, actualiza su estado a `expired`, "
        "inactiva la empresa asociada (`status: 'inactive'`) e informa en los registros de auditoría.\n"
        "• `workers/billingWorker.js`: Proceso de apoyo para la conciliación asíncrona de pagos diferidos o eventos de suscripción procedentes de la pasarela."
    )

    # --- 1.12 UPLOADS ---
    doc.add_heading("1.12 Carpeta src/uploads/ (Almacenamiento multi-inquilino de archivos)", level=2)
    doc.add_paragraph(
        "La carpeta `src/uploads/` gestiona el almacenamiento local particionado para recursos estáticos multimedia:\n"
        "• `uploads/logos/`: Directorio físico para los logotipos corporativos e institucionales subidos por cada empresa cliente.\n"
        "• `uploads/banners/`: Imágenes de comunicados oficiales y piezas gráficas mostradas en la consola.\n"
        "• Exposición HTTP: Express sirve este directorio mediante `express.static('src/uploads')`, aplicando directivas `Cache-Control: public, max-age=86400` para reducir latencia en el navegador."
    )

    # --- 1.13 APP Y SERVER ---
    doc.add_heading("1.13 Archivos raíz de orquestación: src/app.js y src/server.js", level=2)
    doc.add_paragraph(
        "• `src/app.js`: Configura la instancia central de Express, monta las cabeceras de protección Helmet, políticas CORS, "
        "compresión Gzip, limitador de tasa de peticiones (Rate Limit), parser JSON con límite de 10 MB, middleware de contexto "
        "Request-ID, enrutador maestro `/api` y el middleware terminal capturador de errores (`errorMiddleware`).\n"
        "• `src/server.js`: Punto de entrada del proceso Node.js. Carga variables de entorno, autentica la conexión al motor MySQL mediante Sequelize, "
        "ejecuta la siembra inicial de datos (`initializeSystemData`), programa el Cron de suscripciones e inicia la escucha TCP en el puerto configurado."
    )

    # --- 1.14 CATÁLOGO API ---
    doc.add_page_break()
    doc.add_heading("1.14 Catálogo maestro de endpoints (API Reference completa)", level=2)
    tbl_b_api = doc.add_table(rows=1, cols=4)
    headers_b_api = ["Método y Ruta", "Acceso requerido", "Payload / Parámetros", "Respuesta esperada"]
    data_b_api = [
        ("POST /api/auth/login", "Público", "{ email, password }", "200 OK: { token, user, branding }"),
        ("POST /api/auth/register", "Público", "{ company_name, nit, email, password, plan_id }", "201 Created: { company, payment_url }"),
        ("GET /api/auth/me", "Bearer JWT", "Cabecera Authorization", "200 OK: { user, company, permissions }"),
        ("GET /api/companies", "SuperAdmin", "?search, ?status, ?page", "200 OK: { companies: [], total }"),
        ("POST /api/companies", "SuperAdmin", "{ name, nit, email, phone, plan_id }", "201 Created: { company }"),
        ("GET /api/plans", "Público / Autenticado", "Ninguno", "200 OK: [ { id, name, price, limits } ]"),
        ("GET /api/headquarters", "Empresa (Tenant)", "Token de Empresa", "200 OK: [ { id, name, address } ]"),
        ("POST /api/headquarters", "Empresa (Tenant)", "{ name, address, city }", "201 Created: { headquarter }"),
        ("GET /api/areas", "Empresa (Tenant)", "?headquarter_id", "200 OK: [ { id, name, headquarter_id } ]"),
        ("POST /api/areas", "Empresa (Tenant)", "{ name, headquarter_id }", "201 Created: { area }"),
        ("GET /api/cargos", "Empresa (Tenant)", "?area_id", "200 OK: [ { id, name, area_id } ]"),
        ("POST /api/cargos", "Empresa (Tenant)", "{ name, area_id }", "201 Created: { cargo }"),
        ("GET /api/colaboradores", "Empresa (Tenant)", "?search, ?area_id, ?page", "200 OK: { colaboradores: [], total }"),
        ("POST /api/colaboradores", "Empresa (Tenant)", "Multipart: doc_type, doc_number, names, photo", "201 Created: { colaborador }"),
        ("GET /api/templates", "Empresa (Tenant)", "Token de Empresa", "200 OK: [ { id, name, design_json } ]"),
        ("POST /api/templates", "Empresa (Tenant)", "{ name, orientation, design_json }", "201 Created: { template }"),
        ("GET /api/carnets", "Empresa (Tenant)", "?user_id, ?status, ?page", "200 OK: { carnets: [], total }"),
        ("POST /api/carnets", "Empresa (Tenant)", "{ user_id, template_id, expiration_date }", "201 Created: { carnet, qr_hash, pdf_url }"),
        ("DELETE /api/carnets/:id", "Empresa (Tenant)", "ID del carnet a revocar", "200 OK: { message: 'Carnet revocado' }"),
        ("GET /api/carnets/verify/:hash", "Público", "Hash único del código QR", "200 OK: { valid: true, colaborador, vigencia }"),
        ("POST /api/webhooks/mercadopago", "Público (Firma HMAC)", "Header: x-signature, Body: { data: { id } }", "200 OK: { received: true }")
    ]
    format_table(tbl_b_api, [1.8, 1.3, 1.8, 1.6], headers_b_api, data_b_api, "001F3F")

    doc.add_page_break()

    # =========================================================================
    # PARTE 2: ARQUITECTURA TÉCNICA DEL FRONTEND
    # =========================================================================
    doc.add_heading("Parte 2. Arquitectura técnica del frontend", level=1)

    doc.add_heading("2.1 Stack tecnológico y capacidades del cliente", level=2)
    tbl_f_tech = doc.add_table(rows=1, cols=3)
    headers_f_tech = ["Capa tecnológica", "Librería y versión", "Rol y responsabilidad en la plataforma"]
    data_f_tech = [
        ("Librería de interfaz", "React v19.x", "Renderizado reactivo de componentes, concurrencia y ciclo de vida."),
        ("Empaquetador y build tool", "Vite v5.x / Rollup", "Desarrollo ágil con Hot Module Replacement (HMR) y empaquetado minificado."),
        ("Enrutamiento SPA", "React Router DOM v7.x", "Navegación del lado del cliente, layouts anidados y rutas protegidas por rol."),
        ("Cliente HTTP", "Axios v1.x", "Inyección automática de cabeceras Bearer JWT y manejo uniforme de excepciones 401/403."),
        ("Motor de animaciones", "Framer Motion v12.x", "Transiciones fluidas entre pantallas, modales animados y microinteracciones a 60 fps."),
        ("Iconografía vectorial", "Lucide React", "Catálogo de íconos vectoriales SVG optimizados para reducir el tamaño final del paquete."),
        ("Motor gráfico de carnets", "HTML5 Canvas API Nativa", "Renderizado pixel-perfect de capas de texto, fotos y código QR a 300 DPI.")
    ]
    format_table(tbl_f_tech, [1.6, 1.8, 3.1], headers_f_tech, data_f_tech, "001F3F")

    doc.add_heading("2.2 Estructura y topología modular de carpetas (src/)", level=2)
    tbl_f_dirs = doc.add_table(rows=1, cols=3)
    headers_f_dirs = ["Directorio", "Responsabilidad técnica", "Componentes destacados"]
    data_f_dirs = [
        ("src/core/", "Servicios compartidos, clientes HTTP y contexto global de sesión.", "AuthContext.jsx, apiClient.js, storage.js"),
        ("src/layouts/", "Estructuras de navegación y marcos de diseño visual.", "public/Layout.jsx, system/SystemLayout.jsx, company/CompanyLayout.jsx"),
        ("src/modules/public/", "Módulos de acceso libre sin autenticación previa.", "home/ (Landing page), blog/, auth/ (Login, Registro, Checkout)"),
        ("src/modules/system/", "Consola de administración global para superusuarios.", "home/, companies/, plans/, subscriptions/, users/, roles/, parameters/"),
        ("src/modules/company/", "Consola operativa de la empresa cliente (tenant).", "home/, headquarters/, areas/, roles/, users/, templates/, carnets/, parameter/, subscription/"),
        ("src/routes/", "Configuración centralizada de rutas y protección de accesos.", "PublicRoutes.jsx, SystemRoutes.jsx, CompanyRoutes.jsx, ProtectedRoute.jsx"),
        ("src/components/", "Elementos visuales genéricos y reutilizables.", "ui/ (Botones, Modales, Inputs), common/ (Pagination, LimitAlert)")
    ]
    format_table(tbl_f_dirs, [1.6, 2.4, 2.5], headers_f_dirs, data_f_dirs, "001F3F")

    doc.add_heading("2.3 Catálogo de rutas del frontend y niveles de acceso", level=2)
    tbl_f_routes = doc.add_table(rows=1, cols=4)
    headers_f_routes = ["Ruta del frontend", "Nivel de acceso", "Estructura de layout", "Propósito en el sistema"]
    data_f_routes = [
        ("/", "Público", "Public Layout", "Página principal con catálogo interactivo y propuesta comercial."),
        ("/blog", "Público", "Public Layout", "Portal de artículos pedagógicos sobre identificación digital."),
        ("/login", "Público", "Standalone", "Formulario de inicio de sesión único para empresas y superusuarios."),
        ("/payment-success", "Público", "Standalone", "Confirmación de transacción aprobada y redirección."),
        ("/system/home", "Admin Sistema", "System Layout", "Panel principal con indicadores macro, cobros y empresas."),
        ("/system/companies", "Admin Sistema", "System Layout", "Directorio maestro de organizaciones suscritas."),
        ("/system/plans", "Admin Sistema", "System Layout", "Administración de tarifas comerciales y cuotas de carnets."),
        ("/system/subscriptions", "Admin Sistema", "System Layout", "Supervisión de transacciones y estados de cobranza."),
        ("/system/users", "Admin Sistema", "System Layout", "Gestión de operadores del núcleo de la plataforma."),
        ("/system/roles", "Admin Sistema", "System Layout", "Matriz de privilegios para usuarios del sistema."),
        ("/system/parameters", "Admin Sistema", "System Layout", "Control de banners promocionales y modo de mantenimiento."),
        ("/company/home", "Admin Empresa", "Company Layout", "Panel de bienvenida, estadísticas internas y consumo de cupos."),
        ("/company/headquarters", "Admin Empresa", "Company Layout", "Registro y administración de sedes físicas."),
        ("/company/areas", "Admin Empresa", "Company Layout", "Estructura departamental asociada a sedes."),
        ("/company/cargos", "Admin Empresa", "Company Layout", "Catálogo de puestos de trabajo organizacionales."),
        ("/company/users", "Admin Empresa", "Company Layout", "Directorio completo de colaboradores y personal."),
        ("/company/templates", "Admin Empresa", "Company Layout", "Galería de plantillas y acceso al editor Canvas."),
        ("/company/carnets", "Admin Empresa", "Company Layout", "Emisión masiva o individual, descarga en PDF y revocaciones."),
        ("/company/parameter", "Admin Empresa", "Company Layout", "Personalización de marca corporativa (white-labeling)."),
        ("/company/subscription", "Admin Empresa", "Company Layout", "Consulta del plan contratado y recarga de cuotas.")
    ]
    format_table(tbl_f_routes, [1.8, 1.2, 1.3, 2.2], headers_f_routes, data_f_routes, "001F3F")

    doc.add_heading("2.4 Motor gráfico de credenciales (Canvas Engine)", level=2)
    doc.add_paragraph(
        "El módulo CanvasDesigner (`CanvasDesigner.jsx`) opera con un motor gráfico nativo sobre el elemento `<canvas>` de HTML5:\n"
        "• Sistema de capas ordenadas: Capa de fondo corporativo, logos vectoriales, fotografía del colaborador, textos y código QR.\n"
        "• Marcadores dinámicos: Etiquetas como `{{nombres}}`, `{{apellidos}}`, `{{documento}}`, `{{cargo}}` y `{{sede}}` que el sistema reemplaza en tiempo real durante la emisión.\n"
        "• Generación de código QR seguro: Dibujado de códigos bidimensionales que contienen la dirección URL pública de verificación criptográfica.\n"
        "• Exportación de alta resolución: Salida gráfica rasterizada a 300 DPI adecuada para impresión física o visualización en teléfonos inteligentes."
    )

    doc.add_page_break()

    # =========================================================================
    # PARTE 3: MANUAL DE USUARIO E INSTRUCTIVO PASO A PASO (35 PANTALLAS)
    # =========================================================================
    doc.add_heading("Parte 3. Manual de usuario e instructivo paso a paso", level=1)
    doc.add_paragraph(
        "Esta sección describe el funcionamiento de cada una de las 35 pantallas y ventanas modales de Carnet Digital. "
        "Sigue las instrucciones descritas según el numeral y la figura correspondiente."
    )

    # MÓDULO 1: PORTAL PÚBLICO Y ACCESO
    doc.add_heading("Módulo 1. Ingreso, registro y pasarela de pago", level=2)

    doc.add_heading("1. Portada principal y bienvenida comercial", level=3)
    doc.add_paragraph(
        "1. Abre tu navegador web favorito (Google Chrome, Microsoft Edge o Mozilla Firefox).\n"
        "2. Ingresa la dirección URL oficial de la plataforma: `http://localhost:5173/`.\n"
        "3. Observa la propuesta de valor y las opciones del menú de navegación superior."
    )
    add_screenshot(doc, "01_public_landing_hero.png", 1, "Pantalla de ingreso al portal web de Carnet Digital", max_width_inches=6.2)
    add_callout(doc, "Haz clic en el botón 'Empezar Ahora' para comunicarte vía WhatsApp con un asesor de servicio.", "TIP")

    doc.add_heading("2. Catálogo interactivo de servicios y soluciones", level=3)
    doc.add_paragraph(
        "1. Desplázate hacia abajo en la página de inicio hasta la sección 'Servicios'.\n"
        "2. Explora las soluciones de credencialización disponibles: Identificación Digital, Control de Asistencia, Acceso a Sedes, Eventos y Certificaciones."
    )
    add_screenshot(doc, "02_public_landing_servicios.png", 2, "Catálogo de soluciones y funciones de credencialización", max_width_inches=5.8)

    doc.add_heading("3. Consulta de planes y tarifas comerciales", level=3)
    doc.add_paragraph(
        "1. Dirígete a la sección 'Suscripciones' mediante el menú superior.\n"
        "2. Alterna entre facturación mensual o anual con descuento especial.\n"
        "3. Elige el plan que mejor se adapte al volumen de colaboradores de tu organización."
    )
    add_screenshot(doc, "03_public_landing_planes.png", 3, "Selector de planes y tarifas de suscripción", max_width_inches=5.8)

    doc.add_heading("4. Opciones de arquitectura e infraestructura", level=3)
    doc.add_paragraph(
        "1. Revisa las modalidades de hospedaje técnico.\n"
        "2. Compara la solución Cloud SaaS gestionada frente al despliegue On-Premises en los servidores privados de tu institución."
    )
    add_screenshot(doc, "04_public_landing_despliegue.png", 4, "Comparativa de arquitectura Cloud SaaS frente a On-Premises", max_width_inches=5.8)

    doc.add_heading("5. Contacto comercial y pie de página", level=3)
    doc.add_paragraph(
        "1. Utiliza los canales directos del pie de página para resolver inquietudes técnicas o comerciales.\n"
        "2. Consulta las políticas de tratamiento de datos y términos de servicio institucional."
    )
    add_screenshot(doc, "05_public_landing_cta.png", 5, "Sección de llamado a la acción y enlaces institucionales", max_width_inches=6.0)

    doc.add_heading("6. Portal de novedades y artículos técnicos", level=3)
    doc.add_paragraph(
        "1. Haz clic en la opción 'Blog' de la barra superior.\n"
        "2. Filtra por categorías como 'Seguridad', 'Innovación' o 'Gestión' para consultar artículos de interés."
    )
    add_screenshot(doc, "06_public_blog.png", 6, "Directorio de publicaciones y artículos del blog institucional", max_width_inches=5.6)

    doc.add_heading("7. Inicio de sesión en la plataforma", level=3)
    doc.add_paragraph(
        "1. Haz clic en el botón 'Entrar' ubicado en la esquina superior derecha.\n"
        "2. Escribe tu correo electrónico corporativo registrado.\n"
        "3. Escribe tu contraseña de acceso asignada.\n"
        "4. Haz clic en el botón **Iniciar Sesión**."
    )
    add_screenshot(doc, "07_auth_login.png", 7, "Ventana de autenticación e inicio de sesión seguro", max_width_inches=3.6)
    add_callout(doc, "Si la plataforma se encuentra en ventana de mantenimiento técnico, el sistema mostrará un aviso informativo antes de permitir el ingreso.", "NOTE")

    doc.add_heading("8. Registro de una nueva empresa cliente", level=3)
    doc.add_paragraph(
        "1. En la tarjeta de acceso, haz clic en el enlace '¿No tienes cuenta? Regístrate aquí'.\n"
        "2. Diligencia la razón social completa de tu empresa y el número de identificación tributaria (NIT).\n"
        "3. Escribe los datos de contacto del administrador y define una contraseña segura."
    )
    add_screenshot(doc, "08_auth_registro_paso1.png", 8, "Formulario inicial para dar de alta una nueva organización", max_width_inches=3.6)

    doc.add_heading("9. Confirmación de suscripción exitosa", level=3)
    doc.add_paragraph(
        "1. Al finalizar el pago en la pasarela, el sistema mostrará la pantalla de confirmación exitosa con tu identificador de transacción.\n"
        "2. Haz clic en **Ir al Login** para iniciar sesión y acceder inmediatamente al panel corporativo."
    )
    add_screenshot(doc, "09_auth_pago_aprobado.png", 9, "Comprobante oficial de pago aprobado y activación de cuenta", max_width_inches=4.2)

    doc.add_page_break()

    # MÓDULO 2: SUPERADMIN DE SISTEMA
    doc.add_heading("Módulo 2. Consola SuperAdmin de plataforma", level=2)

    doc.add_heading("10. Tablero de control y métricas globales", level=3)
    doc.add_paragraph(
        "1. Revisa los indicadores clave de desempeño: Empresas activas, ingresos mensuales recurrentes (MRR) y total de carnets emitidos.\n"
        "2. Examina la gráfica de crecimiento intermensual y el registro de eventos recientes."
    )
    add_screenshot(doc, "10_system_dashboard.png", 10, "Tablero de control principal de la plataforma central", max_width_inches=5.8)

    doc.add_heading("11. Directorio de empresas suscritas", level=3)
    doc.add_paragraph(
        "1. Haz clic en la opción 'Empresas' del menú lateral izquierdo.\n"
        "2. Consulta el listado de empresas con su plan activo, fecha de expiración y estado operativo.\n"
        "3. Utiliza la barra de búsqueda para ubicar rápidamente una empresa por su nombre o NIT."
    )
    add_screenshot(doc, "11_system_empresas.png", 11, "Directorio maestro y buscador de empresas suscritas", max_width_inches=5.8)

    doc.add_heading("12. Registro manual de una nueva empresa", level=3)
    doc.add_paragraph(
        "1. Haz clic en el botón superior **+ Nueva Empresa**.\n"
        "2. Completa los campos: Razón social, NIT, correo del administrador y teléfono.\n"
        "3. Selecciona el plan comercial inicial contratado.\n"
        "4. Haz clic en **Guardar Empresa** para crear el inquilino (tenant) en la base de datos."
    )
    add_screenshot(doc, "12_system_modal_crear_empresa.png", 12, "Ventana modal para registrar manualmente una organización", max_width_inches=4.8)

    doc.add_heading("13. Catálogo de planes comerciales", level=3)
    doc.add_paragraph(
        "1. Haz clic en 'Planes' en el menú lateral.\n"
        "2. Visualiza las tarifas vigentes, el límite de colaboradores y el número máximo de plantillas autorizadas."
    )
    add_screenshot(doc, "13_system_planes.png", 13, "Directorio de planes y condiciones comerciales del sistema", max_width_inches=5.8)

    doc.add_heading("14. Creación y edición de condiciones de plan", level=3)
    doc.add_paragraph(
        "1. Haz clic en el botón **+ Nuevo Plan**.\n"
        "2. Define el nombre del plan (ejemplo: Enterprise Pro), precio mensual y precio anual.\n"
        "3. Especifica el límite estricto de colaboradores y de plantillas.\n"
        "4. Haz clic en **Crear Plan**."
    )
    add_screenshot(doc, "13b_system_modal_crear_plan.png", 14, "Modal para parametrizar costos y cuotas de un plan", max_width_inches=4.4)

    doc.add_heading("15. Auditoría de suscripciones y transacciones", level=3)
    doc.add_paragraph(
        "1. Ingresa a la sección 'Suscripciones'.\n"
        "2. Supervisa las renovaciones automáticas, estados de cuenta (al día, vencido) y facturas generadas."
    )
    add_screenshot(doc, "14_system_suscripciones.png", 15, "Monitor de facturación y transacciones de suscripción", max_width_inches=5.8)

    doc.add_heading("16. Administración de operadores del sistema", level=3)
    doc.add_paragraph(
        "1. Haz clic en 'Usuarios' dentro de la consola del sistema.\n"
        "2. Observa la nómina de operadores con privilegios de superadministrador."
    )
    add_screenshot(doc, "15_system_usuarios.png", 16, "Listado de operadores y técnicos del núcleo central", max_width_inches=5.8)

    doc.add_heading("17. Alta de operador del sistema", level=3)
    doc.add_paragraph(
        "1. Haz clic en **+ Nuevo Usuario**.\n"
        "2. Escribe los nombres, correo institucional y contraseña temporal.\n"
        "3. Asigna el rol correspondiente (ejemplo: Administrador o Soporte).\n"
        "4. Haz clic en **Guardar Usuario**."
    )
    add_screenshot(doc, "15b_system_modal_crear_usuario.png", 17, "Ventana para crear cuentas de operadores técnicos", max_width_inches=4.2)

    doc.add_heading("18. Matriz de roles y privilegios", level=3)
    doc.add_paragraph(
        "1. Ingresa a la opción 'Roles'.\n"
        "2. Consulta las definiciones de perfiles del sistema y su alcance de gestión."
    )
    add_screenshot(doc, "16_system_roles.png", 18, "Matriz de privilegios y perfiles de usuario del sistema", max_width_inches=5.8)

    doc.add_heading("19. Creación de un nuevo rol de sistema", level=3)
    doc.add_paragraph(
        "1. Haz clic en **+ Nuevo Rol**.\n"
        "2. Ingresa el identificador único y una descripción de responsabilidades.\n"
        "3. Guarda la configuración para aplicarla de inmediato a los operadores."
    )
    add_screenshot(doc, "16b_system_modal_crear_rol.png", 19, "Formulario modal para registrar un nuevo rol administrativo", max_width_inches=4.2)

    doc.add_heading("20. Parámetros globales y banners institucionales", level=3)
    doc.add_paragraph(
        "1. Haz clic en 'Parámetros' en el menú lateral.\n"
        "2. Activa o desactiva el switch de 'Permitir Inicio de Sesión' para labores de mantenimiento.\n"
        "3. Carga nuevas imágenes de banner y verifica su previsualización en tiempo real."
    )
    add_screenshot(doc, "17_system_parametros_banners.png", 20, "Panel de control de modo mantenimiento y banners informativos", max_width_inches=5.8)

    doc.add_page_break()

    # MÓDULO 3: PANEL DE EMPRESA
    doc.add_heading("Módulo 3. Panel corporativo de la empresa cliente", level=2)

    doc.add_heading("21. Tablero principal de la empresa", level=3)
    doc.add_paragraph(
        "1. Accede con tus credenciales de empresa.\n"
        "2. Observa el saludo institucional, el resumen de colaboradores activos y la distribución por sedes.\n"
        "3. Verifica la barra de progreso de cupos de carnets disponibles."
    )
    add_screenshot(doc, "18_company_dashboard.png", 21, "Tablero de control corporativo de la organización", max_width_inches=5.8)

    doc.add_heading("22. Gestión de sedes y sucursales físicas", level=3)
    doc.add_paragraph(
        "1. Haz clic en la opción 'Sedes' del menú corporativo.\n"
        "2. Consulta las instalaciones físicas registradas (oficinas principales, plantas o sucursales)."
    )
    add_screenshot(doc, "19_company_sedes.png", 22, "Directorio maestro de sedes físicas registradas", max_width_inches=5.8)

    doc.add_heading("23. Registro de una nueva sede", level=3)
    doc.add_paragraph(
        "1. Haz clic en el botón **+ Nueva Sede**.\n"
        "2. Escribe el nombre de la sede (ejemplo: Sede Principal Calle 100), ciudad y dirección exacta.\n"
        "3. Haz clic en **Guardar Sede**."
    )
    add_screenshot(doc, "20_company_modal_crear_sede.png", 23, "Modal de ingreso de datos de una sede física", max_width_inches=4.2)

    doc.add_heading("24. Estructura de áreas y departamentos", level=3)
    doc.add_paragraph(
        "1. Dirígete a la opción 'Áreas'.\n"
        "2. Examina los departamentos funcionales (Tecnología, Operaciones, Ventas) adscritos a cada sede."
    )
    add_screenshot(doc, "21_company_areas.png", 24, "Estructura departamental y áreas de trabajo de la empresa", max_width_inches=5.8)

    doc.add_heading("25. Creación de un área o departamento", level=3)
    doc.add_paragraph(
        "1. Haz clic en **+ Nueva Área**.\n"
        "2. Escribe la denominación del área.\n"
        "3. Selecciona en el menú desplegable la sede física a la cual pertenece.\n"
        "4. Haz clic en **Guardar Área**."
    )
    add_screenshot(doc, "22_company_modal_crear_area.png", 25, "Formulario modal para crear y asociar un área", max_width_inches=4.2)

    doc.add_heading("26. Catálogo de cargos y puestos de trabajo", level=3)
    doc.add_paragraph(
        "1. Haz clic en 'Cargos' en el menú lateral.\n"
        "2. Consulta el listado de cargos laborales organizados por área funcional."
    )
    add_screenshot(doc, "23_company_cargos.png", 26, "Catálogo de cargos laborales activos en la organización", max_width_inches=5.8)

    doc.add_heading("27. Alta de un nuevo cargo", level=3)
    doc.add_paragraph(
        "1. Haz clic en **+ Nuevo Cargo**.\n"
        "2. Ingresa el título del puesto (ejemplo: Ingeniero de Software Senior).\n"
        "3. Selecciona el área a la que pertenece.\n"
        "4. Haz clic en **Guardar Cargo**."
    )
    add_screenshot(doc, "24_company_modal_crear_cargo.png", 27, "Ventana modal para registrar un cargo laboral", max_width_inches=4.2)

    doc.add_heading("28. Directorio maestro de colaboradores", level=3)
    doc.add_paragraph(
        "1. Haz clic en la opción 'Colaboradores'.\n"
        "2. Visualiza a todo el personal con su fotografía, documento de identidad, cargo, sede y estado de carnetización.\n"
        "3. Utiliza los filtros superiores para segmentar por área o cargo."
    )
    add_screenshot(doc, "25_company_colaboradores.png", 28, "Directorio general de colaboradores con opciones de búsqueda", max_width_inches=5.8)

    doc.add_heading("29. Registro completo de un colaborador", level=3)
    doc.add_paragraph(
        "1. Haz clic en el botón superior **+ Nuevo Colaborador**.\n"
        "2. Selecciona el tipo de documento (Cédula de Ciudadanía, Pasaporte o Cédula de Extranjería) e ingresa el número.\n"
        "3. Escribe los nombres, apellidos, correo corporativo y número de celular.\n"
        "4. Asigna la sede, área y cargo correspondientes.\n"
        "5. Carga la fotografía formal del colaborador en formato JPG o PNG.\n"
        "6. Haz clic en **Guardar Colaborador**."
    )
    add_screenshot(doc, "26_company_modal_colaborador.png", 29, "Formulario modal integral para el registro de colaboradores", max_width_inches=5.0)

    doc.add_heading("30. Galería de plantillas de credenciales", level=3)
    doc.add_paragraph(
        "1. Haz clic en 'Plantillas' en el menú corporativo.\n"
        "2. Revisa los diseños creados para personal de planta, contratistas, directivos o eventos especiales."
    )
    add_screenshot(doc, "27_company_plantillas.png", 30, "Galería de plantillas visuales de carnetización", max_width_inches=5.8)

    doc.add_heading("31. Diseñador interactivo de plantillas de carnet", level=3)
    doc.add_paragraph(
        "1. Haz clic en **+ Nueva Plantilla** o selecciona una existente para editarla.\n"
        "2. Sube la imagen de fondo institucional de tu organización.\n"
        "3. Arrastra y ubica las capas de texto dinámico: `{{nombres}}`, `{{apellidos}}`, `{{cargo}}` y `{{sede}}`.\n"
        "4. Ajusta la posición y tamaño del recuadro para el código QR y la fotografía.\n"
        "5. Haz clic en **Guardar Plantilla** para habilitarla en las emisiones."
    )
    add_screenshot(doc, "28_company_disenador_canvas.png", 31, "Editor gráfico interactivo Canvas para diseñar credenciales", max_width_inches=5.5)

    doc.add_heading("32. Control de emisión y descarga de carnets", level=3)
    doc.add_paragraph(
        "1. Haz clic en la opción 'Carnetización'.\n"
        "2. Consulta los carnets emitidos, vigencias y fechas de expedición.\n"
        "3. Haz clic en el ícono de descarga para obtener la credencial en PDF de alta resolución.\n"
        "4. En caso de retiro del funcionario o pérdida del carnet, utiliza la opción **Revocar**."
    )
    add_screenshot(doc, "29_company_carnetizacion.png", 32, "Listado de carnets emitidos con opciones de descarga y revocación", max_width_inches=5.8)
    add_callout(doc, "La revocación de una credencial invalida de inmediato el código QR ante cualquier lector de control de acceso físico.", "WARNING")

    doc.add_heading("33. Emisión individual de credencial", level=3)
    doc.add_paragraph(
        "1. Haz clic en el botón **+ Emitir Carnet**.\n"
        "2. Elige el colaborador en el selector desplegable.\n"
        "3. Elige la plantilla visual aprobada.\n"
        "4. Fija la fecha de expiración del carnet.\n"
        "5. Haz clic en **Emitir Credencial**."
    )
    add_screenshot(doc, "29b_company_modal_emitir_carnet.png", 33, "Modal de emisión individual y generación de código QR", max_width_inches=4.4)
    add_callout(doc, "Si la cuota de carnets contratados se encuentra agotada, el sistema bloqueará la emisión y te solicitará contactar a tu asesor para recargar cupos.", "ALERT")

    doc.add_heading("34. Configuración de marca corporativa (White-Labeling)", level=3)
    doc.add_paragraph(
        "1. Ingresa a la opción 'Configuración de Marca'.\n"
        "2. Personaliza el color primario y secundario con el selector de color o código hexadecimal.\n"
        "3. Elige la tipografía institucional preferida.\n"
        "4. Carga el archivo del logotipo oficial de tu empresa.\n"
        "5. Haz clic en **Guardar Cambios** para aplicar la identidad visual en todo tu entorno."
    )
    add_screenshot(doc, "30_company_branding_parametros.png", 34, "Módulo de configuración de marca, colores y logotipo de empresa", max_width_inches=5.8)

    doc.add_heading("35. Consulta de plan, cuotas y recarga de cupos", level=3)
    doc.add_paragraph(
        "1. Haz clic en la opción 'Suscripción'.\n"
        "2. Verifica el plan vigente, costo y fecha de renovación programada.\n"
        "3. Consulta la barra de consumo de carnets emitidos sobre el límite total permitido.\n"
        "4. Haz clic en **Actualizar Plan / Recargar Cupos** si requieres emitir credenciales adicionales."
    )
    add_screenshot(doc, "31_company_suscripcion.png", 35, "Panel de control del plan contratado y consumo de cupos", max_width_inches=5.8)

    # =========================================================================
    # ANEXO: PREGUNTAS FRECUENTES Y RESOLUCIÓN DE PROBLEMAS
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Anexo. Preguntas frecuentes y solución de problemas", level=1)
    doc.add_paragraph(
        "A continuación se presentan las situaciones operativas y técnicas más habituales con su solución paso a paso:"
    )

    tbl_faq = doc.add_table(rows=1, cols=3)
    headers_faq = ["Situación o duda frecuente", "Causa probable", "Solución recomendada paso a paso"]
    data_faq = [
        (
            "El botón 'Emitir Carnet' se encuentra inhabilitado",
            "La empresa ha alcanzado el límite máximo de carnets contratados en su plan.",
            "Ingresa al módulo 'Suscripción' y selecciona la opción de recarga de cupos o cambio a un plan superior."
        ),
        (
            "Al escanear el carnet con el teléfono, se indica credencial inválida",
            "El carnet ha superado su fecha de expiración o fue revocado por el administrador.",
            "Verifica el estado en el módulo 'Carnetización'. Si está revocado, emite una nueva credencial con fecha vigente."
        ),
        (
            "Error HTTP 401 al invocar endpoints de API",
            "El token JWT ha expirado o la cabecera Authorization está ausente.",
            "Inicia sesión nuevamente para renovar el token en localStorage o genera uno nuevo con la clave JWT_SECRET."
        ),
        (
            "No se visualizan las sedes al crear un área",
            "No existen sedes creadas previamente en la organización.",
            "Ingresa primero al módulo 'Sedes', registra al menos una sucursal física y posteriormente asocia el área."
        ),
        (
            "El logotipo no se visualiza correctamente en el carnet",
            "El formato o las dimensiones de la imagen cargada no son transparentes o superan el tamaño sugerido.",
            "Sube el logotipo en formato PNG con fondo transparente y resolución de 500x500 píxeles desde el módulo 'Configuración de Marca'."
        )
    ]
    format_table(tbl_faq, [1.8, 2.0, 2.7], headers_faq, data_faq, "001F3F")

    # Guardar en Frontend
    print(f"Guardando documento Word maestro en: {DOCX_OUTPUT_FRONT} ...")
    doc.save(DOCX_OUTPUT_FRONT)

    # Guardar en Backend
    print(f"Guardando documento Word maestro en: {DOCX_OUTPUT_BACK} ...")
    doc.save(DOCX_OUTPUT_BACK)

    print("¡DOCUMENTO MAESTRO INTEGRAL CON DESGLOSE POR CARPETAS GENERADO EXITOSAMENTE!")

if __name__ == "__main__":
    main()
