# -*- coding: utf-8 -*-
"""
Generador Maestro del Documento Word Oficial:
DIRECCIÓN TIC - MANUAL TÉCNICO DE ARQUITECTURA DE SOFTWARE (FRONTEND & BACKEND)
APLICATIVO CARNET DIGITAL (VERSIÓN 2026)
Estandarizado según la Guía de Estilo de Escritura de Microsoft (Microsoft Writing Style Guide)
y el Estándar Internacional arc42 (ISO/IEC/IEEE 42010)
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCX_OUTPUT_FRONT = r"f:\personal\CoreCredential-Front-main\MANUAL_TECNICO_DE_ARQUITECTURA_CARNET_DIGITAL.docx"
DOCX_OUTPUT_BACK = r"f:\personal\CoreCredential-Back-main\MANUAL_TECNICO_DE_ARQUITECTURA_CARNET_DIGITAL.docx"

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

def add_callout(doc, text, callout_type="NOTE"):
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

def build_technical_manual():
    print("Iniciando compilacion del Manual Tecnico de Arquitectura (Word)...")
    doc = Document()

    # Configuración de márgenes estándar
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
    r_title = p_title.add_run("MANUAL TÉCNICO DE ARQUITECTURA DE SOFTWARE")
    r_title.font.size = Pt(24)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0, 31, 63)
    p_title.paragraph_format.space_after = Pt(12)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Especificación Integral de Arquitectura Frontend, Backend y Modelo de Datos")
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
    r_meta = p_meta.add_run("Versión Técnica: 2.5.0  |  Estándar arc42 / ISO/IEC/IEEE 42010\nDocumento Maestro de Arquitectura, Contratos de API y Seguridad")
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
        ("28/09/2026", "2.5.0", "Ing. Especialista TIC\nArquitecto de Software Full Stack", "Dirección de Planeación y TIC", "Especificación técnica completa: Desglose por carpetas Backend (Express 5/Sequelize) y Frontend (React 19/Canvas), seguridad y ADRs.", "Dirección TIC /\nRectoría General")
    ]
    format_table(tbl_version, [0.9, 0.6, 1.3, 1.2, 1.5, 1.0], headers_ver, data_ver, "001F3F")

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    doc.add_heading("Firmas de responsabilidad técnica", level=2)
    tbl_firmas = doc.add_table(rows=3, cols=3)
    tbl_firmas.alignment = WD_TABLE_ALIGNMENT.CENTER
    firmas_data = [
        ("Elaboró / Diseñó", "Revisó", "Aprobó"),
        (
            "\n\n\n_________________________________\nIng. Especialista TIC\nArquitecto de Software y Líder de Desarrollo\nDirección TIC",
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
    # INTRODUCCIÓN TÉCNICA
    # =========================================================================
    doc.add_heading("Introducción y metas de arquitectura", level=1)
    doc.add_paragraph(
        "Este manual técnico describe la arquitectura de software de Carnet Digital, un sistema SaaS multi-inquilino "
        "desarrollado para la emisión, administración, personalización gráfica y verificación criptográfica de credenciales digitales. "
        "El documento sigue las directrices internacionales del estándar arc42 (ISO/IEC/IEEE 42010), desglosando minuciosamente "
        "la topología de carpetas del servidor y del cliente, modelos de persistencia, mecanismos de seguridad perimetral y catálogo de APIs."
    )

    doc.add_heading("Metas de calidad prioritarias (ISO 25010)", level=2)
    tbl_goals = doc.add_table(rows=1, cols=3)
    headers_goals = ["Prioridad", "Meta de Calidad", "Motivación y Métrica Arquitectónica"]
    data_goals = [
        ("1", "Seguridad y Aislamiento Multi-Tenant", "Cero fuga de información entre empresas clientes en consultas SQL (mitigación estricta de IDOR mediante company_id y AsyncLocalStorage)."),
        ("2", "Baja Latencia en Verificación QR", "Tiempo de respuesta inferior a 150 ms en validaciones públicas mediante hash SHA-256 no secuencial y caché en memoria RAM."),
        ("3", "Eficiencia en Renderizado Gráfico", "Delegación del renderizado de alta resolución (300 DPI) al navegador del usuario vía Canvas API nativa, preservando la CPU del servidor."),
        ("4", "Trazabilidad y Observabilidad Integral", "Correlación de extremo a extremo mediante cabecera x-request-id (UUIDv4) inyectada en Winston Logger.")
    ]
    format_table(tbl_goals, [1.0, 2.5, 3.0], headers_goals, data_goals, "001F3F")

    doc.add_page_break()

    # =========================================================================
    # PARTE 1: ARQUITECTURA TÉCNICA DEL BACKEND
    # =========================================================================
    doc.add_heading("Parte 1. Arquitectura técnica del backend", level=1)

    doc.add_heading("1.1 Stack tecnológico y especificaciones del servidor", level=2)
    tbl_b_tech = doc.add_table(rows=1, cols=3)
    headers_b_tech = ["Capa del servidor", "Librería y versión", "Rol y responsabilidad técnica"]
    data_b_tech = [
        ("Motor de ejecución", "Node.js v20+ LTS", "Entorno de ejecución asíncrono no bloqueante sobre motor V8."),
        ("Framework web", "Express v5.x", "Enrutamiento modular RESTful y resolución nativa de promesas asíncronas."),
        ("Persistencia relacional", "Sequelize v6.x / mysql2", "Mapeo objeto-relacional (ORM), pooling de conexiones y transacciones ACID."),
        ("Criptografía y JWT", "jsonwebtoken / bcryptjs", "Firma criptográfica de tokens con expiración de 1h y hashing de claves (costo 10)."),
        ("Validación de esquemas", "Joi v18.x", "Sanitización estricta de entradas y rechazo temprano de datos maliciosos (400 Bad Request)."),
        ("Manejo de archivos", "Multer v2.x", "Recepción y almacenamiento local de fotografías de colaboradores y logotipos institucionales."),
        ("Pasarela de pagos", "Mercado Pago SDK v2.x", "Creación de suscripciones recurrentes y verificación de firmas HMAC x-signature en webhooks."),
        ("Seguridad perimetral", "Helmet, CORS, Rate-Limit", "Protección contra XSS, MIME-sniffing, Clickjacking y ataques de fuerza bruta."),
        ("Compresión de datos", "Compression v1.x", "Compresión automática Gzip y Deflate de cargas JSON salientes."),
        ("Caché en memoria", "node-cache v5.x", "Caché volátil en RAM para parámetros globales y validaciones públicas de QR."),
        ("Auditoría y logs", "Winston v3.x / Morgan v1.x", "Registro estructurado JSON con rotación diaria y correlación por Request-ID."),
        ("Planificador de tareas", "node-cron v4.x", "Automatización nocturna de vencimiento de suscripciones diarias a las 00:05 AM.")
    ]
    format_table(tbl_b_tech, [1.6, 1.8, 3.1], headers_b_tech, data_b_tech, "001F3F")

    doc.add_heading("1.2 Topología general de carpetas y arquitectura en capas", level=2)
    doc.add_paragraph(
        "El código fuente en `src/` implementa una arquitectura en capas estrictamente desacoplada (Separation of Concerns). "
        "Cada carpeta asume una responsabilidad única en el procesamiento de cada solicitud:"
    )

    tbl_b_folders = doc.add_table(rows=1, cols=3)
    headers_b_folders = ["Carpeta en src/", "Responsabilidad arquitectónica", "Archivos y módulos clave"]
    data_b_folders = [
        ("src/config/", "Conexión a MySQL, pooling de conexiones y variables de entorno.", "database.js"),
        ("src/middleware/", "Seguridad perimetral, verificación JWT, contexto y captura de errores.", "authMiddleware.js, contextMiddleware.js, validateMiddleware.js, uploadMiddleware.js, errorMiddleware.js"),
        ("src/routes/", "Enrutamiento modular RESTful y montaje de prefijos de API.", "index.js, authRoutes.js, companyRoutes.js, carnetRoutes.js, subscriptionRoutes.js"),
        ("src/controllers/", "Controladores delgados: recepción HTTP, extracción de datos y respuestas JSON.", "authUnifiedController.js, companyCarnetController.js, companyUserController.js, webhookController.js"),
        ("src/services/", "Lógica de negocio pura, transacciones ACID y orquestación con pasarelas.", "authService.js, companyCarnetService.js, mercadopagoService.js, companyUserService.js"),
        ("src/models/", "Modelado relacional Sequelize agrupado en core, tenant y raíz.", "models/core/ (Company), models/tenant/ (Carnet, User, Area, Sede), models/ (Plans, Subs)"),
        ("src/validators/", "Esquemas declarativos de validación y sanitización con Joi.", "authValidator.js, companyValidator.js, carnetValidator.js, planValidator.js"),
        ("src/utils/", "Herramientas transversales: límites de plan, contexto ALS, logging y caché.", "planLimits.js, context.js, logger.js, cache.js, appError.js"),
        ("src/helpers/", "Siembra inicial de datos (Seeders) y envoltorios asíncronos.", "initializeSystemData.js, asyncHandler.js"),
        ("src/jobs/ & workers/", "Tareas programadas con node-cron y trabajadores de segundo plano.", "subscriptionExpiryJob.js, billingWorker.js"),
        ("src/uploads/", "Almacenamiento local particionado para logos corporativos y banners.", "uploads/logos/, uploads/banners/"),
        ("src/app.js & server.js", "Montaje de Express, middlewares globales y apertura de socket TCP.", "app.js, server.js")
    ]
    format_table(tbl_b_folders, [1.6, 2.4, 2.5], headers_b_folders, data_b_folders, "001F3F")

    # --- 1.3 DESGLOSE POR CARPETAS ---
    doc.add_heading("1.3 Desglose exhaustivo carpeta por carpeta", level=2)

    doc.add_heading("1.3.1 Carpeta src/config/ (Configuración y conexiones)", level=3)
    doc.add_paragraph(
        "• database.js: Centraliza la conexión con el servidor MySQL mediante Sequelize. Configura un pool de conexiones administrado (máximo 10 simultáneas, mínimo 0, inactividad de 10 s, espera máxima de 30 s) para evitar agotar las conexiones del motor.\n"
        "• Sincronización horaria: Aplica timezone '-05:00' en Sequelize y sincroniza process.env.TZ = 'America/Bogota' en Node.js, garantizando que las fechas de emisión y vencimiento no sufran desfases.\n"
        "• Control de logging: En producción silencia las consultas SQL por consola (logging: false) para maximizar la velocidad."
    )

    doc.add_heading("1.3.2 Carpeta src/middleware/ (Seguridad perimetral y validación)", level=3)
    doc.add_paragraph(
        "• contextMiddleware.js: Inicializa AsyncLocalStorage de Node.js por petición, asignando un UUIDv4 como x-request-id que acompaña todos los logs de Winston.\n"
        "• authMiddleware.js: Extrae la cabecera Authorization: Bearer <token>, valida la firma criptográfica con JWT_SECRET y extrae los claims (id, email, role, company_id, type). Si el token es de empresa, comprueba que la organización esté activa (status === 'active'). Si está suspendida por mora, bloquea con HTTP 403 Forbidden.\n"
        "• validateMiddleware.js: Validador genérico de esquemas Joi. Si detecta inconsistencias, responde 400 Bad Request detallando los campos faltantes.\n"
        "• uploadMiddleware.js / bannerUploadMiddleware.js: Configura Multer para recepción de archivos multipart con límite de 5 MB y filtrado MIME (JPG, PNG, WEBP).\n"
        "• errorMiddleware.js: Manejador central de errores. Captura excepciones operacionales (AppError) y fallos del sistema (500), devolviendo JSON estandarizado."
    )

    doc.add_heading("1.3.3 Carpeta src/routes/ (Enrutamiento modular)", level=3)
    doc.add_paragraph(
        "El enrutador central index.js monta los submódulos bajo el prefijo /api:\n"
        "• Rutas públicas: /api/auth/login, /api/auth/register, /api/plans, /api/carnets/verify/:hash (validación pública QR), /api/webhooks/mercadopago.\n"
        "• Rutas SuperAdmin: /api/companies, /api/plans, /api/subscriptions, /api/system-users, /api/system-roles, /api/system-parameters, /api/banners.\n"
        "• Rutas Empresa (Tenant): /api/headquarters, /api/areas, /api/cargos, /api/colaboradores, /api/templates, /api/carnets."
    )

    doc.add_heading("1.3.4 Carpeta src/controllers/ (Controladores delgados)", level=3)
    doc.add_paragraph(
        "Los controladores actúan como adaptadores delgados entre HTTP y la capa de servicios:\n"
        "1. Extraen los datos de la solicitud (req.body, req.params, req.query, req.file, req.user).\n"
        "2. Invocan los métodos correspondientes en la capa de servicios.\n"
        "3. Estructuran la respuesta JSON con códigos HTTP normalizados (200 OK, 201 Created, 204 No Content).\n"
        "Controladores destacados: authUnifiedController.js, companyCarnetController.js, companyUserController.js, webhookController.js."
    )

    doc.add_heading("1.3.5 Carpeta src/services/ (Lógica de negocio y transacciones)", level=3)
    doc.add_paragraph(
        "Es el núcleo del backend (Thick Services). Contiene las reglas de dominio y transacciones ACID:\n"
        "• authService.js: Algoritmo de inicio de sesión unificado. Busca primero en company_users verificando el estado de la empresa; si no existe, busca en system_users. Compara hashes con Bcrypt e inyecta la información de personalización visual (branding).\n"
        "• companyCarnetService.js: Valida la cuota del plan (planLimits.js), calcula la fecha de vigencia y genera un hash criptográfico único SHA-256 para el código QR.\n"
        "• mercadopagoService.js: Genera preferencias de Checkout Pro, valida la firma HMAC x-signature del webhook y activa automáticamente las suscripciones pagadas.\n"
        "• companyUserService.js: Comprueba unicidad de documento de identidad y vincula sedes, áreas y cargos."
    )

    doc.add_heading("1.3.6 Carpeta src/models/ (Modelado relacional Sequelize)", level=3)
    doc.add_paragraph(
        "Mapeo objeto-relacional sobre MySQL estructurado en 3 subdominios:\n"
        "• models/core/: company.js (datos de la empresa, NIT, plan y estado), companyParameter.js (branding y logos) y companyLog.js (auditoría interna).\n"
        "• models/tenant/: companyHeadquarter.js (sedes), companyArea.js (áreas), companyRol.js (cargos), companyUser.js (colaboradores), companyTemplateCarnet.js (plantillas) y companyCarnet.js (credenciales emitidas).\n"
        "• models/ raíz: plans.js, subscription.js, systemUser.js, systemRol.js, payment.js, Banner.js.\n"
        "• models/index.js: Define las relaciones foráneas aplicando la política estricta ON DELETE RESTRICT para evitar borrados accidentales en cascada."
    )

    doc.add_heading("1.3.7 Carpeta src/validators/ (Validación declarativa con Joi)", level=3)
    doc.add_paragraph(
        "• authValidator.js: Valida formato de correo RFC y longitud de contraseña (6+ caracteres).\n"
        "• companyValidator.js: Exige razón social (3 a 150 caracteres), formato de NIT alfanumérico y teléfono consistente.\n"
        "• carnetValidator.js: Comprueba que user_id y template_id sean enteros positivos y que la fecha de caducidad sea estrictamente futura.\n"
        "• planValidator.js: Verifica que las cuotas máximas sean números enteros no negativos."
    )

    doc.add_heading("1.3.8 Carpeta src/utils/ (Herramientas transversales y control de límites)", level=3)
    doc.add_paragraph(
        "• planLimits.js: Motor de control de consumo. Implementa checkPlanLimit(companyId, resourceType) para verificar que la empresa tenga suscripción activa y no exceda sus cupos antes de persistir registros.\n"
        "• context.js: Wrapper de AsyncLocalStorage para propagar el ID de solicitud y datos de sesión.\n"
        "• logger.js y logHooks.js: Logger Winston estructurado en JSON con rotación diaria y hooks Sequelize para auditar cambios sobre tablas maestras.\n"
        "• cache.js: Aceleración en memoria RAM con node-cache para parámetros de sistema y validaciones públicas de QR.\n"
        "• appError.js: Clase personalizada para el manejo de excepciones operacionales."
    )

    doc.add_heading("1.3.9 Carpeta src/helpers/ (Inicialización y envoltorios)", level=3)
    doc.add_paragraph(
        "• initializeSystemData.js: Seeder que se ejecuta al arrancar server.js. Si la base de datos está vacía, crea el rol SuperAdmin, el usuario Admin@admin con Bcrypt y el Plan Gratuito con 10 cupos.\n"
        "• asyncHandler.js: Envoltorio de promesas para middlewares de Express."
    )

    doc.add_heading("1.3.10 Carpetas src/jobs/ y src/workers/ (Segundo plano)", level=3)
    doc.add_paragraph(
        "• jobs/subscriptionExpiryJob.js: Tarea Cron ejecutada diariamente a las 00:05 AM (5 0 * * *). Detecta suscripciones vencidas, las actualiza a expired e inactiva a las empresas morosas.\n"
        "• workers/billingWorker.js: Procesamiento asíncrono de conciliación de pagos diferidos."
    )

    doc.add_heading("1.3.11 Carpeta src/uploads/ (Almacenamiento de archivos)", level=3)
    doc.add_paragraph(
        "• uploads/logos/: Guarda logotipos corporativos por empresa.\n"
        "• uploads/banners/: Almacena banners informativos del sistema.\n"
        "• Servido mediante express.static('src/uploads') con cabeceras Cache-Control: public, max-age=86400."
    )

    doc.add_heading("1.3.12 Archivos raíz: src/app.js y src/server.js", level=3)
    doc.add_paragraph(
        "• src/app.js: Monta middlewares de seguridad (Helmet, CORS, Rate Limit, Compression), parser JSON, Morgan, contextMiddleware, enrutador maestro /api y errorMiddleware.\n"
        "• src/server.js: Autentica Sequelize con MySQL, ejecuta initializeSystemData(), programa el Cron nocturno de suscripciones e inicia el socket TCP en el puerto 4000."
    )

    # --- 1.4 CATÁLOGO API ---
    doc.add_heading("1.4 Catálogo maestro de endpoints (API Reference completa)", level=2)
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
    doc.add_paragraph(
        "El frontend aplica una arquitectura modular Feature-First, separando de forma estricta los servicios centrales, las plantillas visuales y los dominios de usuario:"
    )

    tbl_f_dirs = doc.add_table(rows=1, cols=3)
    headers_f_dirs = ["Directorio en src/", "Responsabilidad técnica", "Componentes destacados"]
    data_f_dirs = [
        ("src/core/", "Servicios compartidos, clientes HTTP y contexto global de sesión.", "AuthContext.jsx, apiClient.js, storage.js"),
        ("src/layouts/", "Estructuras de navegación y marcos de diseño visual.", "public/Layout.jsx, system/SystemLayout.jsx, company/CompanyLayout.jsx"),
        ("src/modules/public/", "Módulos de acceso libre sin autenticación previa.", "home/ (Landing page), blog/, auth/ (Login, Registro, Checkout)"),
        ("src/modules/system/", "Consola de administración global para superusuarios.", "home/, companies/, plans/, subscriptions/, users/, roles/, parameters/"),
        ("src/modules/company/", "Consola operativa de la empresa cliente (tenant).", "home/, headquarters/, areas/, roles/, users/, templates/, carnets/, parameter/, subscription/"),
        ("src/routes/", "Configuración centralizada de rutas y protección de accesos.", "PublicRoutes.jsx, SystemRoutes.jsx, CompanyRoutes.jsx, ProtectedRoute.jsx"),
        ("src/components/", "Elementos visuales genéricos y reutilizables.", "ui/ (Botones, Modales, Inputs), common/ (Pagination, LimitAlert)"),
        ("src/hooks/", "Custom hooks para consumo de APIs y debounce reactivo.", "useDebounce.js, useCarnets.js")
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
    format_table(tbl_f_routes, [1.6, 1.2, 1.4, 2.3], headers_f_routes, data_f_routes, "001F3F")

    doc.add_heading("2.4 Motor gráfico de credenciales (Canvas Engine a 300 DPI)", level=2)
    doc.add_paragraph(
        "El diseñador de plantillas (CanvasDesigner.jsx) opera con un motor gráfico nativo sobre el elemento <canvas> de HTML5, "
        "evitando el uso de renderizadores pesados en el servidor (Puppeteer/wkhtmltopdf):\n"
        "• Capas ordenadas (z-index): Capa de fondo corporativo, logos vectoriales, fotografía del colaborador, textos y código QR.\n"
        "• Marcadores dinámicos: Etiquetas como {{nombres}}, {{apellidos}}, {{documento}}, {{cargo}} y {{sede}} que el sistema reemplaza en tiempo real durante la emisión.\n"
        "• Generación de código QR seguro: Dibujado de códigos bidimensionales que contienen la URL pública de verificación criptográfica.\n"
        "• Exportación de alta resolución: Salida gráfica rasterizada a 300 DPI adecuada para impresión física o visualización en teléfonos móviles."
    )

    doc.add_page_break()

    # =========================================================================
    # PARTE 3: CONCEPTOS TRANSVERSALES Y DECISIONES DE ARQUITECTURA (ADR)
    # =========================================================================
    doc.add_heading("Parte 3. Conceptos transversales y decisiones de arquitectura (ADR)", level=1)

    doc.add_heading("3.1 Seguridad Zero-Trust y aislamiento multi-inquilino", level=2)
    doc.add_paragraph(
        "1. Aislamiento estricto de base de datos: Todas las consultas de lectura y mutación ejecutan obligatoriamente la cláusula WHERE company_id = ?, impidiendo la vulnerabilidad de referencia directa a objetos inseguros (IDOR).\n"
        "2. Manejo de secretos: Las credenciales de MySQL y Mercado Pago se inyectan como variables de entorno (.env) y nunca se persisten en el repositorio Git.\n"
        "3. Hashing de contraseñas: Implementación de Bcrypt con costo 10 y semillas criptográficas pseudo-aleatorias."
    )

    doc.add_heading("3.2 Registro maestro de decisiones de arquitectura (ADR)", level=2)
    tbl_adr = doc.add_table(rows=1, cols=4)
    headers_adr = ["ID", "Título de la Decisión", "Estado", "Decisión Adoptada y Justificación"]
    data_adr = [
        ("ADR-001", "MySQL con Sequelize para Persistencia Relacional", "Aceptado", "Adopción de MySQL 8 con Sequelize aplicando borrado restringido (ON DELETE RESTRICT) para preservar la integridad histórica."),
        ("ADR-002", "Contexto Asíncrono con AsyncLocalStorage", "Aceptado", "Uso de contextMiddleware.js para propagar x-request-id y company_id sin contaminar firmas de función."),
        ("ADR-003", "Renderizado de Carnets en el Cliente vía HTML5 Canvas", "Aceptado", "Delegación del renderizado a 300 DPI en el navegador del usuario para no sobrecargar de CPU el servidor Node.js."),
        ("ADR-004", "Hashing Criptográfico SHA-256 para Códigos QR", "Aceptado", "Generación de hashes no secuenciales de 256 bits para impedir ataques de enumeración y falsificación de carnets."),
        ("ADR-005", "Checkout Pro y Webhooks HMAC en Mercado Pago", "Aceptado", "Integración con pasarela de pagos con verificación estricta de firma criptográfica x-signature."),
        ("ADR-006", "Adopción de Express 5 para Manejo Nativo de Promesas", "Aceptado", "Eliminación de bloques try/catch repetitivos gracias a la resolución asíncrona nativa de Express 5.")
    ]
    format_table(tbl_adr, [1.0, 2.2, 1.0, 2.3], headers_adr, data_adr, "001F3F")

    # Guardar en ambas ubicaciones
    print(f"Guardando documento Word Técnico en: {DOCX_OUTPUT_FRONT} ...")
    doc.save(DOCX_OUTPUT_FRONT)
    print(f"Guardando documento Word Técnico en: {DOCX_OUTPUT_BACK} ...")
    doc.save(DOCX_OUTPUT_BACK)
    print("¡MANUAL TÉCNICO DE ARQUITECTURA GENERADO EXITOSAMENTE EN WORD!")

if __name__ == "__main__":
    build_technical_manual()
