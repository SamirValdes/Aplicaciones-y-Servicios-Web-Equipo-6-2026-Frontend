import { Routes } from '@angular/router';
import { Shell } from './layout/shell';
import { Estudiantes } from './pages/estudiante';
import { Productos } from './pages/productos';
import { PersonaComponent } from './pages/persona/persona.component';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'estudiantes', pathMatch: 'full' },
      { path: 'estudiantes', component: Estudiantes },
      { path: 'productos', component: Productos },
      { path: 'personas', component: PersonaComponent }
    ]
  }
];
