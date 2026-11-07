import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Estudiante {
  id?: string;
  nombre: string;
  programa: string;
  semestre: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  // Unico lugar de configuracion de la URL base de la API
  private readonly apiUrl = 'http://localhost:8000/estudiantes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl).pipe(
      catchError((err) => this.manejarError(err))
    );
  }

  obtenerPorId(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${encodeURIComponent(id)}`).pipe(
      catchError((err) => this.manejarError(err))
    );
  }

  crear(estudiante: Estudiante): Observable<Estudiante> {
    const payload = {
      nombre: estudiante.nombre.trim(),
      programa: estudiante.programa.trim(),
      semestre: Number(estudiante.semestre)
    };
    return this.http.post<Estudiante>(this.apiUrl, payload).pipe(
      catchError((err) => this.manejarError(err))
    );
  }

  actualizar(id: string, estudiante: Estudiante): Observable<Estudiante> {
    const payload = {
      nombre: estudiante.nombre.trim(),
      programa: estudiante.programa.trim(),
      semestre: Number(estudiante.semestre)
    };
    return this.http.put<Estudiante>(`${this.apiUrl}/${encodeURIComponent(id)}`, payload).pipe(
      catchError((err) => this.manejarError(err))
    );
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(id)}`).pipe(
      catchError((err) => this.manejarError(err))
    );
  }

  private manejarError(error: HttpErrorResponse) {
    if (error.status === 0) {
      return throwError(() => new Error('No hubo conexión con el servidor (API apagada en http://localhost:8000).'));
    }
    if (error.status === 404) {
      return throwError(() => new Error('No se encontró ningún estudiante con ese ID en el backend (404 Not Found).'));
    }
    if (error.status === 422) {
      return throwError(() => new Error('No se encontró el registro: el ID ingresado no tiene formato UUID válido (422).'));
    }
    const detalle = error.error?.detail || error.message || 'Error desconocido';
    return throwError(() => new Error(`Error del backend (${error.status}): ${detalle}`));
  }
}
