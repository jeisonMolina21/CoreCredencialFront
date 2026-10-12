# 🪪 CoreCredential - Frontend (Carnet Digital)

[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.4-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()

Interfaz web moderna, reactiva y multi-tenant de **CoreCredential (Carnet Digital)**. Desarrollada para la gestión centralizada de colaboradores, diseño de plantillas gráficas, generación y validación de credenciales digitales con código QR, y administración de planes y suscripciones.

---

## 🚀 Características Principales

* **Portal Multi-Tenant:** Identidad corporativa dinámica (colores, logotipos, tipografías personalizadas por empresa).
* **Gestión de Colaboradores:** Módulo completo de alta, edición, búsqueda y asignación de áreas y cargos.
* **Diseñador y Visor de Carnets:** Visualización interactiva de credenciales anverso/reverso en tiempo real.
* **Suscripciones y Pasarela:** Integración oficial con el SDK de **Mercado Pago** para planes de suscripción.
* **Dashboard Analítico:** Métricas de ocupación de cuotas, sedes y colaboradores en tiempo real.
* **Experiencia de Usuario:** Micro-interacciones fluidas impulsadas por **Framer Motion** e iconografía de **Lucide React**.

---

## 🛠️ Stack Tecnológico

* **Framework Base:** [React 19](https://react.dev/)
* **Bundler & Dev Server:** [Vite 8](https://vitejs.dev/)
* **Enrutamiento:** [React Router 7](https://reactrouter.com/)
* **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
* **Iconografía:** [Lucide React](https://lucide.dev/)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Pasarela de Pago:** `@mercadopago/sdk-react`
* **Manejo de Fechas:** `date-fns`

---

## 📂 Estructura del Proyecto

```
CoreCredential-Front-main/
├── public/                 # Favicon y recursos estáticos
├── src/
│   ├── assets/             # Imágenes, logos e ilustraciones
│   ├── components/         # Componentes UI reutilizables (Modales, Tablas, Cards)
│   ├── context/            # Estados globales (AuthContext, ThemeContext)
│   ├── hooks/              # Custom React Hooks
│   ├── layouts/            # Estructuras de página (DashboardLayout, AuthLayout)
│   ├── pages/              # Vistas principales (Login, Carnets, Colaboradores, Planes)
│   ├── services/           # Clientes de API REST (Axios interceptors)
│   ├── styles/             # Estilos globales y temas CSS
│   ├── utils/              # Funciones auxiliares y formateadores
│   ├── App.jsx             # Enrutador principal y proveedores
│   └── main.jsx            # Punto de entrada ReactDOM
├── .env.example            # Plantilla de variables de entorno
├── index.html              # Plantilla HTML base
├── vite.config.js          # Configuración del empaquetador Vite
└── package.json            # Dependencias y scripts
```

---

## ⚙️ Configuración e Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jeisonMolina21/CoreCredencialFront.git
cd CoreCredencialFront
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Configura la URL de tu backend:
```env
VITE_PORT=5173
VITE_HOST=0.0.0.0
VITE_API_URL=http://localhost:4000
VITE_WHATSAPP_LINK=https://wa.me/573000000000
```

---

## ▶️ Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo local con Hot Module Replacement (HMR). |
| `npm run build` | Compila y optimiza el bundle para producción en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente el bundle generado en producción. |
| `npm run lint` | Ejecuta el linter ESLint para análisis estático de código. |

---

## 🔗 Repositorio Backend Relacionado
Este frontend se conecta con la API RESTful de:  
👉 [CoreCredencialBack](https://github.com/jeisonMolina21/CoreCredencialBack)

---

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
