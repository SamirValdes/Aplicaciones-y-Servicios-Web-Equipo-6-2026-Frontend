import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Producto, ProductoActualizar, ProductoCrear } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/productos`;

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  getProductoById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  createProducto(datos: ProductoCrear): Observable<Producto> {
    return this.http.post<Producto>(this.base, datos);
  }

  updateProducto(id: string, datos: ProductoActualizar): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, datos);
  }

  deleteProducto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
