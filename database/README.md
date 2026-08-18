# 🗄️ Base de Datos MySQL — Eco-Rural (Purificación, Tolima)

Este directorio contiene los scripts SQL completos y optimizados para crear, estructurar y poblar la base de datos relacional del sistema **Eco-Rural** en **MySQL (5.7+ / 8.0+)** o **MariaDB (10.3+)**.

---

## 📁 Archivos Disponibles en esta Carpeta

| Archivo | Propósito |
| :--- | :--- |
| **`init_database.sql`** | **Script Completo Unificado** (Recomendado). Crea la base de datos `ecorural_purificacion`, las 8 tablas con sus restricciones y claves foráneas, 2 vistas analíticas y todos los datos iniciales de prueba de Purificación. |
| **`schema.sql`** | Contiene únicamente la definición de la estructura (DDL): creación de base de datos, tablas, índices, claves foráneas y vistas. |
| **`seed.sql`** | Contiene las sentencias `INSERT INTO` (DML) para poblar las veredas de Purificación, usuarios con diferentes roles, camiones de la flota, rutas programadas, registros de pesaje, incidentes y estadísticas históricas. |

---

## 🚀 Guía de Instalación y Ejecución

Puedes importar la base de datos usando cualquiera de las siguientes herramientas:

### Opción 1: Desde la Terminal / Consola de MySQL (Recomendado)

1. Abre tu terminal o consola de comandos.
2. Navega a la raíz del proyecto o a la carpeta `database`:
   ```bash
   cd ruta/hacia/tu-proyecto/database
   ```
3. Ejecuta el script unificado con tu usuario de MySQL (reemplaza `root` por tu usuario):
   ```bash
   mysql -u root -p < init_database.sql
   ```
4. Ingresa tu contraseña de MySQL y presiona **Enter**. ¡Listo!

---

### Opción 2: Usando MySQL Workbench

1. Abre **MySQL Workbench** y conéctate a tu servidor local o remoto.
2. En el menú superior, selecciona **File** > **Open SQL Script...** (o presiona `Ctrl + Shift + O` / `Cmd + Shift + O`).
3. Selecciona el archivo `database/init_database.sql`.
4. Haz clic en el ícono del rayo ⚡ (**Execute**) para ejecutar todo el script.
5. En el panel izquierdo de esquemas (**Schemas**), haz clic derecho y selecciona **Refresh All**; verás la base de datos `ecorural_purificacion` con todas sus tablas y vistas.

---

### Opción 3: Usando phpMyAdmin (XAMPP / WampServer / Laragon)

1. Inicia tu servidor Apache y MySQL en XAMPP o WAMP.
2. Abre tu navegador e ingresa a `http://localhost/phpmyadmin`.
3. Haz clic en la pestaña **Importar** (Import) en la barra superior.
4. En la sección **Archivo a importar**, haz clic en **Seleccionar archivo** y escoge `database/init_database.sql`.
5. En el conjunto de caracteres verifica que esté en `utf-8`.
6. Desplázate al final y presiona el botón **Importar** (o **Continuar**).
7. Verás el mensaje en verde indicando que todas las consultas se ejecutaron correctamente.

---

### Opción 4: Usando DBeaver o DataGrip

1. Conéctate a tu servidor MySQL.
2. Abre un nuevo **SQL Editor**.
3. Copia y pega el contenido de `init_database.sql` o ábrelo directamente.
4. Presiona `Ctrl + Alt + X` (Execute SQL Script).

---

## 📊 Estructura de las Tablas (Modelo Relacional)

La base de datos `ecorural_purificacion` cuenta con las siguientes tablas:

1. **`veredas`**: Catálogo de las 15 veredas principales de Purificación (*Chenche Asoleado, Las Damas, El Baura, El Tambo, Santa Lucía, Sabaneta, Remolino, etc.*), con sus coordenadas GPS, número de viviendas y actividad económica.
2. **`users`**: Usuarios campesinos, conductores de cuadrilla y coordinadores municipales de aseo, con vinculación a su respectiva vereda.
3. **`trucks`**: Inventario de camiones recolectores (placa, modelo, capacidad en toneladas, conductor asignado, estado operativo y telemetría de combustible).
4. **`rural_routes`**: Cronograma y programación de rutas veredales, fechas, horas de salida y tipo de residuo priorizado.
5. **`route_stops`**: Puntos de acopio, escuelas y cruces veredales que componen cada ruta.
6. **`collection_records`**: Registros de pesaje en báscula (toneladas de orgánico, plástico, vidrio, cartón, metal y ordinarios).
7. **`incident_alerts`**: Reportes comunitarios sobre quemas de basura a cielo abierto, vías bloqueadas o basureros ilegales.
8. **`app_notifications`**: Historial de avisos en tiempo real para la comunidad rural y conductores.
9. **`material_categories`**: Clasificación porcentual de materiales para compostaje y economía circular.
10. **`monthly_stats`**: Consolidado histórico mensual de toneladas y quemas evitadas en el Tolima.

---

## 🔍 Consultas SQL Útiles de Ejemplo

### 1. Consultar el total de toneladas recolectadas y recicladas por vereda:
```sql
SELECT 
  vereda_name,
  COUNT(id) AS total_jornadas,
  SUM(total_tons) AS total_toneladas,
  SUM(recycled_tons) AS toneladas_recicladas,
  SUM(organic_tons) AS abono_organico_ton
FROM collection_records
GROUP BY vereda_name
ORDER BY total_toneladas DESC;
```

### 2. Ver las alertas críticas de quema de basura activas:
```sql
SELECT 
  id, 
  title, 
  vereda_name, 
  reported_by, 
  reporter_phone, 
  severity, 
  status 
FROM incident_alerts
WHERE type = 'quema_basura' AND status != 'atendida'
ORDER BY date DESC, time DESC;
```

### 3. Consultar el estado y combustible actual de la flota de camiones:
```sql
SELECT * FROM vw_estado_flota_actual;
```

### 4. Consultar las rutas programadas para el día de hoy con sus conductores:
```sql
SELECT 
  r.code, 
  r.vereda_name, 
  r.scheduled_date, 
  r.start_time, 
  r.truck_number, 
  r.truck_plate, 
  r.driver_name, 
  r.status
FROM rural_routes r
WHERE r.scheduled_date = CURDATE()
ORDER BY r.start_time ASC;
```
