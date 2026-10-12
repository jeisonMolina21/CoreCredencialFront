---
name: c4-model-architecture-diagrams
description: >-
  Especialista en Modelado Visual de Arquitectura de Software con el Modelo C4 y Diagramas Mermaid.
  Activa esta skill para diseñar diagramas arquitectónicos a 4 niveles de abstracción:
  Nivel 1 (Contexto de Sistema), Nivel 2 (Contenedores), Nivel 3 (Componentes) y Nivel 4 (Código y Entidades),
  utilizando sintaxis nativa ejecutable de Mermaid.js compatible con GitHub, Markdown y herramientas de Docs-as-Code.
---

# 📐 C4 Model & Mermaid Architecture Diagrams (Master Specification)

El **Modelo C4** (creado por Simon Brown) es el enfoque estándar de la industria para visualizar y comunicar la arquitectura de software. Funciona exactamente igual que los mapas de navegación geográfica (Google Maps), ofreciendo cuatro niveles progresivos de zoom:

1. **Nivel 1: Contexto del Sistema (System Context):** El mapa mundial. Muestra las personas y los sistemas externos.
2. **Nivel 2: Contenedores (Containers):** El mapa de la ciudad. Muestra las aplicaciones desplegables, bases de datos y microservicios.
3. **Nivel 3: Componentes (Components):** El mapa del vecindario. Descompone un contenedor individual en sus módulos y controladores.
4. **Nivel 4: Código (Code):** El plano del edificio. Muestra clases, entidades relacionales o máquinas de estado.

---

## 🎯 Reglas de Oro de los Diagramas C4

1. **Cada elemento debe tener 3 partes:**
   - **Nombre:** Qué es (ej. `Backend API`).
   - **Tipo o Tecnología:** En qué está construido (ej. `[Contenedor: Node.js / Express]`).
   - **Responsabilidad:** Qué hace en una frase concisa (ej. `Gestiona autenticación, lógica de carnetización y límites`).
2. **Cada flecha / relación debe tener:**
   - **Acción unidireccional:** Un verbo en presente (ej. `Consulta credenciales`, `Envía pagos`).
   - **Protocolo de comunicación:** Entre corchetes o paréntesis (ej. `[HTTPS / JSON]`, `[TCP / 3306]`).
3. **Cero cajas misteriosas:** Ninguna caja puede llamarse simplemente "Servidor" o "Módulo" sin tecnología ni propósito.

---

## 🏗️ Implementación de los 4 Niveles en Mermaid.js

### 🌐 Nivel 1: Diagrama de Contexto del Sistema (System Context)
* **Audiencia:** Directores de tecnología, gerentes de producto, arquitectos y nuevos miembros del equipo.
* **Propósito:** Mostrar los límites del software y cómo interactúan los diferentes tipos de usuarios y servicios externos.

```mermaid
graph TB
    subgraph Usuarios["Actores del Negocio"]
        SuperAdmin["👤 SuperAdmin de Sistema<br/>[Actor]<br/>Gestiona empresas clientes, paquetes comerciales y auditoría global"]
        AdminEmpresa["👤 Administrador de Empresa<br/>[Actor]<br/>Configura sedes, áreas, colaboradores y emite carnets"]
        Colaborador["👤 Colaborador / Usuario Final<br/>[Actor]<br/>Porta su carnet digital en su dispositivo móvil"]
        Vigilante["👤 Personal de Seguridad / Validador<br/>[Actor]<br/>Escanea códigos QR para verificar autenticidad"]
    end

    CarnetDigitalSystem["🏢 Sistema Carnet Digital<br/>[Sistema de Software]<br/>Plataforma SaaS para emisión, diseño Canvas y verificación de credenciales digitales seguras"]

    subgraph SistemasExternos["Sistemas Externos"]
        MercadoPago["💳 Mercado Pago API<br/>[Pasarela de Pagos]<br/>Procesa suscripciones recurrentes y cobros con tarjeta/PSE"]
        SMTPGateway["📧 Servidor SMTP / Correo<br/>[Infraestructura de Notificaciones]<br/>Envía notificaciones de emisión y credenciales de acceso"]
    end

    SuperAdmin -->|"Administra plataforma y planes<br/>[HTTPS / Web]"| CarnetDigitalSystem
    AdminEmpresa -->|"Configura nómina y diseña plantillas<br/>[HTTPS / Web]"| CarnetDigitalSystem
    Colaborador -->|"Visualiza y descarga su carnet digital<br/>[HTTPS / Web]"| CarnetDigitalSystem
    Vigilante -->|"Valida QR público en puntos de control<br/>[HTTPS / Web]"| CarnetDigitalSystem

    CarnetDigitalSystem -->|"Crea preferencias de cobro y recibe Webhooks<br/>[HTTPS / REST]"| MercadoPago
    CarnetDigitalSystem -->|"Despacha correos transaccionales<br/>[SMTP / TLS]"| SMTPGateway
```

---

### 📦 Nivel 2: Diagrama de Contenedores (Container Diagram)
* **Audiencia:** Desarrolladores backend, frontend, devops e ingenieros de seguridad.
* **Propósito:** Desglosar el sistema en sus unidades de despliegue independientes (aplicaciones cliente, APIs, almacenes de datos).

```mermaid
graph TB
    actor Admin as "👤 Administrador / Usuario"
    actor PublicUser as "👤 Lector de QR / Vigilante"

    subgraph CarnetDigitalBoundary["Frontera del Sistema: Carnet Digital"]
        FrontendApp["💻 Single Page Application (SPA)<br/>[Contenedor: React 19 / Vite]<br/>Interfaz reactiva multi-rol con motor gráfico Canvas para diseño y exportación de carnets a 300 DPI"]
        
        ReverseProxy["🛡️ Reverse Proxy & Edge<br/>[Contenedor: Nginx]<br/>Terminación SSL/TLS, compresión Brotli/Gzip y mitigación básica de DDoS"]
        
        BackendAPI["⚙️ Backend RESTful API<br/>[Contenedor: Node.js 20 / Express 5]<br/>Procesa lógica de negocio, autenticación JWT, RBAC multi-inquilino y control de cuotas"]
        
        MySQLDB[("🗄️ Base de Datos Relacional<br/>[Contenedor: MySQL 8 / InnoDB]<br/>Persiste usuarios, empresas, suscripciones, sedes, plantillas y carnets emitidos")]
        
        FileStorage["📁 Almacenamiento Local Particionado<br/>[Contenedor: File System /uploads]<br/>Guarda imágenes de logotipos corporativos y banners del sistema"]
        
        CronScheduler["⏰ Tareas Nocturnas Cron<br/>[Contenedor: node-cron en Node.js]<br/>Ejecuta verificación diaria de suscripciones a las 00:05 AM"]
    end

    subgraph Externo["Pasarelas Externas"]
        MercadoPagoAPI["💳 Mercado Pago API<br/>[Servicio Externo]"]
    end

    Admin -->|"Interactúa con la interfaz<br/>[HTTPS]"| FrontendApp
    PublicUser -->|"Escanea QR y abre URL de validación<br/>[HTTPS]"| FrontendApp
    
    FrontendApp -->|"Peticiones API con token Bearer JWT<br/>[HTTPS / JSON]"| ReverseProxy
    ReverseProxy -->|"Proxy pass inverso<br/>[HTTP / 4000]"| BackendAPI
    
    BackendAPI -->|"Consultas SQL, transacciones ACID y pooling<br/>[TCP / 3306]"| MySQLDB
    BackendAPI -->|"Lee y escribe fotos y logotipos<br/>[File I/O]"| FileStorage
    BackendAPI -->|"Crea checkout y valida firmas HMAC x-signature<br/>[HTTPS / REST]"| MercadoPagoAPI
    
    CronScheduler -->|"Consulta vencimientos y suspende morosos<br/>[In-process / Sequelize]"| MySQLDB
```

---

### 🧩 Nivel 3: Diagrama de Componentes (Component Diagram - Backend API)
* **Audiencia:** Ingenieros de software y arquitectos trabajando directamente sobre el código fuente de `src/`.
* **Propósito:** Mostrar los módulos internos del backend y cómo colaboran en el ciclo de vida de una petición.

```mermaid
graph TB
    subgraph BackendAPI["Contenedor: Backend RESTful API (src/)"]
        subgraph CapaMiddleware["Capa de Middleware (src/middleware/)"]
            CtxMid["contextMiddleware<br/>Inicializa AsyncLocalStorage con UUIDv4 x-request-id"]
            AuthMid["authMiddleware<br/>Valida JWT Bearer, empresa activa y roles RBAC"]
            ValMid["validateMiddleware<br/>Sanitiza y valida esquemas Joi (400 si falla)"]
            UploadMid["uploadMiddleware<br/>Multer: valida tipos de imagen y límite de 5 MB"]
            ErrMid["errorMiddleware<br/>Capturador global de excepciones y formato JSON"]
        end

        subgraph CapaControladores["Capa de Controladores (src/controllers/)"]
            AuthCtrl["authUnifiedController<br/>Login unificado y extracción de credenciales"]
            CarnetCtrl["companyCarnetController<br/>Emisión y consulta de credenciales QR"]
            UserCtrl["companyUserController<br/>Gestión de colaboradores y fotos"]
            WebhookCtrl["webhookController<br/>Procesamiento de notificaciones de pago"]
        end

        subgraph CapaServicios["Capa de Lógica de Negocio (src/services/)"]
            AuthServ["authService<br/>Búsqueda multi-tabla, Bcrypt y claims JWT"]
            CarnetServ["companyCarnetService<br/>Generación SHA-256 QR y cálculo de vigencia"]
            UserServ["companyUserService<br/>Validación de unicidad de documento y nómina"]
            MPServ["mercadopagoService<br/>Checkout Pro, HMAC x-signature y activación"]
        end

        subgraph CapaUtilidades["Capa de Soporte (src/utils/ & helpers/)"]
            PlanLimits["planLimits.js<br/>Validador atómico de cuotas del plan comercial"]
            WinstonLogger["logger.js<br/>Registro estructurado JSON con requestId"]
            AppCache["cache.js<br/>Caché en RAM node-cache con TTL"]
        end

        subgraph CapaModelos["Capa de Persistencia (src/models/)"]
            SequelizeORM["models/index.js (Sequelize ORM)<br/>Asociaciones, integridad ON DELETE RESTRICT"]
        end
    end

    Request["Petición HTTP Entrante"] --> CtxMid
    CtxMid --> AuthMid
    AuthMid --> ValMid
    ValMid --> CarnetCtrl
    
    CarnetCtrl --> CarnetServ
    CarnetServ --> PlanLimits
    CarnetServ --> SequelizeORM
    CarnetServ --> WinstonLogger
    CarnetServ --> AppCache
    
    CarnetCtrl -.->|Si hay excepción| ErrMid
    ErrMid --> WinstonLogger
```

---

### 💻 Nivel 4: Diagrama de Código / Entidades Relacionales (Code / Entity Diagram)
* **Audiencia:** Desarrolladores implementando migraciones, consultas Sequelize o nuevos módulos.
* **Propósito:** Mostrar las relaciones relacionales de multiplicidad e integridad referencial.

```mermaid
erDiagram
    COMPANIES ||--o{ HEADQUARTERS : "tiene sedes"
    COMPANIES ||--o{ SUBSCRIPTIONS : "posee historial"
    COMPANIES ||--o| COMPANY_PARAMETERS : "personaliza branding"
    COMPANIES ||--o{ COMPANY_USERS : "registra nómina"
    COMPANIES ||--o{ CARNET_TEMPLATES : "diseña plantillas"
    COMPANIES ||--o{ CARNETS : "emite credenciales"

    HEADQUARTERS ||--o{ AREAS : "agrupa áreas"
    AREAS ||--o{ COMPANY_ROLES : "clasifica cargos"

    COMPANY_USERS ||--o{ CARNETS : "recibe carnet"
    CARNET_TEMPLATES ||--o{ CARNETS : "aplica diseño a"

    SYSTEM_PLANS ||--o{ SUBSCRIPTIONS : "contratado en"

    COMPANIES {
        int id PK
        string name
        string nit UK
        string email
        string status "active | inactive | suspended"
        int plan_id FK
    }

    HEADQUARTERS {
        int id PK
        int company_id FK
        string name
        string address
        string city
    }

    AREAS {
        int id PK
        int headquarter_id FK
        string name
    }

    COMPANY_ROLES {
        int id PK
        int area_id FK
        string name
    }

    COMPANY_USERS {
        int id PK
        int company_id FK
        string doc_type
        string doc_number
        string first_name
        string last_name
        string photo_url
    }

    CARNET_TEMPLATES {
        int id PK
        int company_id FK
        string name
        string orientation "vertical | horizontal"
        json design_json
    }

    CARNETS {
        int id PK
        int company_id FK
        int user_id FK
        int template_id FK
        string qr_hash UK
        date expiration_date
        string status "active | revoked | expired"
    }
```

---

## ✅ Checklist de Validación para Diagramas C4

- [ ] ¿El diagrama incluye un título claro y explícito que indique su nivel (C4 Nivel 1, 2, 3 o 4)?
- [ ] ¿Todas las cajas contienen Nombre, Tipo/Tecnología y Responsabilidad?
- [ ] ¿Las flechas indican la dirección del flujo de datos con verbo y protocolo?
- [ ] ¿El diagrama se renderiza correctamente en Mermaid sin errores de sintaxis?
- [ ] ¿Se evita mezclar niveles (ej. no colocar funciones de JavaScript dentro de un diagrama de contexto de Nivel 1)?
