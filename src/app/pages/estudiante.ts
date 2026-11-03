import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EstudianteService } from '../services/estudiante.service';
import { Estudiante, EstudianteCrear } from '../models/estudiante.model';

@Component({
  selector: 'app-estudiantes',
  imports: [FormsModule],
  templateUrl: './estudiante.html',
  styleUrl: './estudiante.css'
})
export class Estudiantes implements OnInit {
  private readonly estudianteService = inject(EstudianteService);
  private readonly cdr = inject(ChangeDetectorRef); // <-- Inyectamos el detector de cambios

  estudiantes: Estudiante[] = [];
  formulario: EstudianteCrear = { nombre: '', programa: '', semestre: 1 };
  idEdicion: string | null = null;
  idBusqueda: string = '';
  mensajeAlerta: string = '';

  ngOnInit() {
    this.listarTodos();
  }

  listarTodos() {
    this.estudianteService.listar().subscribe({
      next: (datos) => {
        this.estudiantes = datos;
        this.mensajeAlerta = '';
        this.cdr.detectChanges(); // <-- Forzamos el redibujado de la tabla
      },
      error: () => {
        this.mensajeAlerta = 'Error de conexión con el backend';
        this.cdr.detectChanges();
      }
    });
  }

  buscar() {
    if (!this.idBusqueda.trim()) {
      this.listarTodos();
      return;
    }
    
    this.estudianteService.obtener(this.idBusqueda).subscribe({
      next: (estudiante) => {
        this.estudiantes = [estudiante];
        this.mensajeAlerta = '';
        this.cdr.detectChanges(); // <-- Actualizamos tras la búsqueda
      },
      error: () => {
        this.estudiantes = [];
        this.mensajeAlerta = 'Estudiante no encontrado en la base de datos';
        this.cdr.detectChanges();
      }
    });
  }

  guardar() {
    if (this.idEdicion) {
      this.estudianteService.actualizar(this.idEdicion, this.formulario).subscribe(() => {
        this.listarTodos(); // listarTodos ya incluye el detectChanges()
        this.limpiarFormulario();
      });
    } else {
      this.estudianteService.crear(this.formulario).subscribe(() => {
        this.listarTodos();
        this.limpiarFormulario();
      });
    }
  }

  cargarEnFormulario(estudiante: Estudiante) {
    this.idEdicion = estudiante.id;
    this.formulario = { 
      nombre: estudiante.nombre, 
      programa: estudiante.programa, 
      semestre: estudiante.semestre 
    };
    this.cdr.detectChanges(); // <-- Actualizamos para que los datos aparezcan en los inputs de inmediato
  }

eliminar(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.estudianteService.eliminar(id).subscribe(() => {
        this.listarTodos();
      });
    }
  }

  limpiarFormulario() {
    this.idEdicion = null;
    this.formulario = { nombre: '', programa: '', semestre: 1 };
    this.idBusqueda = ''; 
    this.cdr.detectChanges(); // <-- Actualizamos tras limpiar
  }
}