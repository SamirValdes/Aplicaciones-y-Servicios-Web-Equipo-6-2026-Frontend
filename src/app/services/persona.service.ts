import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://127.0.0.1:8000/personas';

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPersona(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crearPersona(persona: any): Observable<any> {
    return this.http.post(this.apiUrl, persona);
  }

  actualizarPersona(id: number, persona: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, persona);
  }

  eliminarPersona(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
