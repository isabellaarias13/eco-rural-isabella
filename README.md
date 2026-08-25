# 🌱 Eco-Rural — Sistema de Gestión de Basura y Aseo Rural
### 📍 Municipio: Purificación, Tolima — Colombia

**Eco-Rural** es una plataforma web integral y progresiva diseñada para la planeación, monitoreo satelital en tiempo real, control de pesaje, administración de flota vehicular y fomento del reciclaje campesino en las 15 veredas del municipio de **Purificación, Tolima**.

---

## 📑 Ficha Técnica del Proyecto

| Componente | Especificación / Tecnología |
| :--- | :--- |
| **Lenguaje de Programación** | **TypeScript 5.8+** (Tipado estático robusto) y **JavaScript ECMAScript Moderno** |
| **Framework Frontend** | **React 19** (Arquitectura basada en Componentes Funcionales y Hooks modernos) |
| **Herramienta de Construcción (Build Tool)** | **Vite 6** (Empaquetado ultrarrápido y servidor de desarrollo optimizado) |
| **Motor de Estilos (CSS Framework)** | **Tailwind CSS v4** (Diseño responsivo, utilidades atómicas y variables CSS nativas) |
| **Librería de Animaciones** | **Motion (`motion/react`)** para transiciones fluidas de vista y modales |
| **Iconografía** | **Lucide React** (Íconos vectoriales accesibles y ligeros) |
| **Generación de Reportes** | **jsPDF** & **jspdf-autotable** (Exportación PDF oficial con membrete) y **CSV/Excel Export** |
| **Motor de Base de Datos Cloud** | **Google Cloud Firestore (Firebase)** en tiempo real (Base de datos NoSQL documental activa) |
| **Motor de Base de Datos Relacional** | **MySQL 8.0+** / **MariaDB 10.4+** (Scripts SQL completos incluidos en `/database`) |
| **Persistencia Frontend / Offline** | **Reactive Store Centralizado** sincronizado con **Cloud Firestore** y **`localStorage`** |
| **Patrón de Arquitectura** | **Modelo-Vista-Controlador (MVC)** con separación estricta de responsabilidades |

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos del Sistema](#1-requisitos-previos-del-sistema)
2. [Descarga y Clonación del Proyecto](#2-descarga-y-clonación-del-proyecto)
3. [Configuración Inicial y Variables de Entorno](#3-configuración-inicial-y-variables-de-entorno)
4. [Configuración de la Base de Datos MySQL](#4-configuración-de-la-base-de-datos-mysql)
5. [Instalación de Dependencias y Ejecución Local](#5-instalación-de-dependencias-y-ejecución-local)
6. [Estructura del Proyecto y Patrón MVC](#6-estructura-del-proyecto-y-patrón-mvc)
7. [Configuración Global y Parámetros del Sistema](#7-configuración-global-y-parámetros-del-sistema)
8. [Roles de Usuario y Accesos](#8-roles-de-usuario-y-accesos)
9. [Módulos y Funcionalidades del Sistema](#9-módulos-y-funcionalidades-del-sistema)
10. [Scripts Disponibles](#10-scripts-disponibles)
11. [Compilación y Despliegue en Producción](#11-compilación-y-despliegue-en-producción)
12. [Preguntas Frecuentes y Solución de Problemas](#12-preguntas-frecuentes-y-solución-de-problemas)

---

## 1. Requisitos Previos del Sistema

Antes de comenzar la instalación, asegúrate de contar con el siguiente software en tu entorno local:

- **Node.js**: Versión **`18.0.0`**, **`20.0.0`** o superior (LTS recomendada).
  - Comprueba tu versión ejecutando en la terminal:
    ```bash
    node -v
    ```
  - Si no lo tienes instalado, descárgalo desde [nodejs.org](https://nodejs.org/).
- **Gestor de Paquetes**: `npm` (versión 9+ incluida con Node.js), `pnpm` o `bun`.
- **Servidor de Base de Datos MySQL / MariaDB**:
  - MySQL Server 8.0+, MariaDB 10.4+, o suites como **XAMPP**, **WampServer**, **Laragon** o **Docker**.
- **Cliente / Administrador de Base de Datos**:
  - MySQL Workbench, phpMyAdmin, DBeaver, DataGrip o la línea de comandos `mysql`.
- **Navegador Web**: Google Chrome, Microsoft Edge, Mozilla Firefox o Safari actualizado.
- **Git** (Opcional, para clonación de repositorios).

---

## 2. Descarga y Clonación del Proyecto

### Opción A: Mediante Git (Recomendado)
Abre tu terminal en la carpeta de desarrollo y ejecuta:
```bash
git clone <URL_DEL_REPOSITORIO> eco-rural-purificacion
cd eco-rural-purificacion
```

### Opción B: Mediante archivo comprimido (.ZIP)
1. Descarga y extrae el archivo `.zip` en tu computadora.
2. Abre la terminal (`PowerShell`, `CMD` en Windows o `Terminal` en macOS/Linux).
3. Navega hacia la carpeta del proyecto descomprimido:
   ```bash
   cd ruta/hacia/eco-rural-purificacion
   ```

---

## 3. Configuración Inicial y Variables de Entorno

El proyecto incluye una plantilla de variables de entorno llamada `.env.example`.

### Paso 1: Crear el archivo `.env`
Copia el archivo `.env.example` en la raíz del proyecto para crear tu archivo `.env` local:

- **En Linux / macOS:**
  ```bash
  cp .env.example .env
  ```
- **En Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **En Windows (Símbolo del Sistema / CMD):**
  ```cmd
  copy .env.example .env
  ```

### Paso 2: Configurar las variables
Abre el archivo `.env` con tu editor de código favorito y ajusta las variables según sea necesario:

```env
# Clave API opcional para funciones de Inteligencia Artificial (Google Gemini)
GEMINI_API_KEY=

# URL base de la aplicación para enlaces públicos o despliegue
APP_URL=http://localhost:3000

# Parámetros de conexión a la Base de Datos MySQL (Para backend o microservicios)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ecorural_purificacion
```

---

## 4. Configuración de Bases de Datos

### A. Base de Datos en la Nube: Google Firebase (Cloud Firestore)
La aplicación cuenta con sincronización nativa en tiempo real con **Google Cloud Firestore**.
- **Configuración del proyecto**: Los parámetros de acceso están definidos en `firebase-applet-config.json`.
- **Esquema Documental**: Definido en `firebase-blueprint.json` para las colecciones `/users`, `/trucks`, `/routes`, `/collections`, `/alerts` y `/notifications`.
- **Reglas de Seguridad**: Desplegadas y validadas mediante `firestore.rules`.
- **Sincronización Automática**: El modelo reactivo (`src/models/store.ts`) mantiene sincronizados los datos locales con Firebase en segundo plano con soporte offline.

### B. Base de Datos Relacional: MySQL / MariaDB (Scripts SQL)

En el directorio **`/database`** encontrarás los scripts SQL estructurados si requieres montar un servidor de base de datos relacional propio:

#### Archivos disponibles en `/database`:
1. **`init_database.sql`** *(Recomendado)*: Script unificado que crea la base de datos `ecorural_purificacion`, todas las tablas con sus claves foráneas, vistas analíticas y todos los datos iniciales de Purificación.
2. **`schema.sql`**: Definición de la estructura de tablas (DDL), índices y vistas.
3. **`seed.sql`**: Inserción de datos iniciales (DML) con veredas, usuarios, camiones y rutas.

#### Métodos de Importación MySQL:

##### 1. Por Terminal / Consola MySQL (Más rápido)
Ejecuta el siguiente comando en la raíz del proyecto:
```bash
mysql -u root -p < database/init_database.sql
```
*(Ingresa tu contraseña de MySQL cuando sea solicitada).*

##### 2. Mediante phpMyAdmin (XAMPP / WAMP / Laragon)
1. Abre tu navegador e ingresa a `http://localhost/phpmyadmin`.
2. Haz clic en la pestaña **Importar** (Import).
3. En **Archivo a importar**, selecciona el archivo `database/init_database.sql`.
4. Haz clic en **Continuar** o **Importar**.

##### 3. Mediante MySQL Workbench
1. Abre MySQL Workbench y conéctate a tu instancia local.
2. Ve a **File** > **Open SQL Script...** y selecciona `database/init_database.sql`.
3. Presiona el botón del rayo ⚡ (**Execute**) para ejecutar todo el script.
4. En el panel izquierdo de **Schemas**, haz clic derecho y selecciona **Refresh All**.

---

## 5. Instalación de Dependencias y Ejecución Local

### Paso 1: Instalar los paquetes Node.js
Ejecuta el siguiente comando en la terminal:
```bash
npm install
```
*(O si usas otro gestor: `pnpm install` o `bun install`)*

### Paso 2: Iniciar el servidor de desarrollo
Una vez finalizada la instalación, inicia el servidor:
```bash
npm run dev
```

La terminal mostrará:
```
  VITE v6.2.3  ready in 260 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Abre tu navegador e ingresa a: **`http://localhost:3000`**

---

## 6. Estructura del Proyecto y Patrón MVC

La aplicación está organizada bajo el patrón arquitectónico **Modelo-Vista-Controlador (MVC)**, garantizando una separación clara entre la lógica de negocio, los datos y la interfaz de usuario:

```
eco-rural-purificacion/
│
├── .env.example             # Plantilla de variables de entorno
├── index.html               # Documento HTML raíz con tipografías y viewport
├── metadata.json            # Metadatos del proyecto
├── package.json             # Manifiesto de dependencias y scripts
├── tsconfig.json            # Configuración estricta del compilador TypeScript
├── vite.config.ts           # Configuración del empaquetador Vite y Tailwind
│
├── database/                # 🗄️ SCRIPTS DE BASE DE DATOS MYSQL
│   ├── init_database.sql    # Script unificado (Esquema + Datos iniciales)
│   ├── schema.sql           # Estructura DDL (Tablas, Índices y Vistas)
│   ├── seed.sql             # Datos de prueba de Purificación (DML)
│   └── README.md            # Guía especializada de la base de datos
│
└── src/
    ├── main.tsx             # Punto de entrada de React 19
    ├── App.tsx              # Componente raíz y orquestador de vistas
    ├── index.css            # Estilos globales y configuración Tailwind CSS v4
    │
    ├── types/               # 🏷️ DEFINICIÓN DE TIPOS E INTERFACES
    │   └── index.ts         # Modelos de datos para Usuarios, Camiones, Rutas, etc.
    │
    ├── models/              # 📦 [MODELO] CAPA DE DATOS Y PERSISTENCIA
    │   ├── store.ts         # Almacén reactivo centralizado con sincronización en LocalStorage
    │   ├── veredasData.ts   # Catálogo geográfico y coordenadas de las veredas de Purificación
    │   └── mockInitialData.ts # Semilla inicial de datos veredales y flota
    │
    ├── controllers/         # ⚙️ [CONTROLADOR] LÓGICA DE NEGOCIO Y OPERACIONES
    │   ├── authController.ts       # Autenticación, registro rural y cambio de perfil
    │   ├── routeController.ts      # Programación, estados y paradas de rutas
    │   ├── collectionController.ts # Registro de pesajes y cálculo de toneladas
    │   ├── truckController.ts       # Mantenimiento, telemetría y flota de camiones
    │   ├── alertController.ts      # Reportes ciudadanos y prevención de quemas
    │   └── reportController.ts     # Generación de reportes oficiales en PDF y Excel
    │
    ├── views/               # 🖥️ [VISTA] PANTALLAS Y MÓDULOS DE USUARIO
    │   ├── AuthView.tsx            # Pantalla de inicio de sesión y registro campesino
    │   ├── DashboardView.tsx       # Tablero general, mapa interactivo y métricas clave
    │   ├── RecoleccionesView.tsx   # Control de pesajes y tabla de jornadas
    │   ├── RutasView.tsx           # Cronograma veredal y seguimiento de rutas
    │   ├── CamionesView.tsx        # Ficha técnica y telemetría de la flota
    │   ├── ReportesView.tsx        # Análisis de impacto ambiental y exportación
    │   └── Navbar.tsx              # Barra de navegación principal y selector de perfil
    │
    └── components/          # 🧩 COMPONENTES REUTILIZABLES Y MODALES
        ├── PurificacionMap.tsx         # Mapa vectorial interactivo de Purificación en vivo
        ├── NewRouteModal.tsx           # Modal para programar nueva ruta veredal
        ├── NewCollectionModal.tsx      # Modal para registrar pesaje en báscula
        ├── NewTruckModal.tsx           # Modal para registrar nuevo camión
        ├── ReportIncidentModal.tsx     # Modal para denunciar quemas o basureros ilegales
        └── RuralRecyclingGuideModal.tsx # Guía pedagógica de reciclaje y abono orgánico
```

---

## 7. Configuración Global y Parámetros del Sistema

### 1. Paleta de Colores Institucional
La interfaz implementa los colores oficiales del ecosistema rural de Purificación:
- **Verde Bosque (`#14532d` / `#166534`)**: Representa la riqueza agrícola y reservas naturales.
- **Verde Esmeralda (`#10b981` / `#059669`)**: Utilizado en acciones positivas, reciclaje y estados operativos.
- **Azul Río Magdalena (`#0284c7`)**: Para telemetría de camiones y preservación de fuentes hídricas.
- **Amarillo Mostaza (`#ca8a04`)**: Alertas comunitarias y prevención de quemas de basura.
- **Blanco Puro y Neutros Cálidos**: Para contraste óptimo en pantallas de campo bajo la luz solar.

### 2. Puerto de Red
Por defecto, la aplicación se ejecuta en el puerto **`3000`** con host abierto (`0.0.0.0`), garantizando compatibilidad con contenedores Docker, Cloud Run y redes locales.

### 3. Persistencia de Datos
La aplicación cuenta con sincronización reactiva bidireccional:
- Todos los cambios realizados en la interfaz (crear rutas, registrar pesajes, reportar incidentes) se guardan automáticamente en el almacenamiento local del navegador (`localStorage`).
- El botón **"Restablecer Datos"** en la barra superior permite restaurar la base de datos de demostración en cualquier momento.

---

## 8. Roles de Usuario y Accesos

El sistema cuenta con 3 perfiles diseñados para la dinámica del campo tolimense:

| Rol | Descripción y Permisos |
| :--- | :--- |
| **🌾 Habitante Rural / Líder Comunitario** | Consulta las fechas y horas exactas en que el camión pasa por su vereda. Puede reportar quemas a cielo abierto, basureros satélites y consultar la guía de separación en finca y compostaje. |
| **🚛 Conductor / Operador de Cuadrilla** | Visualiza sus rutas asignadas, marca paradas completadas, registra el pesaje en báscula (toneladas de reciclaje vs. ordinarios) y actualiza el nivel de combustible de su camión. |
| **🏛️ Coordinador Municipal de Aseo** | Acceso total al sistema. Programa nuevas rutas, administra la flota vehicular, supervisa el mapa satelital en tiempo real y descarga informes oficiales en PDF y Excel para la Alcaldía. |

> **Nota de Prueba:** En la pantalla de inicio de sesión puedes hacer clic en los botones de **"Acceso Rápido de Prueba"** para ingresar inmediatamente con cualquiera de los tres roles sin escribir credenciales.

---

## 9. Módulos y Funcionalidades del Sistema

1. **Dashboard Principal**:
   - 4 Tarjetas de Métricas: Rutas Activas, Recolecciones de Hoy, Total Toneladas y Conductores Activos.
   - **Mapa Satelital de Purificación**: Visualización geográfica de veredas (*Chenche Asoleado, Las Damas, El Baura, El Tambo, Santa Lucía, El Tigre, Sabaneta, etc.*) con animación de recorrido de camiones en vivo.
   - Cronograma de próximas recolecciones con hora exacta de paso.
   - Gráfico de composición porcentual de residuos (Orgánicos 46%, Plásticos 22%, Cartón 12%, Vidrio 8%, Metales 5%, Ordinarios 7%).
   - Panel de Alertas Comunitarias para prevención de quemas.

2. **Módulo de Recolecciones y Pesaje**:
   - Registro de pesajes en báscula con desglose por tipo de material.
   - Cálculo automático del índice de eficiencia y recuperación ambiental.
   - Tabla histórica filtrable por vereda, camión y estado.

3. **Módulo de Rutas y Cronograma Veredal**:
   - Programación de rutas con fecha, horario matutino/vespertino y prioridad de residuo.
   - Control interactivo de paradas veredales (escuelas, centros de acopio y cruces).
   - Acciones para iniciar recorrido, editar o cancelar rutas.

4. **Módulo de Flota de Camiones**:
   - Ficha técnica completa: placa, modelo, año, capacidad máxima y kilometraje.
   - Telemetría en tiempo real: nivel de combustible, carga actual y conductor a cargo.
   - Gestión de estados operativos: *Disponible*, *En Servicio* o *En Mantenimiento*.

5. **Módulo de Reportes e Impacto Ambiental**:
   - Consolidado mensual de jornadas de aseo y toneladas recuperadas.
   - Contador de quemas de basura evitadas y protección del río Magdalena.
   - **Exportación en PDF Oficial**: Documento membretado con formato ejecutivo listo para impresión.
   - **Exportación en Excel / CSV**: Descarga instantánea de bases de datos para análisis.
   - **Guía de Aseo y Reciclaje Rural**: Manual interactivo de compostaje, abono y triple lavado de envases agroquímicos.

---

## 10. Scripts Disponibles

En el archivo `package.json` dispones de los siguientes comandos:

```bash
# Iniciar el servidor de desarrollo local
npm run dev

# Validar tipos y sintaxis TypeScript sin compilar
npm run lint

# Compilar y empaquetar la aplicación para producción (carpeta /dist)
npm run build

# Previsualizar localmente la versión compilada de producción
npm run preview

# Limpiar archivos temporales de compilación
npm run clean
```

---

## 11. Compilación y Despliegue en Producción

Para desplegar la aplicación en un servidor web o servicio en la nube:

### Paso 1: Generar la compilación optimizada
```bash
npm run build
```
Este comando generará la carpeta **`dist/`** con todos los archivos estáticos HTML, CSS y JavaScript minificados.

### Paso 2: Opciones de Alojamiento
- **Vercel / Netlify**: Conecta tu repositorio de GitHub, selecciona el framework *Vite*, comando de build `npm run build` y directorio de salida `dist`.
- **Google Cloud Run / Docker**: El contenedor ejecutará automáticamente la construcción y servirá la aplicación en el puerto 3000.
- **Servidores VPS (Apache / Nginx)**: Copia el contenido de la carpeta `dist/` al directorio público de tu servidor web (por ejemplo `/var/www/html/`).

---

## 12. Preguntas Frecuentes y Solución de Problemas

### 1. El comando `npm run dev` indica que el puerto 3000 ya está en uso
- Cierra el proceso que esté utilizando el puerto 3000, o
- Puedes especificar otro puerto temporalmente en la terminal:
  ```bash
  npx vite --port 3001
  ```

### 2. Error al importar los scripts de la base de datos MySQL
- Asegúrate de que el servicio de MySQL esté iniciado (en XAMPP verifica que el módulo MySQL esté en verde).
- Si usas `init_database.sql`, el script crea la base de datos `ecorural_purificacion` automáticamente. Si usas `schema.sql` individualmente, crea primero la base de datos con:
  ```sql
  CREATE DATABASE ecorural_purificacion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

### 3. ¿Cómo restablezco los datos de demostración en la interfaz?
- Haz clic en el botón **"Restablecer Datos"** ubicado en la esquina superior derecha de la barra de navegación. Esto limpiará el almacenamiento local y cargará la configuración veredal predeterminada.

---

### 🌾 Eco-Rural Purificación
*Compromiso ambiental, protección de fuentes hídricas y aseo digno para el campo tolimense.*
