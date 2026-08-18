-- =============================================================================
-- SISTEMA DE GESTIÓN DE BASURA Y ASEO RURAL: "ECO-RURAL"
-- MUNICIPIO: PURIFICACIÓN, TOLIMA - COLOMBIA
-- SCRIPT: Datos Iniciales de Prueba y Catálogos (DML / Seed)
-- =============================================================================

USE `ecorural_purificacion`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. POBLAR VEREDAS DE PURIFICACIÓN, TOLIMA
-- -----------------------------------------------------------------------------
INSERT INTO `veredas` 
  (`id`, `name`, `zone`, `distance_km_from_center`, `households_count`, `population_estimate`, `critical_points_count`, `map_coord_x`, `map_coord_y`, `latitude`, `longitude`, `main_activity`)
VALUES
  ('vereda-chenche-asoleado', 'Chenche Asoleado', 'Sector Norte', 14.50, 185, 620, 2, 180, 120, 3.895000, -74.960000, 'Cultivos de arroz y cítricos'),
  ('vereda-chenche-1', 'Chenche 1', 'Sector Norte', 12.00, 140, 490, 1, 230, 140, 3.882000, -74.945000, 'Ganadería y agricultura mixta'),
  ('vereda-chenche-2', 'Chenche 2', 'Sector Norte', 15.80, 160, 540, 2, 280, 110, 3.901000, -74.930000, 'Cacao y frutales'),
  ('vereda-chenche-3', 'Chenche 3', 'Sector Norte', 18.20, 125, 430, 1, 330, 90, 3.918000, -74.915000, 'Cultivo de maíz y plátano'),
  ('vereda-las-damas', 'Las Damas', 'Sector Oriental', 9.40, 210, 750, 1, 420, 180, 3.865000, -74.890000, 'Comercio rural y arroz'),
  ('vereda-la-mata', 'La Mata', 'Sector Oriental', 11.20, 155, 510, 2, 450, 240, 3.842000, -74.875000, 'Ganadería doble propósito'),
  ('vereda-el-baura', 'El Baura', 'Sector Sur', 16.00, 195, 680, 3, 370, 340, 3.795000, -74.910000, 'Pesca artesanal y arroz'),
  ('vereda-el-tambo', 'El Tambo', 'Sector Occidental', 8.50, 240, 830, 1, 160, 260, 3.835000, -74.975000, 'Artesanías y producción porcícola'),
  ('vereda-santa-lucia-1', 'Santa Lucía 1', 'Sector Occidental', 13.10, 170, 590, 1, 110, 220, 3.850000, -74.995000, 'Mango y frutales'),
  ('vereda-santa-lucia-2', 'Santa Lucía 2', 'Sector Occidental', 15.60, 130, 450, 2, 80, 180, 3.868000, -75.010000, 'Ganadería extensiva'),
  ('vereda-el-tigre', 'El Tigre', 'Sector Sur-Occidental', 19.40, 110, 390, 2, 120, 350, 3.785000, -74.985000, 'Reserva forestal y cultivos tradicionales'),
  ('vereda-sabaneta', 'Sabaneta', 'Sector Centro-Sur', 6.20, 275, 960, 1, 270, 270, 3.828000, -74.935000, 'Horticultura y avicultura'),
  ('vereda-remolino', 'Remolino', 'Ribera del Río Magdalena', 7.80, 180, 610, 2, 340, 220, 3.848000, -74.912000, 'Turismo ecológico y pesca'),
  ('vereda-campo-alegre', 'Campo Alegre', 'Sector Sur-Oriental', 17.50, 145, 510, 1, 440, 320, 3.805000, -74.880000, 'Caña panelera y ganadería'),
  ('vereda-buenavista', 'Buenavista', 'Sector Alto / Mirador', 10.90, 165, 580, 1, 220, 340, 3.801000, -74.952000, 'Café de ladera y plátano');

-- -----------------------------------------------------------------------------
-- 2. POBLAR USUARIOS DEL SISTEMA
-- -----------------------------------------------------------------------------
INSERT INTO `users` 
  (`id`, `name`, `email`, `password_hash`, `document_id`, `vereda_id`, `phone`, `role`, `avatar_url`)
VALUES
  ('usr-1', 'Carlos Andrés Morales', 'coordinador@ecorural-purificacion.gov.co', '$2y$10$e8wF45hZ1e0wJg.MockHashPassPurificacion1', '93.382.410', NULL, '312 458 9021', 'coordinador', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
  ('usr-2', 'Don Jairo Benítez', 'jairo.conductor@ecorural.co', '$2y$10$e8wF45hZ1e0wJg.MockHashPassPurificacion2', '14.280.993', 'vereda-sabaneta', '315 882 1044', 'conductor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
  ('usr-3', 'María Esperanza Guzmán', 'esperanza.guzman@purificacion-rural.org', '$2y$10$e8wF45hZ1e0wJg.MockHashPassPurificacion3', '65.742.118', 'vereda-chenche-asoleado', '320 671 4490', 'habitante', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'),
  ('drv-2', 'Héctor Fabio Lozano', 'hector.lozano@ecorural.co', '$2y$10$e8wF45hZ1e0wJg.MockHashPassPurificacion4', '14.295.882', 'vereda-las-damas', '311 904 5532', 'conductor', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
  ('drv-3', 'Ramiro Alfonso Varón', 'ramiro.varon@ecorural.co', '$2y$10$e8wF45hZ1e0wJg.MockHashPassPurificacion5', '93.411.029', 'vereda-el-tambo', '314 233 8761', 'conductor', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'),
  ('drv-4', 'Albeiro Castro Ortiz', 'albeiro.castro@ecorural.co', '$2y$10$e8wF45hZ1e0wJg.MockHashPassPurificacion6', '14.305.114', 'vereda-el-baura', '318 765 4321', 'conductor', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80');

-- -----------------------------------------------------------------------------
-- 3. POBLAR FLOTA DE CAMIONES
-- -----------------------------------------------------------------------------
INSERT INTO `trucks` 
  (`id`, `number`, `plate`, `model`, `year`, `capacity_tons`, `current_load_tons`, `driver_id`, `driver_name`, `driver_phone`, `status`, `last_maintenance_date`, `mileage_km`, `fuel_level_percent`, `current_vereda`, `service_zone`)
VALUES
  ('trk-1', 'CAM-01', 'WTK-842', 'Chevrolet FVR Compactador Rural', 2023, 8.50, 4.20, 'usr-2', 'Jairo Benítez', '315 882 1044', 'en_servicio', '2026-08-05', 48230, 78, 'Chenche Asoleado', 'Sector Norte'),
  ('trk-2', 'CAM-02', 'SMR-319', 'Hino Dutro 716 Recolector', 2022, 5.50, 3.80, 'drv-2', 'Héctor Fabio Lozano', '311 904 5532', 'en_servicio', '2026-08-10', 62100, 62, 'Las Damas', 'Sector Oriental'),
  ('trk-3', 'CAM-03', 'TLM-704', 'Isuzu NPR 4x4 Todo Terreno', 2024, 4.50, 0.00, 'drv-3', 'Ramiro Alfonso Varón', '314 233 8761', 'disponible', '2026-08-12', 35400, 95, 'Parque Central Base', 'Sector Occidental'),
  ('trk-4', 'CAM-04', 'PQX-512', 'Ford Cargo 815 Volqueta Adaptada', 2021, 6.00, 0.00, 'drv-4', 'Albeiro Castro Ortiz', '318 765 4321', 'mantenimiento', '2026-08-17', 89300, 30, 'Taller Municipal', 'Sector Sur');

-- -----------------------------------------------------------------------------
-- 4. POBLAR RUTAS RURALES
-- -----------------------------------------------------------------------------
INSERT INTO `rural_routes` 
  (`id`, `code`, `vereda_id`, `vereda_name`, `scheduled_date`, `start_time`, `estimated_end_time`, `truck_id`, `truck_number`, `truck_plate`, `driver_id`, `driver_name`, `driver_phone`, `status`, `estimated_tons`, `collected_tons`, `recycled_tons`, `efficiency_percent`, `waste_type_priority`, `notes`, `incidents_reported`)
VALUES
  ('rt-101', 'RUTA-NORTE-01', 'vereda-chenche-asoleado', 'Chenche Asoleado', '2026-08-18', '06:30 AM', '11:45 AM', 'trk-1', 'CAM-01', 'WTK-842', 'usr-2', 'Jairo Benítez', '315 882 1044', 'en_progreso', 4.80, 3.60, 1.40, 92.00, 'Aprovechables Secos', 'Priorizar recolección de empaques plásticos agrícolas limpios y evitar quemas en orillas de carretera.', 0),
  ('rt-102', 'RUTA-ORIENTE-02', 'vereda-las-damas', 'Las Damas', '2026-08-18', '07:00 AM', '12:30 PM', 'trk-2', 'CAM-02', 'SMR-319', 'drv-2', 'Héctor Fabio Lozano', '311 904 5532', 'en_progreso', 4.20, 2.90, 1.10, 88.00, 'Mixto Rural', 'Sector con alta producción de envases de vidrio y chatarra menor.', 1),
  ('rt-103', 'RUTA-SUR-03', 'vereda-el-baura', 'El Baura', '2026-08-19', '06:00 AM', '11:30 AM', 'trk-3', 'CAM-03', 'TLM-704', 'drv-3', 'Ramiro Alfonso Varón', '314 233 8761', 'programada', 3.90, 0.00, 0.00, 95.00, 'Orgánico Agropecuario', 'Jornada especial de compostaje y recolección de residuos orgánicos de cosechas.', 0),
  ('rt-104', 'RUTA-OCC-04', 'vereda-el-tambo', 'El Tambo', '2026-08-19', '01:00 PM', '05:30 PM', 'trk-1', 'CAM-01', 'WTK-842', 'usr-2', 'Jairo Benítez', '315 882 1044', 'programada', 5.10, 0.00, 0.00, 90.00, 'Mixto Rural', 'Paso por vereda Santa Lucía 1 y Santa Lucía 2 en la tarde.', 0),
  ('rt-105', 'RUTA-CENTRO-05', 'vereda-sabaneta', 'Sabaneta', '2026-08-17', '07:00 AM', '12:00 PM', 'trk-2', 'CAM-02', 'SMR-319', 'drv-2', 'Héctor Fabio Lozano', '311 904 5532', 'completada', 4.50, 4.60, 1.80, 96.00, 'Aprovechables Secos', 'Recolección exitosa, cero quema de basuras en la jornada.', 0);

-- -----------------------------------------------------------------------------
-- 5. POBLAR PARADAS DE LAS RUTAS
-- -----------------------------------------------------------------------------
INSERT INTO `route_stops` 
  (`id`, `route_id`, `stop_order`, `name`, `time_est`, `completed`, `notes`)
VALUES
  ('st-1', 'rt-101', 1, 'Entrada Puente Chenche', '06:45 AM', 1, 'Comunidad organizada con bolsas blancas'),
  ('st-2', 'rt-101', 2, 'Escuela Rural Chenche Asoleado', '07:30 AM', 1, 'Reciclaje de papel y plástico escolar'),
  ('st-3', 'rt-101', 3, 'Tienda Las Palmas (Cruce Chenche 1)', '08:45 AM', 1, 'Excelente separación'),
  ('st-4', 'rt-101', 4, 'Finca El Porvenir', '09:50 AM', 0, 'En camino'),
  ('st-5', 'rt-101', 5, 'Sector El Palmar', '11:15 AM', 0, NULL),
  ('st-6', 'rt-102', 1, 'Cruce Veredal Las Damas', '07:15 AM', 1, NULL),
  ('st-7', 'rt-102', 2, 'Centro Comunitario y Cancha', '08:30 AM', 1, NULL),
  ('st-8', 'rt-102', 3, 'Vereda La Mata - Punto Limpio', '10:15 AM', 0, NULL),
  ('st-9', 'rt-102', 4, 'Hacienda La Ceiba', '11:45 AM', 0, NULL),
  ('st-10', 'rt-103', 1, 'Muelle Fluvial El Baura', '06:20 AM', 0, NULL),
  ('st-11', 'rt-103', 2, 'Caserío Central', '07:45 AM', 0, NULL),
  ('st-12', 'rt-103', 3, 'Vereda Remolino Empalme', '09:30 AM', 0, NULL),
  ('st-13', 'rt-104', 1, 'Plaza El Tambo', '01:15 PM', 0, NULL),
  ('st-14', 'rt-104', 2, 'Vereda Santa Lucía 1 Centro', '02:40 PM', 0, NULL),
  ('st-15', 'rt-104', 3, 'Santa Lucía 2 Escuela', '04:10 PM', 0, NULL),
  ('st-16', 'rt-105', 1, 'Entrada Sabaneta', '07:15 AM', 1, NULL),
  ('st-17', 'rt-105', 2, 'Sector El Recreo', '08:45 AM', 1, NULL),
  ('st-18', 'rt-105', 3, 'Cruce Buenavista', '10:30 AM', 1, NULL);

-- -----------------------------------------------------------------------------
-- 6. POBLAR REGISTROS DE PESAJE Y RECOLECCIÓN
-- -----------------------------------------------------------------------------
INSERT INTO `collection_records` 
  (`id`, `code`, `route_id`, `vereda_name`, `date`, `time`, `truck_number`, `truck_plate`, `driver_name`, `organic_tons`, `plastic_tons`, `glass_tons`, `cardboard_tons`, `metal_tons`, `ordinary_tons`, `total_tons`, `recycled_tons`, `efficiency_percent`, `status`, `notes`)
VALUES
  ('col-001', 'REC-2026-0818-01', 'rt-101', 'Chenche Asoleado', '2026-08-18', '08:45 AM', 'CAM-01', 'WTK-842', 'Jairo Benítez', 1.60, 0.80, 0.30, 0.50, 0.20, 1.20, 4.60, 1.80, 94.00, 'en_curso', 'Sector agrícola comprometido con la separación. Cero bolsas arrojadas a quebradas.'),
  ('col-002', 'REC-2026-0818-02', 'rt-102', 'Las Damas', '2026-08-18', '09:20 AM', 'CAM-02', 'SMR-319', 'Héctor Fabio Lozano', 1.10, 0.60, 0.40, 0.30, 0.10, 1.00, 3.50, 1.40, 89.00, 'en_curso', 'Jornada activa. Vecinos entregaron chatarra de alambre y envases vacíos.'),
  ('col-003', 'REC-2026-0817-03', 'rt-105', 'Sabaneta', '2026-08-17', '11:30 AM', 'CAM-02', 'SMR-319', 'Héctor Fabio Lozano', 1.80, 0.90, 0.30, 0.40, 0.20, 1.00, 4.60, 1.80, 96.00, 'completado', 'Completada sin contratiempos en los tres puntos de acopio veredal.'),
  ('col-004', 'REC-2026-0816-04', NULL, 'El Tigre', '2026-08-16', '10:15 AM', 'CAM-03', 'TLM-704', 'Ramiro Alfonso Varón', 1.20, 0.50, 0.20, 0.30, 0.10, 0.90, 3.20, 1.10, 91.00, 'completado', 'Excelente respuesta en zona de reserva; fauna silvestre protegida.'),
  ('col-005', 'REC-2026-0815-05', NULL, 'Campo Alegre', '2026-08-15', '02:00 PM', 'CAM-01', 'WTK-842', 'Jairo Benítez', 2.10, 0.70, 0.20, 0.40, 0.30, 1.40, 5.10, 1.60, 93.00, 'completado', 'Recolección de bagazo y residuos orgánicos para abono en fincas.'),
  ('col-006', 'REC-2026-0814-06', NULL, 'Remolino', '2026-08-14', '08:30 AM', 'CAM-02', 'SMR-319', 'Héctor Fabio Lozano', 1.40, 0.80, 0.40, 0.50, 0.10, 0.80, 4.00, 1.80, 95.00, 'completado', 'Ribera del Magdalena limpia de plásticos y botellas.'),
  ('col-007', 'REC-2026-0813-07', NULL, 'Buenavista', '2026-08-13', '11:00 AM', 'CAM-03', 'TLM-704', 'Ramiro Alfonso Varón', 1.70, 0.60, 0.30, 0.40, 0.10, 0.90, 4.00, 1.40, 92.00, 'completado', 'Ruta de alta montaña completada con vehículo 4x4.');

-- -----------------------------------------------------------------------------
-- 7. POBLAR ALERTAS E INCIDENTES COMUNITARIOS
-- -----------------------------------------------------------------------------
INSERT INTO `incident_alerts` 
  (`id`, `title`, `type`, `vereda_name`, `date`, `time`, `reported_by`, `reporter_phone`, `status`, `severity`, `description`, `prevented_burning`, `action_taken`)
VALUES
  ('alt-01', 'Alerta Preventiva de Quema de Hojas y Plásticos', 'quema_basura', 'Chenche 2', '2026-08-18', '07:10 AM', 'Gustavo Adolfo Prado (Líder JAC)', '313 881 2290', 'atendida', 'alta', 'Vecino preparaba quema en lindero de potrero. El promotor ambiental intervino, se le explicó la ruta de recolección y se evitó emisión de humo tóxico.', 1, 'Material empacado para la ruta del jueves. Sensibilización comunitaria realizada.'),
  ('alt-02', 'Punto Crítico con Mal Olor y Presencia de Perros Callejeros', 'olor_fuerte', 'El Baura', '2026-08-17', '04:30 PM', 'Rosalba Cifuentes', '321 445 6701', 'en_revision', 'alta', 'Acumulación indebida de vísceras de pescado y residuos en la curva del río. Animales estaban rompiendo las bolsas generando malos olores.', 0, 'Se programó cuadrilla de aseo prioritaria y caneca comunitaria sellada.'),
  ('alt-03', 'Árbol caído y vía con paso restringido para camión', 'via_bloqueada', 'Santa Lucía 2', '2026-08-17', '02:15 PM', 'Nelson Méndez', '310 992 3314', 'critica', 'media', 'Rama de samán obstaculiza el paso de vehículos pesados en el km 4 del tramo veredal.', 0, 'Maquinaria de infraestructura alertada para despeje antes de la ruta matutina.'),
  ('alt-04', 'Reporte de Quema Clandestina Evitada', 'quema_basura', 'Las Damas', '2026-08-16', '09:00 AM', 'Comité de Convivencia Veredal', NULL, 'atendida', 'alta', 'Se evitó la quema de envases de agroquímicos usados. Se canalizaron al programa Campo Limpio de Purificación.', 1, 'Residuos entregados al centro de acopio seguro.');

-- -----------------------------------------------------------------------------
-- 8. POBLAR NOTIFICACIONES
-- -----------------------------------------------------------------------------
INSERT INTO `app_notifications` 
  (`id`, `title`, `message`, `timestamp_text`, `type`, `is_read`, `vereda`, `link_tab`)
VALUES
  ('notif-1', '¡Camión en tu sector!', 'El camión CAM-01 (WTK-842) conducido por Jairo Benítez acaba de ingresar a Chenche Asoleado.', 'Hace 8 minutos', 'camion', 0, 'Chenche Asoleado', 'recolecciones'),
  ('notif-2', 'Éxito Ambiental: Quema Evitada', 'Gracias al aviso comunitario se detuvo una quema de basuras en Chenche 2. Cuidamos el aire de Purificación.', 'Hace 45 minutos', 'exito', 0, 'Chenche 2', 'rutas'),
  ('notif-3', 'Próxima Ruta Programada Mañana', 'Mañana 19 de Agosto a las 06:00 AM inicia la recolección en El Baura y El Tambo.', 'Hace 2 horas', 'ruta', 1, 'El Baura', 'rutas'),
  ('notif-4', 'Mantenimiento Preventivo Concluido', 'El camión CAM-03 (TLM-704) superó la revisión tecnomecánica y ya está disponible para el servicio.', 'Hace 5 horas', 'camion', 1, NULL, 'camiones');

-- -----------------------------------------------------------------------------
-- 9. POBLAR CATEGORÍAS DE MATERIALES Y RECICLAJE RURAL
-- -----------------------------------------------------------------------------
INSERT INTO `material_categories` 
  (`name`, `category`, `percentage`, `tons`, `color_hex`, `description`)
VALUES
  ('Residuos Orgánicos para Compostaje', 'Orgánico Aprovechable', 46.00, 54.50, '#16a34a', 'Restos de cosechas, cáscaras, podas de fincas y residuos de cocina transformados en abono orgánico para Purificación.'),
  ('Plásticos y Envases Agrícolas Limpios', 'Reciclable Seco', 22.00, 26.10, '#0284c7', 'Botellas PET, plásticos rígidos, bolsas seleccionadas y envases no tóxicos lavados.'),
  ('Cartón, Papel y Empaques', 'Reciclable Celulósico', 12.00, 14.20, '#ca8a04', 'Cajas de embalaje rural, panelería, periódicos y empaques secos.'),
  ('Vidrio y Botellas', 'Reciclable Inerte', 8.00, 9.50, '#0d9488', 'Envases de bebidas, frascos de conservas y botellas retornables.'),
  ('Metales y Chatarra Menor', 'Reciclable Metálico', 5.00, 5.90, '#64748b', 'Alambres de cerca, latas de alimentos, chatarra agrícola recuperable.'),
  ('Residuos Ordinarios No Aprovechables', 'Disposición Final', 7.00, 8.40, '#dc2626', 'Papel higiénico, servilletas usadas, pañales y residuos no recuperables llevados a celda sanitaria.');

-- -----------------------------------------------------------------------------
-- 10. POBLAR HISTÓRICO MENSUAL DE PURIFICACIÓN
-- -----------------------------------------------------------------------------
INSERT INTO `monthly_stats` 
  (`year`, `month_number`, `month_name`, `collections_count`, `total_tons`, `recycled_tons`, `organic_tons`, `efficiency_percent`, `burnings_prevented`)
VALUES
  (2026, 1, 'Enero', 42, 138.40, 48.20, 62.10, 88.00, 18),
  (2026, 2, 'Febrero', 40, 132.00, 47.50, 59.40, 89.00, 22),
  (2026, 3, 'Marzo', 46, 149.20, 55.10, 68.30, 91.00, 29),
  (2026, 4, 'Abril', 44, 142.80, 53.00, 65.00, 90.00, 25),
  (2026, 5, 'Mayo', 48, 156.30, 60.80, 71.20, 93.00, 34),
  (2026, 6, 'Junio', 50, 162.50, 64.20, 74.00, 94.00, 38),
  (2026, 7, 'Julio', 52, 168.00, 67.50, 76.50, 95.00, 41),
  (2026, 8, 'Agosto (Actual)', 36, 118.60, 49.30, 54.20, 96.00, 27);

SET FOREIGN_KEY_CHECKS = 1;
