import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Estudiante, EstudianteActualizar, EstudianteCrear } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/estudiantes`;

  listar(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.base);
  }

  obtener(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.base}/${id}`);
  }

  crear(datos: EstudianteCrear): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.base, datos);
  }

  actualizar(id: string, datos: EstudianteActualizar): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.base}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}