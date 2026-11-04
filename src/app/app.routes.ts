import { Routes } from '@angular/router';

import { Shell } from './layout/shell';
import { Estudiantes } from './pages/estudiante';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'estudiantes' },
      { path: 'estudiantes', component: Estudiantes }
    ],
  },
  { path: '**', redirectTo: 'estudiantes' },
];