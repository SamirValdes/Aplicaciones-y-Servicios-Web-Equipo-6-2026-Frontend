import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes.component';

const routes: Routes = [
  { path: '', redirectTo: '/estudiantes', pathMatch: 'full' },
  { path: 'estudiantes', component: EstudiantesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
