export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: string;
  stock: number;
}

export interface ProductoCrear {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
}

export type ProductoActualizar = ProductoCrear;
