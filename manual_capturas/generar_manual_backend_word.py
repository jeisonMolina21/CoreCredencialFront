# -*- coding: utf-8 -*-
"""
Generador Maestro del Documento Word Oficial:
DIRECCIÓN TIC - MANUAL TÉCNICO DE ARQUITECTURA BACKEND Y REFERENCIA DE API
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

DOCX_OUTPUT_PATH = r"f:\personal\CoreCredential-Back-main\MANUAL_TECNICO_DE_ARQUITECTURA_BACKEND_CARNET_DIGITAL.docx"

def set_cell_background(cell, hex_color):
    """Establece el color de fondo de una celda de tabla."""
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    """Establece el padding interno de una celda."""
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
    """Inserta un cuadro de llamada según las directrices de Microsoft."""
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
    """Aplica formato estructurado a tablas institucionales."""
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

def main():
    print("Creando documento Word institucional de Arquitectura Backend...")
    doc = Document()

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
    p_title.paragraph_format.space_before = Pt(24)
    p_title.paragraph_format.space_after = Pt(8)
    r_title = p_title.add_run("Carnet Digital")
    r_title.bold = True
    r_title.font.size = Pt(38)
    r_title.font.name = "Calibri"
    r_title.font.color.rgb = RGBColor(0, 31, 63)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(24)
    r_sub = p_sub.add_run("Manual técnico de arquitectura backend y referencia de API REST")
    r_sub.font.size = Pt(16)
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    p_tag = doc.add_paragraph()
    p_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tag.paragraph_format.space_after = Pt(36)
    r_tag = p_tag.add_run("Servicios backend Node.js, arquitectura multi-tenant, persistencia MySQL y pasarela Mercado Pago")
    r_tag.italic = True
    r_tag.font.size = Pt(10.5)
    r_tag.font.color.rgb = RGBColor(100, 116, 139)

    # Control de versiones institucional
    doc.add_heading("Control de versiones", level=2)
    tbl_version = doc.add_table(rows=1, cols=6)
    headers_version = ["Fecha", "Versión", "Autor / Elaboró", "Revisó", "Modificación", "Aprobación"]
    data_version = [
        (
            "28/09/2026",
            "2.5.0",
            "Ing. Especialista TIC\nArquitectura Backend",
            "Dirección de Planeación y TIC",
            "Consolidación integral de la arquitectura del backend de Carnet Digital bajo la Guía de Estilo de Microsoft.",
            "Dirección TIC /\nRectoría"
        )
    ]
    format_table(tbl_version, [0.8, 0.6, 1.3, 1.2, 1.6, 1.0], headers_version, data_version, "001F3F")

    doc.add_paragraph().paragraph_format.space_after = Pt(18)

    # Firmas formales
    tbl_firmas = doc.add_table(rows=2, cols=3)
    tbl_firmas.alignment = WD_TABLE_ALIGNMENT.CENTER
    firmas_data = [
        ("Elaboró / Modificó:", "Revisó:", "Aprobó:"),
        (
            "Ing. Especialista TIC\nArquitectura de Software & Backend\nDirección TIC\nFecha: 28 de septiembre de 2026",
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
    # INTRODUCCIÓN Y CONTENIDO GENERAL
    # =========================================================================
    doc.add_heading("Introducción", level=1)
    doc.add_paragraph(
        "El núcleo de servicios backend de Carnet Digital proporciona la lógica de negocio, persistencia relacional, "
        "mecanismos criptográficos y orquestación transaccional de toda la plataforma de credencialización. "
        "El sistema implementa una arquitectura en capas desacopladas (Rutas, Controladores, Servicios, Modelos y Tareas en Segundo Plano), "
        "asegurando la separación estricta de responsabilidades, alta mantenibilidad y cumplimiento de las mejores prácticas de la industria."
    )
    doc.add_paragraph(
        "Construido sobre Node.js con el framework Express 5 y el ORM Sequelize para MySQL, el backend opera bajo un modelo "
        "multi-inquilino (multi-tenant) seguro. Este modelo garantiza el aislamiento de datos entre empresas cliente mediante particionamiento lógico, "
        "al tiempo que unifica la administración de tarifas comerciales, suscripciones y auditoría a través de una consola SuperAdmin."
    )

    doc.add_heading("Contenido del manual de backend", level=2)
    tbl_index = doc.add_table(rows=1, cols=3)
    headers_index = ["Capítulo", "Materia técnica", "Público objetivo"]
    data_index = [
        ("Capítulo 1", "Información general y catálogo tecnológico", "Líderes de arquitectura e ingenieros backend"),
        ("Capítulo 2", "Variables de entorno (.env) y configuración de conexiones", "DevOps, administradores de sistemas y SRE"),
        ("Capítulo 3", "Ciclo de vida del servidor y pipeline de peticiones", "Desarrolladores backend y especialistas en seguridad"),
        ("Capítulo 4", "Contexto asíncrono y auditoría automática (AsyncLocalStorage)", "Ingenieros de observabilidad y QA"),
        ("Capítulo 5", "Modelo de datos relacional y asociaciones Sequelize", "Administradores de bases de datos (DBA)"),
        ("Capítulo 6", "Seguridad, autenticación JWT y control de acceso (RBAC)", "Especialistas en ciberseguridad y auditoría"),
        ("Capítulo 7", "Motor de validación de límites de plan (planLimits.js)", "Desarrolladores y analistas de negocio"),
        ("Capítulo 8", "Catálogo maestro de endpoints (API Reference completa)", "Desarrolladores frontend, móviles y de integraciones"),
        ("Capítulo 9", "Tareas asíncronas y jobs en segundo plano (Cron Jobs)", "Ingenieros de operaciones y soporte"),
        ("Capítulo 10", "Matriz de diagnóstico y códigos de respuesta HTTP", "Mesa de ayuda y desarrolladores de integraciones")
    ]
    format_table(tbl_index, [1.0, 3.8, 1.7], headers_index, data_index, "001F3F")

    doc.add_page_break()

    # =========================================================================
    # CAPÍTULO 1: STACK TECNOLÓGICO
    # =========================================================================
    doc.add_heading("Capítulo 1. Información general y catálogo tecnológico", level=1)
    doc.add_paragraph(
        "El backend de Carnet Digital aprovecha el ecosistema asíncrono no bloqueante de Node.js, "
        "diseñado para procesar altos volúmenes de consultas de emisión y validación de códigos QR con latencias ultra-bajas."
    )

    tbl_tech = doc.add_table(rows=1, cols=3)
    headers_tech = ["Capa del backend", "Librería y versión", "Rol y responsabilidad técnica"]
    data_tech = [
        ("Entorno de ejecución", "Node.js (v18+ LTS / v20+)", "Motor de ejecución asíncrono basado en el motor V8."),
        ("Framework web", "Express v5.x", "Enrutamiento HTTP de alta velocidad, gestión de middleware y manejo de promesas nativo."),
        ("ORM y persistencia", "Sequelize v6.x / mysql2", "Mapeo objeto-relacional, transacciones ACID, migraciones y esquemas relacionales."),
        ("Autenticación y criptografía", "jsonwebtoken v9.x / bcryptjs v3.x", "Emisión y verificación de tokens JWT y hashing seguro de contraseñas (salt rounds = 10)."),
        ("Validación de esquemas", "Joi v18.x", "Validación estricta de carga útil (payloads), tipos de datos y sanitización de entradas."),
        ("Gestión de archivos multipart", "Multer v2.x", "Recepción y almacenamiento en disco de fotos de colaboradores y logotipos institucionales."),
        ("Pasarela de pagos", "Mercado Pago SDK v2.x", "Generación de preferencias de pago, suscripciones recurrentes y procesamiento de webhooks."),
        ("Seguridad perimetral", "Helmet, CORS, Express-Rate-Limit", "Blindaje contra XSS, Clickjacking, MIME-sniffing y mitigación de ataques de denegación de servicio."),
        ("Compresión de datos", "Compression v1.x", "Compresión Gzip / Deflate automática de respuestas JSON."),
        ("Caché en memoria", "node-cache v5.x", "Caché de consultas de alta frecuencia para parámetros globales y credenciales públicas."),
        ("Auditoría y trazabilidad", "Winston v3.x / Morgan v1.x", "Registro estructurado en formato JSON con rotación diaria y correlación por Request-ID."),
        ("Tareas en segundo plano", "node-cron v4.x", "Automatización de revisiones diarias para vencimiento de suscripciones y transiciones de estado.")
    ]
    format_table(tbl_tech, [1.5, 1.8, 3.2], headers_tech, data_tech, "001F3F")

    add_callout(doc, "La versión 5 de Express adoptada resuelve de forma nativa las promesas en controladores asíncronos sin requerir bloques try/catch repetitivos ni envoltorios auxiliares.", "NOTE")

    # =========================================================================
    # CAPÍTULO 2: VARIABLES DE ENTORNO
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 2. Variables de entorno y configuración de conexiones", level=1)
    doc.add_paragraph(
        "El comportamiento del servidor se parametriza en el archivo `.env`. "
        "A continuación se detallan las variables obligatorias y recomendadas:"
    )

    tbl_env = doc.add_table(rows=1, cols=4)
    headers_env = ["Variable de entorno", "Tipo", "Valor predeterminado / Ejemplo", "Propósito en la arquitectura"]
    data_env = [
        ("PORT", "Number", "4000", "Puerto TCP en el que escucha el servidor HTTP (Fallback: 3010)."),
        ("NODE_ENV", "String", "development / production", "Modo de ejecución. En producción silencia trazas internas y optimiza cachés."),
        ("DB_HOST", "String", "localhost", "Dirección IP o nombre de host del motor MySQL."),
        ("DB_USER", "String", "root", "Nombre de usuario con privilegios de lectura/escritura en la base de datos."),
        ("DB_PASSWORD", "String", "********", "Contraseña de acceso a la base de datos MySQL."),
        ("DB_NAME", "String", "CoreCredencial / carnet_digital", "Nombre del esquema de base de datos relacional."),
        ("DB_DIALECT", "String", "mysql", "Dialecto Sequelize configurado para el motor MySQL."),
        ("DB_TIMEZONE", "String", "-05:00", "Zona horaria aplicada en la conexión SQL (Bogotá / Lima / Quito)."),
        ("APP_TIMEZONE", "String", "America/Bogota", "Fija process.env.TZ para cálculos uniformes de fechas en Node.js."),
        ("JWT_SECRET", "String", "Clave hexadecimal 32+ chars", "Semilla criptográfica para firma y validación de tokens JWT."),
        ("JWT_EXPIRES_IN", "String", "1h", "Vigencia del token de sesión emitido."),
        ("ADMIN_DEFAULT_EMAIL", "String", "Admin@admin", "Correo electrónico del SuperAdmin sembrado automáticamente en el primer arranque."),
        ("FREE_PLAN_MAX_USERS", "Integer", "10", "Cuota predeterminada de colaboradores en el plan inicial gratuito."),
        ("FREE_PLAN_MAX_TEMPLATES", "Integer", "2", "Cuota predeterminada de plantillas autorizadas en el plan gratis."),
        ("FREE_PLAN_MAX_CARNETS", "Integer", "5", "Límite de carnets emitidos en el plan gratuito inicial."),
        ("MERCADOPAGO_TEST_PUBLIC_KEY", "String", "APP_USR-...", "Clave pública del SDK de Mercado Pago en modo Sandbox."),
        ("MERCADOPAGO_TEST_ACCESS_TOKEN", "String", "APP_USR-...", "Token de acceso a la API REST de Mercado Pago en Sandbox."),
        ("MERCADOPAGO_PROD_ACCESS_TOKEN", "String", "APP_USR-...", "Token de acceso en producción para cobros en línea."),
        ("BACKEND_URL", "String", "http://localhost:4000", "URL base pública del backend para conformar la URL de webhook."),
        ("MERCADOPAGO_BACK_URL", "String", "http://localhost:5173/payment-success", "URL de redirección al frontend tras finalizar el pago.")
    ]
    format_table(tbl_env, [1.8, 0.9, 1.8, 2.0], headers_env, data_env, "001F3F")

    add_callout(doc, "Nunca incluyas secretos de producción (JWT_SECRET o MERCADOPAGO_PROD_ACCESS_TOKEN) en repositorios públicos de control de versiones.", "ALERT")

    # =========================================================================
    # CAPÍTULO 3: PIPELINE Y CICLO DE VIDA
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 3. Ciclo de vida del servidor y pipeline de peticiones", level=1)
    doc.add_paragraph(
        "Cada petición HTTP entrante atraviesa un pipeline ordenado de middlewares que garantizan seguridad, "
        "descompresión, aislamiento de contexto y captura uniforme de errores:"
    )

    doc.add_paragraph(
        "1. Contexto asíncrono y correlación:\n"
        "   El middleware inicializa `AsyncLocalStorage` y genera un identificador único `x-request-id` (UUIDv4) para trazabilidad completa.\n\n"
        "2. Encabezados de seguridad perimetral (Helmet):\n"
        "   Elimina la cabecera `X-Powered-By: Express` e inyecta políticas de protección contra ataques comunes.\n\n"
        "3. Control de acceso de origen cruzado (CORS):\n"
        "   Valida que los dominios de origen autorizados puedan consultar la API REST, habilitando métodos seguros (GET, POST, PUT, DELETE, OPTIONS).\n\n"
        "4. Limitador de tasa de peticiones (Rate Limiter):\n"
        "   Previene ataques de fuerza bruta limitando peticiones por dirección IP en endpoints sensibles de autenticación.\n\n"
        "5. Descompresión y parseo de cuerpo (JSON Parser):\n"
        "   Procesa cargas útiles en formato JSON con límite de tamaño de 10 MB.\n\n"
        "6. Enrutamiento modular:\n"
        "   El enrutador principal distribuye la petición hacia el controlador correspondiente.\n\n"
        "7. Middleware global de captura de excepciones:\n"
        "   Si ocurre un error no controlado, formatea una respuesta estándar HTTP 500 registrando la traza en los archivos de log."
    )

    add_callout(doc, "El pipeline ejecuta una verificación de salud (Health Check) en la ruta GET /api/health retornando el estado de la base de datos y memoria utilizada.", "TIP")

    # =========================================================================
    # CAPÍTULO 4: SEGURIDAD Y MULTI-TENANCY
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 4. Seguridad, autenticación JWT y control de acceso (RBAC)", level=1)
    doc.add_paragraph(
        "El sistema valida la identidad del emisor mediante tokens JWT transmitidos en la cabecera `Authorization`. "
        "Existen dos tipos de tokens emitidos por `authService.js`:"
    )

    tbl_jwt = doc.add_table(rows=1, cols=3)
    headers_jwt = ["Tipo de usuario", "Estructura del payload JWT", "Alcance y permisos en el sistema"]
    data_jwt = [
        (
            "Administrador de Sistema\n(type: 'system')",
            "{ id: 1, email: 'Admin@admin', role: 'admin', type: 'system' }",
            "Acceso global a empresas, planes, suscripciones, roles y parámetros de la plataforma. No posee restricción de tenant."
        ),
        (
            "Usuario de Empresa\n(type: 'company')",
            "{ id: 5, email: 'carlos@empresa.com', role: 'admin', type: 'company', company_id: 1 }",
            "Acceso estricto y exclusivo a los recursos de su propia organización (company_id). El backend filtra automáticamente cada consulta SQL con WHERE company_id = ?."
        )
    ]
    format_table(tbl_jwt, [1.6, 2.5, 2.4], headers_jwt, data_jwt, "001F3F")

    doc.add_heading("4.1 Aislamiento de datos multi-inquilino (Multi-Tenant)", level=2)
    doc.add_paragraph(
        "Para garantizar la privacidad entre empresas cliente, todas las tablas de tenant (`headquarters`, `areas`, `roles`, "
        "`company_users`, `carnet_templates`, `carnets`) contienen la columna `company_id`. "
        "Los controladores y servicios validan de forma obligatoria que `req.user.company_id` coincida con el registro solicitado, "
        "previniendo vulnerabilidades de Insecure Direct Object References (IDOR)."
    )

    add_callout(doc, "Ningún usuario de empresa puede leer, modificar o revocar carnets de otra empresa, incluso si conoce el ID numérico del recurso ajeno.", "ALERT")

    # =========================================================================
    # CAPÍTULO 5: MODELO DE DATOS SEQUELIZE
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 5. Modelo relacional de datos y entidades", level=1)
    doc.add_paragraph(
        "El modelo relacional persistido en MySQL se divide en dos dominios estructurales:"
    )

    doc.add_heading("5.1 Tablas del núcleo de plataforma (Sistema)", level=2)
    tbl_mod_sys = doc.add_table(rows=1, cols=3)
    headers_mod_sys = ["Tabla / Modelo", "Columnas principales", "Propósito en la arquitectura"]
    data_mod_sys = [
        ("companies (Company)", "id, name, nit, email, phone, status, plan_id, created_at", "Directorio maestro de organizaciones cliente suscritas."),
        ("system_plans (SystemPlan)", "id, name, description, price_monthly, price_yearly, max_users, max_templates, max_carnets, max_headquarters", "Definición de paquetes y cuotas comerciales."),
        ("system_subscriptions (SystemSubscription)", "id, company_id, plan_id, status, start_date, end_date, mp_subscription_id, payment_method", "Monitoreo de vigencia, cobranzas y pasarela."),
        ("system_users (SystemUser)", "id, name, email, password, role_id, status", "Cuentas de operadores y administradores centrales."),
        ("system_roles (SystemRole)", "id, name, description, permissions", "Matriz de privilegios para usuarios del sistema central."),
        ("system_parameters (SystemParameter)", "id, key, value, description", "Banderas globales: modo de mantenimiento y llaves de pago.")
    ]
    format_table(tbl_mod_sys, [1.6, 2.5, 2.4], headers_mod_sys, data_mod_sys, "001F3F")

    doc.add_heading("5.2 Tablas operativas de empresa (Tenant)", level=2)
    tbl_mod_ten = doc.add_table(rows=1, cols=3)
    headers_mod_ten = ["Tabla / Modelo", "Columnas principales", "Propósito en la organización"]
    data_mod_ten = [
        ("headquarters (Headquarter)", "id, company_id, name, address, city, status", "Sedes físicas y sucursales de la empresa."),
        ("areas (Area)", "id, company_id, headquarter_id, name, status", "Departamentos o dependencias adscritas a sedes."),
        ("roles (Role / Cargo)", "id, company_id, area_id, name, description", "Cargos y puestos de trabajo laborales."),
        ("company_users (Colaborador)", "id, company_id, headquarter_id, area_id, role_id, doc_type, doc_number, first_name, last_name, email, photo_url, status", "Directorio completo del personal a credencializar."),
        ("carnet_templates (Template)", "id, company_id, name, orientation, background_url, design_json, is_default", "Estructura de capas visuales y marcadores dinámicos."),
        ("carnets (Carnet)", "id, company_id, user_id, template_id, qr_hash, issue_date, expiration_date, status, pdf_url", "Credenciales digitales emitidas provistas de hash QR.")
    ]
    format_table(tbl_mod_ten, [1.6, 2.5, 2.4], headers_mod_ten, data_mod_ten, "001F3F")

    # =========================================================================
    # CAPÍTULO 6: CONTROL DE LÍMITES DE PLAN
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 6. Motor de control de límites de plan (planLimits.js)", level=1)
    doc.add_paragraph(
        "Antes de persistir cualquier recurso de empresa en la base de datos, el sistema invoca la función central `checkPlanLimit()`:"
    )
    doc.add_paragraph(
        "```javascript\n"
        "await checkPlanLimit(companyId, 'users' | 'areas' | 'roles' | 'templates' | 'carnets' | 'headquarters');\n"
        "```"
    )
    doc.add_paragraph(
        "Este motor ejecuta el siguiente flujo de validación:\n"
        "1. Consulta el plan activo y la suscripción vigente de la empresa.\n"
        "2. Si la suscripción está vencida, lanza un error HTTP 403: 'Su suscripción ha expirado. Por favor renueve su plan'.\n"
        "3. Cuenta los registros actuales del recurso solicitado en la base de datos.\n"
        "4. Compara la cantidad existente contra la cuota permitida en el plan (`max_users`, `max_carnets`, etc.).\n"
        "5. Si el límite fue alcanzado, rechaza la operación con código HTTP 403 e indica la cuota máxima permitida."
    )

    add_callout(doc, "Esta verificación atómica a nivel de backend previene que usuarios maliciosos emitan carnets excedentes eludiendo los controles visuales del frontend.", "ALERT")

    # =========================================================================
    # CAPÍTULO 7: CATÁLOGO COMPLETO DE ENDPOINTS (API REFERENCE)
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 7. Catálogo maestro de endpoints (API Reference)", level=1)
    doc.add_paragraph(
        "A continuación se presenta la referencia completa de los endpoints RESTful expuestos por el backend de Carnet Digital:"
    )

    tbl_api = doc.add_table(rows=1, cols=4)
    headers_api = ["Método y Ruta", "Acceso requerido", "Carga útil (Payload) / Parámetros", "Respuesta exitosa"]
    data_api = [
        ("POST /api/auth/login", "Público", "{ email, password }", "200 OK: { token, user, branding }"),
        ("POST /api/auth/register", "Público", "{ company_name, nit, email, password, phone, plan_id }", "201 Created: { company, user, payment_url }"),
        ("GET /api/auth/me", "Bearer JWT", "Cabecera Authorization", "200 OK: { user, company, permissions }"),
        ("GET /api/auth/payment-config", "Público", "Ninguno", "200 OK: { public_key, currency }"),
        ("GET /api/companies", "SuperAdmin", "Filtros: ?search, ?status, ?page", "200 OK: { companies: [], total, pages }"),
        ("POST /api/companies", "SuperAdmin", "{ name, nit, email, phone, plan_id }", "201 Created: { company }"),
        ("PUT /api/companies/:id", "SuperAdmin", "{ name, nit, email, phone, status }", "200 OK: { company actualiza }"),
        ("GET /api/plans", "Público / Autenticado", "Ninguno", "200 OK: [ { id, name, price, limits } ]"),
        ("POST /api/plans", "SuperAdmin", "{ name, price_monthly, max_users, max_carnets }", "201 Created: { plan }"),
        ("GET /api/subscriptions", "SuperAdmin", "Filtros: ?status, ?company_id", "200 OK: [ { subscription } ]"),
        ("GET /api/headquarters", "Empresa (Tenant)", "Cabecera con Token de Empresa", "200 OK: [ { id, name, address, city } ]"),
        ("POST /api/headquarters", "Empresa (Tenant)", "{ name, address, city }", "201 Created: { headquarter }"),
        ("GET /api/areas", "Empresa (Tenant)", "?headquarter_id", "200 OK: [ { id, name, headquarter_id } ]"),
        ("POST /api/areas", "Empresa (Tenant)", "{ name, headquarter_id }", "201 Created: { area }"),
        ("GET /api/cargos", "Empresa (Tenant)", "?area_id", "200 OK: [ { id, name, area_id } ]"),
        ("POST /api/cargos", "Empresa (Tenant)", "{ name, area_id }", "201 Created: { cargo }"),
        ("GET /api/colaboradores", "Empresa (Tenant)", "?search, ?area_id, ?status, ?page", "200 OK: { colaboradores: [], total }"),
        ("POST /api/colaboradores", "Empresa (Tenant)", "Multipart: doc_type, doc_number, first_name, last_name, photo", "201 Created: { colaborador }"),
        ("GET /api/templates", "Empresa (Tenant)", "Cabecera con Token de Empresa", "200 OK: [ { id, name, design_json } ]"),
        ("POST /api/templates", "Empresa (Tenant)", "{ name, orientation, design_json, background_url }", "201 Created: { template }"),
        ("GET /api/carnets", "Empresa (Tenant)", "?user_id, ?status, ?page", "200 OK: { carnets: [], total }"),
        ("POST /api/carnets", "Empresa (Tenant)", "{ user_id, template_id, expiration_date }", "201 Created: { carnet, qr_hash, pdf_url }"),
        ("DELETE /api/carnets/:id", "Empresa (Tenant)", "ID del carnet a revocar", "200 OK: { message: 'Carnet revocado' }"),
        ("GET /api/carnets/verify/:hash", "Público", "Hash único del código QR", "200 OK: { valid: true, colaborador, vigencia }"),
        ("POST /api/webhooks/mercadopago", "Público (Firma HMAC)", "Header: x-signature, Body: { data: { id } }", "200 OK: { received: true }")
    ]
    format_table(tbl_api, [1.8, 1.3, 1.8, 1.6], headers_api, data_api, "001F3F")

    # =========================================================================
    # CAPÍTULO 8: JOBS Y TAREAS EN SEGUNDO PLANO
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 8. Tareas asíncronas y jobs en segundo plano (Cron Jobs)", level=1)
    doc.add_paragraph(
        "El aplicativo programa procesos desatendidos mediante la librería `node-cron` (`src/jobs/subscriptionExpiryJob.js`), "
        "garantizando la integridad del estado de las empresas cliente sin requerir intervención manual:"
    )

    tbl_jobs = doc.add_table(rows=1, cols=3)
    headers_jobs = ["Nombre del Job", "Expresión Cron / Frecuencia", "Acción ejecutada"]
    data_jobs = [
        (
            "subscriptionExpiryJob",
            "`5 0 * * *`\n(Todos los días a las 00:05 AM)",
            "1. Busca suscripciones cuya fecha de finalización (end_date) sea inferior al día actual.\n"
            "2. Cambia el estado de la suscripción a 'expired'.\n"
            "3. Actualiza el estado de la empresa asociada a 'inactive'.\n"
            "4. Registra en el log de auditoría las empresas deshabilitadas."
        ),
        (
            "tempFilesPurgeJob",
            "`0 3 * * 0`\n(Domingos a las 03:00 AM)",
            "1. Inspecciona la carpeta temporal uploads/.\n"
            "2. Elimina archivos temporales de PDF o fotos que no hayan sido vinculados a un carnet en los últimos 7 días."
        )
    ]
    format_table(tbl_jobs, [1.6, 1.8, 3.1], headers_jobs, data_jobs, "001F3F")

    # =========================================================================
    # CAPÍTULO 9: AUDITORÍA Y CÓDIGOS DE ERROR
    # =========================================================================
    doc.add_page_break()
    doc.add_heading("Capítulo 9. Matriz de auditoría y diagnóstico de errores", level=1)
    doc.add_paragraph(
        "El servidor responde bajo el protocolo estándar HTTP y encapsula los errores mediante un formato JSON consistente:"
    )
    doc.add_paragraph(
        "```json\n"
        "{\n"
        '  "success": false,\n'
        '  "error": "Mensaje legible para el usuario o desarrollador",\n'
        '  "requestId": "c4b91f1a-8e2b-4e12-b9d1-9f2e4a8c16b3",\n'
        '  "timestamp": "2026-09-28T17:30:00.000Z"\n'
        "}\n"
        "```"
    )

    tbl_http = doc.add_table(rows=1, cols=3)
    headers_http = ["Código HTTP", "Significado técnico", "Causa habitual en Carnet Digital"]
    data_http = [
        ("200 OK", "Petición exitosa", "Consulta o actualización completada satisfactoriamente."),
        ("201 Created", "Recurso creado", "Creación exitosa de empresa, colaborador, plantilla o carnet."),
        ("400 Bad Request", "Carga útil inválida", "Faltan campos obligatorios o no superan las validaciones Joi."),
        ("401 Unauthorized", "No autenticado", "Token JWT ausente, expirado o con firma criptográfica inválida."),
        ("403 Forbidden", "Acceso denegado / Cuota agotada", "Usuario intentando acceder a otra empresa o cuota máxima del plan excedida."),
        ("404 Not Found", "Recurso no encontrado", "El ID solicitado no existe en la base de datos."),
        ("409 Conflict", "Conflicto de unicidad", "NIT o correo electrónico ya registrado previamente."),
        ("429 Too Many Requests", "Límite de tasa excedido", "Demasiados intentos de autenticación en un lapso corto."),
        ("500 Internal Error", "Error interno no controlado", "Excepción de base de datos o fallo en el servidor.")
    ]
    format_table(tbl_http, [1.3, 1.8, 3.4], headers_http, data_http, "001F3F")

    # Guardar documento Word
    print(f"Guardando documento Word oficial del backend en: {DOCX_OUTPUT_PATH} ...")
    doc.save(DOCX_OUTPUT_PATH)
    print("¡DOCUMENTO WORD DE BACKEND GENERADO EXITOSAMENTE!")

if __name__ == "__main__":
    main()
