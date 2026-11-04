export interface Estudiante {
  id: string;
  nombre: string;
  programa: string;
  semestre: number;
}

export type EstudianteCrear = Omit<Estudiante, 'id'>;

export type EstudianteActualizar = EstudianteCrear;