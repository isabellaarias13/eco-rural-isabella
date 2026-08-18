-- =============================================================================
-- SISTEMA DE GESTIÓN DE BASURA Y ASEO RURAL: "ECO-RURAL"
-- MUNICIPIO: PURIFICACIÓN, TOLIMA - COLOMBIA
-- SCRIPT: Definición de Esquema y Tablas (DDL) para MySQL 8.0+ / MariaDB 10.4+
-- MOTOR: InnoDB | CHARSET: utf8mb4 | COLLATION: utf8mb4_unicode_ci
-- =============================================================================

-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS `ecorural_purificacion`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `ecorural_purificacion`;

-- Desactivar temporalmente verificación de claves foráneas para recreación segura
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 2. ELIMINACIÓN DE TABLAS PREVIAS (SI EXISTEN)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `app_notifications`;
DROP TABLE IF EXISTS `incident_alerts`;
DROP TABLE IF EXISTS `collection_records`;
DROP TABLE IF EXISTS `route_stops`;
DROP TABLE IF EXISTS `rural_routes`;
DROP TABLE IF EXISTS `trucks`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `veredas`;
DROP TABLE IF EXISTS `material_categories`;
DROP TABLE IF EXISTS `monthly_stats`;

-- -----------------------------------------------------------------------------
-- 3. TABLA: veredas (Veredas y Sectores Rurales de Purificación)
-- -----------------------------------------------------------------------------
CREATE TABLE `veredas` (
  `id` VARCHAR(60) NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT 'Nombre de la vereda (ej. Chenche Asoleado, Las Damas, etc.)',
  `zone` VARCHAR(80) NOT NULL COMMENT 'Sector geográfico (Norte, Oriental, Occidental, Sur, etc.)',
  `distance_km_from_center` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Distancia en km desde la cabecera municipal',
  `households_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Número estimado de viviendas/fincas',
  `population_estimate` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Población estimada',
  `critical_points_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Puntos de riesgo o basureros no autorizados detectados',
  `map_coord_x` INT NOT NULL DEFAULT 0 COMMENT 'Coordenada X en mapa interactivo',
  `map_coord_y` INT NOT NULL DEFAULT 0 COMMENT 'Coordenada Y en mapa interactivo',
  `latitude` DECIMAL(10,6) NOT NULL DEFAULT 3.858000 COMMENT 'Latitud GPS',
  `longitude` DECIMAL(10,6) NOT NULL DEFAULT -74.931000 COMMENT 'Longitud GPS',
  `main_activity` VARCHAR(255) NULL COMMENT 'Vocación productiva predominante (Arroz, Ganadería, etc.)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vereda_name` (`name`),
  INDEX `idx_vereda_zone` (`zone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de veredas del municipio de Purificación';

-- -----------------------------------------------------------------------------
-- 4. TABLA: users (Usuarios: Campesinos, Conductores y Coordinadores)
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(60) NOT NULL,
  `name` VARCHAR(150) NOT NULL COMMENT 'Nombre completo del usuario',
  `email` VARCHAR(150) NOT NULL COMMENT 'Correo electrónico',
  `password_hash` VARCHAR(255) NULL COMMENT 'Contraseña encriptada (bcrypt / argon2)',
  `document_id` VARCHAR(30) NOT NULL COMMENT 'Cédula de Ciudadanía o Documento',
  `vereda_id` VARCHAR(60) NULL COMMENT 'Vereda donde reside o labora',
  `phone` VARCHAR(30) NOT NULL COMMENT 'Número celular de contacto',
  `role` ENUM('habitante', 'conductor', 'coordinador', 'administrador') NOT NULL DEFAULT 'habitante' COMMENT 'Rol en el sistema',
  `avatar_url` VARCHAR(500) NULL COMMENT 'Enlace de foto de perfil',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Activo, 0 = Inactivo',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_email` (`email`),
  UNIQUE KEY `uk_user_document` (`document_id`),
  INDEX `idx_user_role` (`role`),
  INDEX `idx_user_vereda` (`vereda_id`),
  CONSTRAINT `fk_users_vereda` FOREIGN KEY (`vereda_id`) 
    REFERENCES `veredas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Usuarios y roles del sistema Eco-Rural';

-- -----------------------------------------------------------------------------
-- 5. TABLA: trucks (Flota de Camiones Recolectores)
-- -----------------------------------------------------------------------------
CREATE TABLE `trucks` (
  `id` VARCHAR(60) NOT NULL,
  `number` VARCHAR(30) NOT NULL COMMENT 'Código interno del vehículo (ej. CAM-01)',
  `plate` VARCHAR(15) NOT NULL COMMENT 'Placa oficial colombiana (ej. WTK-842)',
  `model` VARCHAR(120) NOT NULL COMMENT 'Marca y modelo comercial',
  `year` SMALLINT UNSIGNED NOT NULL DEFAULT 2023 COMMENT 'Año del modelo',
  `capacity_tons` DECIMAL(5,2) NOT NULL DEFAULT 5.00 COMMENT 'Capacidad máxima de carga en toneladas',
  `current_load_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Carga actual en toneladas',
  `driver_id` VARCHAR(60) NULL COMMENT 'Conductor habitual asignado',
  `driver_name` VARCHAR(150) NULL COMMENT 'Nombre del conductor en turno',
  `driver_phone` VARCHAR(30) NULL COMMENT 'Teléfono de contacto del conductor',
  `status` ENUM('disponible', 'en_servicio', 'mantenimiento') NOT NULL DEFAULT 'disponible',
  `last_maintenance_date` DATE NULL COMMENT 'Fecha de última revisión técnica/preventiva',
  `mileage_km` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Kilometraje acumulado',
  `fuel_level_percent` TINYINT UNSIGNED NOT NULL DEFAULT 100 COMMENT 'Nivel de combustible (0 a 100%)',
  `current_vereda` VARCHAR(100) NULL COMMENT 'Ubicación actual o última vereda reportada',
  `service_zone` VARCHAR(80) NOT NULL DEFAULT 'General' COMMENT 'Zona veredal asignada',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_truck_number` (`number`),
  UNIQUE KEY `uk_truck_plate` (`plate`),
  INDEX `idx_truck_status` (`status`),
  INDEX `idx_truck_driver` (`driver_id`),
  CONSTRAINT `fk_trucks_driver` FOREIGN KEY (`driver_id`) 
    REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Inventario y telemetría de camiones de aseo rural';

-- -----------------------------------------------------------------------------
-- 6. TABLA: rural_routes (Programación y Control de Rutas Veredales)
-- -----------------------------------------------------------------------------
CREATE TABLE `rural_routes` (
  `id` VARCHAR(60) NOT NULL,
  `code` VARCHAR(50) NOT NULL COMMENT 'Código de ruta (ej. RUTA-NORTE-01)',
  `vereda_id` VARCHAR(60) NOT NULL COMMENT 'Vereda destino o principal',
  `vereda_name` VARCHAR(100) NOT NULL COMMENT 'Nombre de la vereda',
  `scheduled_date` DATE NOT NULL COMMENT 'Fecha programada de recolección',
  `start_time` VARCHAR(20) NOT NULL COMMENT 'Hora de inicio programada (ej. 06:30 AM)',
  `estimated_end_time` VARCHAR(20) NOT NULL COMMENT 'Hora estimada de finalización (ej. 11:45 AM)',
  `truck_id` VARCHAR(60) NOT NULL COMMENT 'Camión asignado',
  `truck_number` VARCHAR(30) NOT NULL,
  `truck_plate` VARCHAR(15) NOT NULL,
  `driver_id` VARCHAR(60) NULL COMMENT 'Conductor a cargo',
  `driver_name` VARCHAR(150) NOT NULL,
  `driver_phone` VARCHAR(30) NULL,
  `status` ENUM('programada', 'en_progreso', 'completada', 'cancelada', 'reprogramada') NOT NULL DEFAULT 'programada',
  `estimated_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas estimadas a recolectar',
  `collected_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas reales recolectadas',
  `recycled_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas clasificadas para reciclaje/compostaje',
  `efficiency_percent` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Porcentaje de efectividad',
  `waste_type_priority` ENUM('Mixto Rural', 'Orgánico Agropecuario', 'Aprovechables Secos', 'Ordinarios') NOT NULL DEFAULT 'Mixto Rural',
  `notes` TEXT NULL COMMENT 'Observaciones técnicas o climáticas',
  `incidents_reported` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Cantidad de incidentes en la ruta',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_route_code` (`code`),
  INDEX `idx_route_date` (`scheduled_date`),
  INDEX `idx_route_status` (`status`),
  INDEX `idx_route_vereda` (`vereda_id`),
  INDEX `idx_route_truck` (`truck_id`),
  CONSTRAINT `fk_routes_vereda` FOREIGN KEY (`vereda_id`) 
    REFERENCES `veredas` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_routes_truck` FOREIGN KEY (`truck_id`) 
    REFERENCES `trucks` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cronograma y ejecución de rutas de aseo';

-- -----------------------------------------------------------------------------
-- 7. TABLA: route_stops (Puntos de Control / Paradas de cada Ruta)
-- -----------------------------------------------------------------------------
CREATE TABLE `route_stops` (
  `id` VARCHAR(60) NOT NULL,
  `route_id` VARCHAR(60) NOT NULL COMMENT 'Ruta a la que pertenece la parada',
  `stop_order` SMALLINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Orden secuencial de la parada',
  `name` VARCHAR(150) NOT NULL COMMENT 'Nombre del punto de acopio / finca / escuela',
  `time_est` VARCHAR(20) NOT NULL COMMENT 'Hora estimada de paso (ej. 07:30 AM)',
  `completed` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Completado, 0 = Pendiente',
  `notes` VARCHAR(255) NULL COMMENT 'Observaciones del conductor en la parada',
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_stops_route` (`route_id`),
  INDEX `idx_stops_order` (`route_id`, `stop_order`),
  CONSTRAINT `fk_stops_route` FOREIGN KEY (`route_id`) 
    REFERENCES `rural_routes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Puntos de acopio y paradas por ruta';

-- -----------------------------------------------------------------------------
-- 8. TABLA: collection_records (Historial de Pesajes y Recolecciones)
-- -----------------------------------------------------------------------------
CREATE TABLE `collection_records` (
  `id` VARCHAR(60) NOT NULL,
  `code` VARCHAR(50) NOT NULL COMMENT 'Código único del pesaje (ej. REC-2026-0818-01)',
  `route_id` VARCHAR(60) NULL COMMENT 'Ruta vinculada si aplica',
  `vereda_name` VARCHAR(100) NOT NULL COMMENT 'Vereda atendida',
  `date` DATE NOT NULL COMMENT 'Fecha de pesaje',
  `time` VARCHAR(20) NOT NULL COMMENT 'Hora de registro en báscula',
  `truck_number` VARCHAR(30) NOT NULL,
  `truck_plate` VARCHAR(15) NOT NULL,
  `driver_name` VARCHAR(150) NOT NULL,
  `organic_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas de materia orgánica para abono',
  `plastic_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas de plástico y botellas PET',
  `glass_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas de vidrio',
  `cardboard_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas de cartón y papel',
  `metal_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas de metales y chatarra menor',
  `ordinary_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Toneladas de desechos ordinarios a celda',
  `total_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Peso bruto total en toneladas',
  `recycled_tons` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Suma de aprovechables (orgánico + reciclaje)',
  `efficiency_percent` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Tasa de recuperación (%)',
  `status` ENUM('completado', 'en_curso', 'pendiente', 'reprogramado') NOT NULL DEFAULT 'completado',
  `notes` TEXT NULL COMMENT 'Anotaciones del pesaje',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_collection_code` (`code`),
  INDEX `idx_col_date` (`date`),
  INDEX `idx_col_vereda` (`vereda_name`),
  INDEX `idx_col_truck` (`truck_number`),
  CONSTRAINT `fk_collections_route` FOREIGN KEY (`route_id`) 
    REFERENCES `rural_routes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registros de pesaje en báscula de transferencia';

-- -----------------------------------------------------------------------------
-- 9. TABLA: incident_alerts (Alertas de Quemas, Vías y Malos Olores)
-- -----------------------------------------------------------------------------
CREATE TABLE `incident_alerts` (
  `id` VARCHAR(60) NOT NULL,
  `title` VARCHAR(200) NOT NULL COMMENT 'Título resumen del reporte',
  `type` ENUM(
    'quema_basura', 
    'via_bloqueada', 
    'basurero_ilegal', 
    'olor_fuerte', 
    'animales_riesgo', 
    'camion_varado', 
    'otro'
  ) NOT NULL DEFAULT 'quema_basura',
  `vereda_name` VARCHAR(100) NOT NULL COMMENT 'Vereda donde ocurre el evento',
  `date` DATE NOT NULL,
  `time` VARCHAR(20) NOT NULL,
  `reported_by` VARCHAR(150) NOT NULL COMMENT 'Nombre del campesino o líder que reporta',
  `reporter_phone` VARCHAR(30) NULL COMMENT 'Teléfono de contacto para verificar',
  `status` ENUM('critica', 'atendida', 'en_revision') NOT NULL DEFAULT 'en_revision',
  `severity` ENUM('alta', 'media', 'baja') NOT NULL DEFAULT 'media',
  `description` TEXT NOT NULL COMMENT 'Detalles del incidente',
  `prevented_burning` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Se evitó quema a cielo abierto',
  `action_taken` TEXT NULL COMMENT 'Acción correctiva realizada por la cuadrilla',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_incident_type` (`type`),
  INDEX `idx_incident_status` (`status`),
  INDEX `idx_incident_date` (`date`),
  INDEX `idx_incident_vereda` (`vereda_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Alertas comunitarias y prevención de quemas ilegales';

-- -----------------------------------------------------------------------------
-- 10. TABLA: app_notifications (Notificaciones del Sistema)
-- -----------------------------------------------------------------------------
CREATE TABLE `app_notifications` (
  `id` VARCHAR(60) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp_text` VARCHAR(50) NOT NULL COMMENT 'Texto amigable (ej. Hace 8 minutos)',
  `type` ENUM('alerta', 'ruta', 'camion', 'comunidad', 'exito') NOT NULL DEFAULT 'comunidad',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `vereda` VARCHAR(100) NULL,
  `link_tab` VARCHAR(50) NULL COMMENT 'Pestaña a la que redirige (rutas, camiones, etc.)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_notif_read` (`is_read`),
  INDEX `idx_notif_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Centro de notificaciones y avisos comunitarios';

-- -----------------------------------------------------------------------------
-- 11. TABLA: material_categories (Composición y Metas de Reciclaje)
-- -----------------------------------------------------------------------------
CREATE TABLE `material_categories` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `tons` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  `color_hex` VARCHAR(10) NOT NULL DEFAULT '#16a34a',
  `description` TEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_material_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Categorías de materiales reciclables y compostables';

-- -----------------------------------------------------------------------------
-- 12. TABLA: monthly_stats (Consolidado Histórico Mensual de Purificación)
-- -----------------------------------------------------------------------------
CREATE TABLE `monthly_stats` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `year` SMALLINT UNSIGNED NOT NULL DEFAULT 2026,
  `month_number` TINYINT UNSIGNED NOT NULL COMMENT '1 = Enero, 12 = Diciembre',
  `month_name` VARCHAR(40) NOT NULL,
  `collections_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_tons` DECIMAL(7,2) NOT NULL DEFAULT 0.00,
  `recycled_tons` DECIMAL(7,2) NOT NULL DEFAULT 0.00,
  `organic_tons` DECIMAL(7,2) NOT NULL DEFAULT 0.00,
  `efficiency_percent` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `burnings_prevented` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_year_month` (`year`, `month_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Métricas mensuales de aseo e impacto ambiental';

-- -----------------------------------------------------------------------------
-- 13. VISTAS SQL ÚTILES (Para Reportes y Cuadros de Mando)
-- -----------------------------------------------------------------------------

-- Vista 1: Resumen de Eficiencia por Vereda
CREATE OR REPLACE VIEW `vw_resumen_por_vereda` AS
SELECT 
  v.id AS vereda_id,
  v.name AS vereda_name,
  v.zone AS sector,
  v.households_count AS viviendas,
  COUNT(c.id) AS total_jornadas_recoleccion,
  COALESCE(SUM(c.total_tons), 0.00) AS total_toneladas_recolectadas,
  COALESCE(SUM(c.recycled_tons), 0.00) AS total_toneladas_recicladas,
  COALESCE(SUM(c.organic_tons), 0.00) AS total_organico_compostaje,
  CASE 
    WHEN SUM(c.total_tons) > 0 THEN 
      ROUND((SUM(c.recycled_tons) / SUM(c.total_tons)) * 100, 2)
    ELSE 0.00 
  END AS tasa_recuperacion_porcentaje
FROM `veredas` v
LEFT JOIN `collection_records` c ON v.name = c.vereda_name
GROUP BY v.id, v.name, v.zone, v.households_count;

-- Vista 2: Estado y Rendimiento Actual de la Flota
CREATE OR REPLACE VIEW `vw_estado_flota_actual` AS
SELECT 
  t.number AS camion,
  t.plate AS placa,
  t.model AS modelo,
  t.capacity_tons AS capacidad_max_ton,
  t.current_load_tons AS carga_actual_ton,
  ROUND((t.current_load_tons / t.capacity_tons) * 100, 1) AS porcentaje_ocupacion,
  t.status AS estado_operativo,
  t.fuel_level_percent AS nivel_combustible_pct,
  t.current_vereda AS ubicacion_actual,
  t.driver_name AS conductor_asignado,
  t.driver_phone AS telefono_conductor,
  t.mileage_km AS kilometraje
FROM `trucks` t;

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
