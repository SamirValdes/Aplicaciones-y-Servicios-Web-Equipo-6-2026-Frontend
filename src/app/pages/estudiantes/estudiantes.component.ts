import { Component, OnInit } from '@angular/core';
import { Estudiante, EstudianteService } from '../../services/estudiante.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  filtroId: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';
  ultimaOperacion: string = '';
  cargando: boolean = false;

  editandoId: string | null = null;
  formulario: Estudiante = {
    nombre: '',
    programa: '',
    semestre: 1
  };

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.cargarColeccion(false);
  }

  private obtenerHoraActual(): string {
    return new Date().toLocaleTimeString();
  }

  limpiarMensajes(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  // 1. GET /estudiantes (Listar toda la coleccion)
  cargarColeccion(mostrarAlerta: boolean = true): void {
    this.limpiarMensajes();
    this.filtroId = '';
    this.cargando = true;

    this.estudianteService.listar().subscribe({
      next: (datos) => {
        this.estudiantes = datos;
        this.cargando = false;
        this.ultimaOperacion = `GET /estudiantes (200 OK) - ${this.obtenerHoraActual()}`;
        if (mostrarAlerta) {
          this.mensajeExito = `GET /estudiantes ejecutado: ${datos.length} registro(s) cargado(s) desde el backend (${this.obtenerHoraActual()}).`;
        }
      },
      error: (err) => {
        this.estudiantes = [];
        this.cargando = false;
        this.ultimaOperacion = `Error en GET /estudiantes - ${this.obtenerHoraActual()}`;
        this.mensajeError = err.message;
      }
    });
  }

  // 2. GET /estudiantes/{id} (Consultar uno por ID)
  buscarPorId(): void {
    this.limpiarMensajes();
    const idLimpio = this.filtroId.trim();

    if (!idLimpio) {
      this.mensajeError = 'Por favor ingrese o pegue un ID (UUID) en la caja de búsqueda antes de consultar.';
      return;
    }

    this.cargando = true;
    this.estudianteService.obtenerPorId(idLimpio).subscribe({
      next: (estudiante) => {
        this.estudiantes = [estudiante];
        this.cargando = false;
        this.ultimaOperacion = `GET /estudiantes/${idLimpio} (200 OK) - ${this.obtenerHoraActual()}`;
        this.mensajeExito = `Estudiante encontrado mediante GET /estudiantes/${idLimpio} (${this.obtenerHoraActual()}).`;
      },
      error: (err) => {
        this.estudiantes = [];
        this.cargando = false;
        this.ultimaOperacion = `GET /estudiantes/${idLimpio} (No encontrado) - ${this.obtenerHoraActual()}`;
        this.mensajeError = err.message;
      }
    });
  }

  // Ayuda rapida para copiar el ID al buscador con un clic
  usarIdEnBuscador(id?: string): void {
    if (!id) return;
    this.filtroId = id;
    this.limpiarMensajes();
    this.mensajeExito = 'ID copiado en el buscador. Ahora haz clic en "Buscar por ID (GET)".';
  }

  // 3. POST /estudiantes y 4. PUT /estudiantes/{id}
  guardar(): void {
    this.limpiarMensajes();

    if (!this.formulario.nombre.trim() || !this.formulario.programa.trim()) {
      this.mensajeError = 'El nombre y el programa académico son obligatorios.';
      return;
    }

    if (!this.formulario.semestre || this.formulario.semestre < 1) {
      this.mensajeError = 'El semestre debe ser un número mayor o igual a 1.';
      return;
    }

    this.cargando = true;

    if (this.editandoId) {
      const idActual = this.editandoId;
      this.estudianteService.actualizar(idActual, this.formulario).subscribe({
        next: () => {
          this.cancelarEdicion();
          this.estudianteService.listar().subscribe({
            next: (datos) => {
              this.estudiantes = datos;
              this.cargando = false;
              this.ultimaOperacion = `PUT /estudiantes/${idActual} (200 OK) - ${this.obtenerHoraActual()}`;
              this.mensajeExito = `Estudiante actualizado con PUT /estudiantes/${idActual} y tabla sincronizada con el backend.`;
            },
            error: (err) => {
              this.cargando = false;
              this.mensajeError = err.message;
            }
          });
        },
        error: (err) => {
          this.cargando = false;
          this.mensajeError = err.message;
        }
      });
    } else {
      this.estudianteService.crear(this.formulario).subscribe({
        next: (creado) => {
          this.resetFormulario();
          this.estudianteService.listar().subscribe({
            next: (datos) => {
              this.estudiantes = datos;
              this.cargando = false;
              this.ultimaOperacion = `POST /estudiantes (201 Created) - ${this.obtenerHoraActual()}`;
              this.mensajeExito = `Estudiante "${creado.nombre}" creado con POST /estudiantes y persistido en el backend.`;
            },
            error: (err) => {
              this.cargando = false;
              this.mensajeError = err.message;
            }
          });
        },
        error: (err) => {
          this.cargando = false;
          this.mensajeError = err.message;
        }
      });
    }
  }

  seleccionarParaEditar(est: Estudiante): void {
    this.limpiarMensajes();
    this.editandoId = est.id || null;
    this.formulario = {
      nombre: est.nombre,
      programa: est.programa,
      semestre: est.semestre
    };
    this.mensajeExito = `Editando a "${est.nombre}". Modifica los campos y presiona "Actualizar (PUT)".`;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.formulario = { nombre: '', programa: '', semestre: 1 };
  }

  // 5. DELETE /estudiantes/{id}
  eliminar(est: Estudiante): void {
    if (!est.id) return;
    this.limpiarMensajes();
    this.cargando = true;
    const idEliminar = est.id;

    this.estudianteService.eliminar(idEliminar).subscribe({
      next: () => {
        this.estudianteService.listar().subscribe({
          next: (datos) => {
            this.estudiantes = datos;
            this.cargando = false;
            this.ultimaOperacion = `DELETE /estudiantes/${idEliminar} (204 No Content) - ${this.obtenerHoraActual()}`;
            this.mensajeExito = `Estudiante "${est.nombre}" eliminado del backend mediante DELETE /estudiantes/${idEliminar}.`;
          },
          error: (err) => {
            this.cargando = false;
            this.mensajeError = err.message;
          }
        });
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.message;
      }
    });
  }
}
