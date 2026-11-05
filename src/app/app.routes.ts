import { Routes } from '@angular/router';

import { Shell } from './layout/shell';
import { Estudiantes } from './pages/estudiante';
import { Productos } from './pages/productos';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'estudiantes' },
      { path: 'estudiantes', component: Estudiantes },
      { path: 'productos', component: Productos },
    ],
  },
  { path: '**', redirectTo: 'estudiantes' },
];