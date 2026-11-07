import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  readonly menu = [
    { ruta: '/estudiantes', etiqueta: 'Estudiantes' },
    { ruta: '/productos', etiqueta: 'Productos' },
  ];
}