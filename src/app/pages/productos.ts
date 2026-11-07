import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Producto, ProductoCrear } from '../models/producto.model';
import { ProductoService } from '../services/producto.service';

interface FormularioProducto {
  nombre: string;
  descripcion: string;
  precio: number | null;
  stock: number | null;
}

@Component({
  selector: 'app-productos',
  imports: [FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  formulario: FormularioProducto = this.formularioVacio();
  idEdicion: string | null = null;
  idBusqueda = '';
  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'error';
  cargando = false;
  guardando = false;
  eliminandoId: string | null = null;

  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos(): void {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (datos) => {
        if (!Array.isArray(datos) || !datos.every((producto) => this.esProducto(producto))) {
          this.productos = [];
          this.mostrarError('El backend devolvió una respuesta inesperada al listar productos.');
        } else {
          this.productos = datos;
          this.mensaje = '';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        this.productos = [];
        this.mostrarError(this.mensajeError(error, 'No fue posible listar los productos.'));
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscar(): void {
    const id = this.idBusqueda.trim();
    if (!id) {
      this.listarTodos();
      return;
    }

    this.cargando = true;
    this.productoService.getProductoById(id).subscribe({
      next: (producto) => {
        if (!this.esProducto(producto)) {
          this.productos = [];
          this.mostrarError('El backend devolvió una respuesta inesperada al consultar el producto.');
        } else {
          this.productos = [producto];
          this.mensaje = '';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        this.productos = [];
        this.mostrarError(this.mensajeError(error, 'Producto no encontrado.'));
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  limpiarBusqueda(): void {
    this.idBusqueda = '';
    this.listarTodos();
  }

  guardar(formulario: NgForm): void {
    if (
      formulario.invalid ||
      !this.formulario.nombre.trim() ||
      this.formulario.precio === null ||
      !Number.isFinite(this.formulario.precio) ||
      this.formulario.stock === null ||
      !Number.isInteger(this.formulario.stock) ||
      this.formulario.stock < 0
    ) {
      formulario.control.markAllAsTouched();
      this.mostrarError('Complete los campos requeridos con valores válidos.');
      return;
    }

    const datos: ProductoCrear = {
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion.trim() || null,
      precio: this.formulario.precio,
      stock: this.formulario.stock,
    };

    this.guardando = true;
    const operacion = this.idEdicion
      ? this.productoService.updateProducto(this.idEdicion, datos)
      : this.productoService.createProducto(datos);

    operacion.subscribe({
      next: (producto) => {
        if (!this.esProducto(producto)) {
          this.mostrarError('El backend devolvió una respuesta inesperada al guardar el producto.');
        } else if (this.idEdicion) {
          this.reemplazarProducto(producto);
          this.mostrarExito('Producto actualizado correctamente.');
          this.limpiarFormulario(formulario);
        } else {
          this.productos = [...this.productos, producto];
          this.mostrarExito('Producto creado correctamente.');
          this.limpiarFormulario(formulario);
        }
        this.guardando = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        this.mostrarError(this.mensajeError(error, 'No fue posible guardar el producto.'));
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarEnFormulario(producto: Producto): void {
    this.idEdicion = producto.id;
    this.formulario = {
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: Number(producto.precio),
      stock: producto.stock,
    };
    this.mensaje = '';
    this.cdr.detectChanges();
  }

  eliminar(id: string, formulario?: NgForm): void {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    this.eliminandoId = id;
    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter((producto) => producto.id !== id);
        this.mostrarExito('Producto eliminado correctamente.');
        if (this.idEdicion === id) {
          this.limpiarFormulario(formulario);
        }
        this.eliminandoId = null;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        this.mostrarError(this.mensajeError(error, 'No fue posible eliminar el producto.'));
        this.eliminandoId = null;
        this.cdr.detectChanges();
      },
    });
  }

  limpiarFormulario(formulario?: NgForm): void {
    this.idEdicion = null;
    this.formulario = this.formularioVacio();
    formulario?.resetForm(this.formulario);
    this.cdr.detectChanges();
  }

  private formularioVacio(): FormularioProducto {
    return { nombre: '', descripcion: '', precio: null, stock: 0 };
  }

  private reemplazarProducto(actualizado: Producto): void {
    const existe = this.productos.some((producto) => producto.id === actualizado.id);
    this.productos = existe
      ? this.productos.map((producto) => (producto.id === actualizado.id ? actualizado : producto))
      : [...this.productos, actualizado];
  }

  private esProducto(valor: unknown): valor is Producto {
    if (typeof valor !== 'object' || valor === null) {
      return false;
    }
    const producto = valor as Record<string, unknown>;
    return (
      typeof producto['id'] === 'string' &&
      typeof producto['nombre'] === 'string' &&
      (typeof producto['descripcion'] === 'string' || producto['descripcion'] === null) &&
      (typeof producto['precio'] === 'string' || typeof producto['precio'] === 'number') &&
      typeof producto['stock'] === 'number'
    );
  }

  private mostrarExito(mensaje: string): void {
    this.mensaje = mensaje;
    this.tipoMensaje = 'success';
  }

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.tipoMensaje = 'error';
  }

  private mensajeError(error: unknown, noEncontrado = 'El producto no existe.'): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Ocurrió un error inesperado al comunicarse con el backend.';
    }
    if (error.status === 0) {
      return 'No fue posible establecer conexión con el backend. Verifique que esté ejecutándose.';
    }
    if (error.status === 404) {
      return noEncontrado;
    }

    const detalle =
      typeof error.error?.detail === 'string'
        ? error.error.detail
        : typeof error.error?.message === 'string'
          ? error.error.message
          : '';
    return detalle
      ? `Error HTTP ${error.status}: ${detalle}`
      : `Error HTTP ${error.status} al procesar la solicitud.`;
  }
}
