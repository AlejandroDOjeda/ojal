// Generado manualmente desde el schema de Supabase.
// Regenerar con: supabase gen types typescript --project-id <id> > lib/database.types.ts

export type TipoPersona = "fisica" | "juridica";
export type CondicionIva = "responsable_inscripto" | "monotributo" | "exento" | "consumidor_final";
export type TipoOperacion = "compra" | "venta";
export type TipoComprobante = "A" | "B" | "C" | "liquidacion_hacienda";
export type CondicionPago = "contado" | "cuenta_corriente";
export type EstadoFactura = "borrador" | "confirmada" | "pagada" | "cobrada" | "anulada";

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          nombre: string | null;
          apellido: string | null;
          razon_social: string | null;
          cuit_cuil: string | null;
          tipo_persona: TipoPersona | null;
          condicion_iva: CondicionIva | null;
          telefono: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nombre?: string | null;
          apellido?: string | null;
          razon_social?: string | null;
          cuit_cuil?: string | null;
          tipo_persona?: TipoPersona | null;
          condicion_iva?: CondicionIva | null;
          telefono?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nombre?: string | null;
          apellido?: string | null;
          razon_social?: string | null;
          cuit_cuil?: string | null;
          tipo_persona?: TipoPersona | null;
          condicion_iva?: CondicionIva | null;
          telefono?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      entidad_legal: {
        Row: {
          id: string;
          user_id: string;
          razon_social: string;
          cuit_cuil: string;
          tipo_persona: TipoPersona;
          condicion_iva: CondicionIva;
          email: string | null;
          telefono: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          razon_social: string;
          cuit_cuil: string;
          tipo_persona: TipoPersona;
          condicion_iva: CondicionIva;
          email?: string | null;
          telefono?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          razon_social?: string;
          cuit_cuil?: string;
          tipo_persona?: TipoPersona;
          condicion_iva?: CondicionIva;
          email?: string | null;
          telefono?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      categoria_hacienda: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          tasa_iva: number;
          activa: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          tasa_iva?: number;
          activa?: boolean;
          created_at?: string;
        };
        Update: {
          nombre?: string;
          descripcion?: string | null;
          tasa_iva?: number;
          activa?: boolean;
        };
        Relationships: [];
      };

      categoria_gasto: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          tasa_iva_habitual: number;
          activa: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          tasa_iva_habitual?: number;
          activa?: boolean;
          created_at?: string;
        };
        Update: {
          nombre?: string;
          descripcion?: string | null;
          tasa_iva_habitual?: number;
          activa?: boolean;
        };
        Relationships: [];
      };

      factura: {
        Row: {
          id: string;
          user_id: string;
          tipo_operacion: TipoOperacion;
          tipo_comprobante: TipoComprobante;
          punto_venta: string | null;
          numero: string | null;
          fecha: string;
          entidad_legal_id: string;
          condicion_pago: CondicionPago;
          fecha_vencimiento: string | null;
          estado: EstadoFactura;
          subtotal: number;
          iva_10_5: number;
          iva_21: number;
          total: number;
          observaciones: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tipo_operacion: TipoOperacion;
          tipo_comprobante: TipoComprobante;
          punto_venta?: string | null;
          numero?: string | null;
          fecha: string;
          entidad_legal_id: string;
          condicion_pago?: CondicionPago;
          fecha_vencimiento?: string | null;
          estado?: EstadoFactura;
          subtotal?: number;
          iva_10_5?: number;
          iva_21?: number;
          total?: number;
          observaciones?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tipo_operacion?: TipoOperacion;
          tipo_comprobante?: TipoComprobante;
          punto_venta?: string | null;
          numero?: string | null;
          fecha?: string;
          entidad_legal_id?: string;
          condicion_pago?: CondicionPago;
          fecha_vencimiento?: string | null;
          estado?: EstadoFactura;
          subtotal?: number;
          iva_10_5?: number;
          iva_21?: number;
          total?: number;
          observaciones?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      item_hacienda: {
        Row: {
          id: string;
          factura_id: string;
          categoria_hacienda_id: string;
          cabezas: number;
          kg_promedio: number | null;
          precio_por_kg: number | null;
          precio_por_cabeza: number | null;
          tasa_iva: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          factura_id: string;
          categoria_hacienda_id: string;
          cabezas: number;
          kg_promedio?: number | null;
          precio_por_kg?: number | null;
          precio_por_cabeza?: number | null;
          tasa_iva?: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          factura_id?: string;
          categoria_hacienda_id?: string;
          cabezas?: number;
          kg_promedio?: number | null;
          precio_por_kg?: number | null;
          precio_por_cabeza?: number | null;
          tasa_iva?: number;
          subtotal?: number;
        };
        Relationships: [];
      };

      item_gasto: {
        Row: {
          id: string;
          factura_id: string;
          descripcion: string;
          categoria_gasto_id: string | null;
          cantidad: number;
          precio_unitario: number;
          tasa_iva: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          factura_id: string;
          descripcion: string;
          categoria_gasto_id?: string | null;
          cantidad?: number;
          precio_unitario: number;
          tasa_iva?: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          factura_id?: string;
          descripcion?: string;
          categoria_gasto_id?: string | null;
          cantidad?: number;
          precio_unitario?: number;
          tasa_iva?: number;
          subtotal?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
