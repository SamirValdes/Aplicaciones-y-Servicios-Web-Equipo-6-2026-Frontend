import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService } from '../../services/persona.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css'
})
export class PersonaComponent implements OnInit {
  personas: any[] = [];
  personasFiltradas: any[] = [];
  personaActual: any = { id: null, nombre: '', email: '', telefono: '', activo: true }; 
  modoEdicion = false;
  terminoBusqueda: string = '';

  constructor(private personaService: PersonaService) {}

  ngOnInit() {
    this.obtenerPersonas();
  }

  obtenerPersonas() {
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        // La clave está aquí: al cargar la data, llenamos la tabla visible
        this.personasFiltradas = [...data]; 
      },
      error: (err) => console.error('Error al cargar personas:', err)
    });
  }

  guardarPersona() {
    const payload = {
      nombre: this.personaActual.nombre ? this.personaActual.nombre.trim() : '',
      email: this.personaActual.email ? this.personaActual.email.trim() : '',
      telefono: this.personaActual.telefono && this.personaActual.telefono.trim() !== '' 
        ? this.personaActual.telefono.trim() 
        : null,
      activo: Boolean(this.personaActual.activo)
    };

    if (payload.nombre.length < 2) {
      alert('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    if (!payload.email.includes('@') || !payload.email.includes('.')) {
      alert('Ingresa un email válido (ejemplo: correo@dominio.com).');
      return;
    }

    if (this.modoEdicion) {
      this.personaService.actualizarPersona(this.personaActual.id, payload).subscribe({
        next: () => {
          this.obtenerPersonas();
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error('Error al actualizar:', err.error);
          alert('Error al actualizar: ' + JSON.stringify(err.error?.detail || err.message));
        }
      });
    } else {
      this.personaService.crearPersona(payload).subscribe({
        next: () => {
          this.obtenerPersonas();
          this.limpiarFormulario();
        },
        error: (err) => {
          console.error('Error al crear:', err.error);
          alert('Error al crear: ' + JSON.stringify(err.error?.detail || err.message));
        }
      });
    }
  }

  editarPersona(persona: any) {
    this.personaActual = { ...persona };
    this.modoEdicion = true;
  }

  eliminarPersona(id: number) {
    if (confirm('¿Seguro que deseas eliminar a esta persona?')) {
      this.personaService.eliminarPersona(id).subscribe({
        next: () => this.obtenerPersonas(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  buscarPersonas() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) {
      this.personasFiltradas = [...this.personas];
      return;
    }
    this.personasFiltradas = this.personas.filter(p => 
      (p.id !== null && p.id !== undefined && p.id.toString().includes(termino)) ||
      (p.nombre && p.nombre.toLowerCase().includes(termino)) || 
      (p.email && p.email.toLowerCase().includes(termino)) ||
      (p.telefono && p.telefono.toLowerCase().includes(termino))
    );
  }

  limpiarFormulario() {
    this.personaActual = { id: null, nombre: '', email: '', telefono: '', activo: true };
    this.modoEdicion = false;
  }
}
