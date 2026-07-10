// Schema de Supabase — PascalCase en tablas y columnas, integer IDs.
// Las tablas de referencia usan IDs numéricos fijos (seeded, sin ABM).

export interface Database {
  public: {
    Tables: {
      // ── Tablas de referencia (solo lectura) ──────────────────────────────
      TipoPersona:    { Row: { Id_TipoPersona: number;    Nombre: string }; Insert: never; Update: never; Relationships: [] };
      CondicionIva:   { Row: { Id_CondicionIva: number;   Nombre: string }; Insert: never; Update: never; Relationships: [] };
      TipoOperacion:  { Row: { Id_TipoOperacion: number;  Nombre: string }; Insert: never; Update: never; Relationships: [] };
      TipoComprobante:{ Row: { Id_TipoComprobante: number;Nombre: string }; Insert: never; Update: never; Relationships: [] };
      CondicionPago:  { Row: { Id_CondicionPago: number;  Nombre: string }; Insert: never; Update: never; Relationships: [] };
      // ── Campo (establecimientos por usuario) ────────────────────────────
      Campo: {
        Row: {
          Id_Campo:    number;
          Id_Profile:  string;
          Nombre:      string;
          Renspa:      string | null;
          Ubicacion:   string | null;
          Superficie:  number | null;
          CreatedAt:   string;
          UpdatedAt:   string;
        };
        Insert: {
          Id_Profile:   string;
          Nombre:       string;
          Renspa?:      string | null;
          Ubicacion?:   string | null;
          Superficie?:  number | null;
        };
        Update: {
          Nombre?:      string;
          Renspa?:      string | null;
          Ubicacion?:   string | null;
          Superficie?:  number | null;
        };
        Relationships: [{ foreignKeyName: "Campo_Id_Profile_fkey"; columns: ["Id_Profile"]; referencedRelation: "Profile"; referencedColumns: ["Id_Profile"] }];
      };

      // ── Profile (aislado por usuario, Id_Profile = UUID de auth) ─────────
      Profile: {
        Row: {
          Id_Profile:      string;
          Nombre:          string | null;
          Apellido:        string | null;
          RazonSocial:     string | null;
          CuitCuil:        string | null;
          Id_TipoPersona:  number | null;
          Id_CondicionIva: number | null;
          Telefono:        string | null;
          CreatedAt:       string;
          UpdatedAt:       string;
        };
        Insert: {
          Id_Profile:      string;
          Nombre?:         string | null;
          Apellido?:       string | null;
          RazonSocial?:    string | null;
          CuitCuil?:       string | null;
          Id_TipoPersona?: number | null;
          Id_CondicionIva?:number | null;
          Telefono?:       string | null;
        };
        Update: {
          Nombre?:         string | null;
          Apellido?:       string | null;
          RazonSocial?:    string | null;
          CuitCuil?:       string | null;
          Id_TipoPersona?: number | null;
          Id_CondicionIva?:number | null;
          Telefono?:       string | null;
        };
        Relationships: [];
      };

      // ── Tablas compartidas ───────────────────────────────────────────────
      EntidadLegal: {
        Row: {
          Id_EntidadLegal: number;
          RazonSocial:     string;
          CuitCuil:        string;
          Id_TipoPersona:  number;
          Id_CondicionIva: number;
          Email:           string | null;
          Telefono:        string | null;
          CreatedAt:       string;
          UpdatedAt:       string;
        };
        Insert: {
          RazonSocial:    string;
          CuitCuil:       string;
          Id_TipoPersona: number;
          Id_CondicionIva:number;
          Email?:         string | null;
          Telefono?:      string | null;
        };
        Update: {
          RazonSocial?:    string;
          CuitCuil?:       string;
          Id_TipoPersona?: number;
          Id_CondicionIva?:number;
          Email?:          string | null;
          Telefono?:       string | null;
        };
        Relationships: [];
      };

      CategoriaHacienda: {
        Row: { Id_CategoriaHacienda: number; Nombre: string; Descripcion: string | null; TasaIva: number; Activa: boolean; CreatedAt: string };
        Insert: { Nombre: string; Descripcion?: string | null; TasaIva?: number; Activa?: boolean };
        Update: { Nombre?: string; Descripcion?: string | null; TasaIva?: number; Activa?: boolean };
        Relationships: [];
      };

      CategoriaGasto: {
        Row: { Id_CategoriaGasto: number; Nombre: string; Descripcion: string | null; TasaIvaHabitual: number; Activa: boolean; CreatedAt: string };
        Insert: { Nombre: string; Descripcion?: string | null; TasaIvaHabitual?: number; Activa?: boolean };
        Update: { Nombre?: string; Descripcion?: string | null; TasaIvaHabitual?: number; Activa?: boolean };
        Relationships: [];
      };

      Factura: {
        Row: {
          Id_Factura:          number;
          Id_Profile:          string;
          Id_TipoOperacion:    number;
          Id_TipoComprobante:  number | null;
          PuntoVenta:          string | null;
          Numero:              string | null;
          Fecha:               string;
          Id_EntidadLegal:     number;
          Id_CondicionPago:    number;
          FechaVencimiento:    string | null;
          Subtotal:            number;
          Iva10_5:             number;
          Iva21:               number;
          NoGravado:           number;
          Total:               number;
          Observaciones:       string | null;
          CreatedAt:           string;
          UpdatedAt:           string;
        };
        Insert: {
          Id_Profile:          string;
          Id_TipoOperacion:    number;
          Id_TipoComprobante?: number | null;
          PuntoVenta?:         string | null;
          Numero?:             string | null;
          Fecha:               string;
          Id_EntidadLegal:     number;
          Id_CondicionPago?:   number;
          FechaVencimiento?:   string | null;
          Subtotal?:           number;
          Iva10_5?:            number;
          Iva21?:              number;
          NoGravado?:          number;
          Total?:              number;
          Observaciones?:      string | null;
        };
        Update: {
          Id_TipoComprobante?: number | null;
          PuntoVenta?:         string | null;
          Numero?:             string | null;
          Fecha?:              string;
          Id_EntidadLegal?:    number;
          Id_CondicionPago?:   number;
          FechaVencimiento?:   string | null;
          Subtotal?:           number;
          Iva10_5?:            number;
          Iva21?:              number;
          NoGravado?:          number;
          Total?:              number;
          Observaciones?:      string | null;
        };
        Relationships: [{ foreignKeyName: "Factura_Id_Profile_fkey"; columns: ["Id_Profile"]; referencedRelation: "Profile"; referencedColumns: ["Id_Profile"] }];
      };

      ItemHacienda: {
        Row: { Id_ItemHacienda: number; Id_Factura: number; Id_Campo: number; Id_CategoriaHacienda: number; Cabezas: number; KgPromedio: number | null; PrecioPorKg: number | null; PrecioPorCabeza: number | null; TasaIva: number; Subtotal: number; CreatedAt: string };
        Insert: { Id_Factura: number; Id_Campo: number; Id_CategoriaHacienda: number; Cabezas: number; KgPromedio?: number | null; PrecioPorKg?: number | null; PrecioPorCabeza?: number | null; TasaIva?: number; Subtotal: number };
        Update: { Cabezas?: number; KgPromedio?: number | null; PrecioPorKg?: number | null; PrecioPorCabeza?: number | null; TasaIva?: number; Subtotal?: number };
        Relationships: [];
      };

      ItemGasto: {
        Row: { Id_ItemGasto: number; Id_Factura: number; Descripcion: string; Id_CategoriaGasto: number | null; Cantidad: number; PrecioUnitario: number; TasaIva: number; Subtotal: number; CreatedAt: string };
        Insert: { Id_Factura: number; Descripcion: string; Id_CategoriaGasto?: number | null; Cantidad?: number; PrecioUnitario: number; TasaIva?: number; Subtotal: number };
        Update: { Descripcion?: string; Id_CategoriaGasto?: number | null; Cantidad?: number; PrecioUnitario?: number; TasaIva?: number; Subtotal?: number };
        Relationships: [];
      };

      Rodeo: {
        Row: { Id_Rodeo: number; Id_Campo: number; Id_CategoriaHacienda: number; Cabezas: number; CreatedAt: string; UpdatedAt: string };
        Insert: { Id_Campo: number; Id_CategoriaHacienda: number; Cabezas?: number };
        Update: { Cabezas?: number };
        Relationships: [
          { foreignKeyName: "Rodeo_Id_Campo_fkey"; columns: ["Id_Campo"]; referencedRelation: "Campo"; referencedColumns: ["Id_Campo"] },
          { foreignKeyName: "Rodeo_Id_CategoriaHacienda_fkey"; columns: ["Id_CategoriaHacienda"]; referencedRelation: "CategoriaHacienda"; referencedColumns: ["Id_CategoriaHacienda"] }
        ];
      };

      MovimientoRodeo: {
        Row: { Id_MovimientoRodeo: number; Id_Campo: number; TipoMovimiento: string; Id_CategoriaHacienda: number; Cabezas: number; Fecha: string; Id_Factura: number | null; Observaciones: string | null; CreatedAt: string };
        Insert: { Id_Campo: number; TipoMovimiento: string; Id_CategoriaHacienda: number; Cabezas: number; Fecha: string; Id_Factura?: number | null; Observaciones?: string | null };
        Update: { TipoMovimiento?: string; Id_CategoriaHacienda?: number; Cabezas?: number; Fecha?: string; Id_Factura?: number | null; Observaciones?: string | null };
        Relationships: [
          { foreignKeyName: "MovimientoRodeo_Id_Campo_fkey"; columns: ["Id_Campo"]; referencedRelation: "Campo"; referencedColumns: ["Id_Campo"] },
          { foreignKeyName: "MovimientoRodeo_Id_CategoriaHacienda_fkey"; columns: ["Id_CategoriaHacienda"]; referencedRelation: "CategoriaHacienda"; referencedColumns: ["Id_CategoriaHacienda"] },
          { foreignKeyName: "MovimientoRodeo_Id_Factura_fkey"; columns: ["Id_Factura"]; referencedRelation: "Factura"; referencedColumns: ["Id_Factura"] }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
