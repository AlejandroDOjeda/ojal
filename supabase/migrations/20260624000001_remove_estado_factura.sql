-- Eliminar EstadoFactura del sistema
ALTER TABLE "Factura" DROP COLUMN IF EXISTS "Id_EstadoFactura";
DROP TABLE IF EXISTS "EstadoFactura";
